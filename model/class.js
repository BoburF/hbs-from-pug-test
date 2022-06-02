const fs = require('fs')
const path = require('path')
const { v4: uuidv4 } = require('uuid');

class Data {
    constructor(name, password, img, id) {
        this.name = name,
        this.password = password
        this.img = img
        this.id = uuidv4()
    }

    toObj() {
        return {
            name: this.name,
            password: this.password,
            img: this.img,
            id: this.id
        }
    }

    static async findById(id) {
        const books = await Data.dbRead()
        console.log(books);

        return new Promise((resolve, reject) => {
            const book = books.find(user => user.id === id)
            if (!book) {
                return reject('Book not found')
            }
            resolve(book)
        })
    }

    static async removeById(id) {
        let users = await Data.dbRead()
        return new Promise((resolve, reject) => {
            let idx = users.findIndex(book => book.id === id)
            if (idx === -1) {
                return reject('Book id is not true')
            }
            users.splice(idx, 1)
            fs.writeFile(
                path.join(__dirname, '..', 'data', 'db.json'),
                JSON.stringify({ users }),
                (err) => {
                    if (err) reject(err)
                    else resolve()
                })
        })
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

    async updateById(id) {
        const users = await Data.dbRead()
        const book = this.toObj()
        let idx = users.findIndex(book => book.id === id)
        users[idx] = book

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
}


module.exports = Data