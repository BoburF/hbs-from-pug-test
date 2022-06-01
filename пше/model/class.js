const fs = require('fs')
const path = require('path')

class Data {
    constructor(name, password, img) {
        this.name = name,
        this.password = password
        this.img = img
    }

    toObj() {
        return {
            name: this.name,
            password: this.password,
            img: this.img
        }
    }

    async pushUser() {
        const users = await Data.dbRead()
        const book = this.toObj()

        users.push(book)
        console.log(users);
        return new Promise((resolve, rej) => {
            fs.writeFile(
                path.join(__dirname, "..", "data", "db.json"),
                JSON.stringify({ users }),
                (err)=>{
                    if(err) rej(err)
                    else resolve()
                }
                )
        })
    }

    static async dbRead() {
        return new Promise((resolve, reject) => {
            // console.log(this.toObj());
            // resolve(this.toObj())

            fs.readFile(path.join(__dirname, '..', 'data', 'db.json'), 'utf-8', (err, content) => {
                if (err) reject(err)
                else resolve(JSON.parse(content).users)
            })
        })
    }
}


module.exports = Data