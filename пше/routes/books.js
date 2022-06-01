const express = require('express')
const router = express.Router()
const Joi = require('joi')
const authMiddleware = require('../middleware/auth')
const Data = require('../model/class')
// const books = [
//     { name: 'Atomic habits', year: 2000, id: 1 },
//     { name: 'Harry potter', year: 2008, id: 2 },
//     { name: 'Rich dad and poor dad', year: 2010, id: 3 },
// ]

// View all books
router.get('/', async (req, res) => {
    const users = await Data.dbRead()
    res.render('books', {
        title: 'All user',
        users,
        isBooks: true
    })
})

// Get request with query
router.get('/sort', (req, res) => {
    const book = books.find((book) => req.query.name === book.name)
    // const book = books.find((book) => +req.query.id === book.id)
    if (book) {
        // Clientga chiqariladi
        res.status(200).send(book)
    } else {
        res.status(400).send('Bu ismli kitob mavjud emas...')
    }
})

// Get request with params
router.get('/:id/:polka', (req, res) => {
    // console.log(req.params.id);
    // console.log(req.params.polka);
    // Parametr aniqlanadi
    const id = +req.params.id
    // Parametrni tekshirish kerak
    // Bazadan qidiriladi parametr bo'yicha
    const book = books.find((book) => book.id === id)
    if (book) {
        // Clientga chiqariladi
        res.status(200).send(book)
    } else {
        res.status(400).send('Bu parametrli kitob mavjud emas...')
    }

})

router.get('/add', (req,res)=>{
    res.render('booksForm', {
        title: 'FormBook'
    })
})

// POST request
router.post('/add', authMiddleware, (req, res) => {
    // Baza chaqiramiz
    // let allBooks = books  // []

    // Validatsiya // hiyalaymiz
    let bookSchema = Joi.object({
        name: Joi.string().min(3).max(30).required(),
        password: Joi.string().min(5).required(),
        img: Joi.string().required()
    })

    const result = bookSchema.validate(req.body)
    // console.log(!!result.error);  // error bor bo'lsa true yo'q bo'lsa false deydi

    if (result.error) {
        res.status(400).send(result.error.message);
        return
    }
    // console.log(!!result.error);  // error bor bo'lsa true yo'q bo'lsa false deydi

    // Obyektni yaratamiz yangi kitobni
    let users = new Data(req.body.name, req.body.password, req.body.img)

    users.pushUser()

    // bazaga qo'shamiz

    // kitoblarni klientga qaytaramiz
    // res.status(201).send(allBooks)
    res.status(201).redirect('/api/books')
})

// PUT request
router.put('/update/:id', authMiddleware, (req, res) => {
    let allBooks = books
    // id orqali yangilanmoqchi bo'lgan obj ni index kalitini topamiz
    const idx = allBooks.findIndex(book => book.id === +req.params.id)
    // yangi obj ni idx joylaymiz // [idx] = {newObj}

    // Validatsiya // hiyalaymiz
    let bookSchema = Joi.object({
        name: Joi.string().min(3).max(30).required(),
        year: Joi.number().integer().min(1900).max(2022).required(),
    })

    validateBody(req.body, bookSchema, res)

    let updatedBook = {
        name: req.body.name,
        year: req.body.year,
        id: +req.params.id,
    }

    allBooks[idx] = updatedBook

    res.status(200).send(updatedBook)
})

// Delete request
router.delete('/delete/:id', authMiddleware, (req, res) => {
    const idx = books.findIndex(book => book.id === +req.params.id)
    books.splice(idx, 1)
    res.status(200).send(books)
})

function validateBody(body, bookSchema, res) {
    const result = bookSchema.validate(body)
    // console.log(!!result.error);  // error bor bo'lsa true yo'q bo'lsa false deydi

    if (result.error) {
        res.status(400).send(result.error.message);
        return
    }
}

module.exports = router