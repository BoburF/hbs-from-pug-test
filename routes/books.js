const express = require('express')
const router = express.Router()
// const Joi = require('joi')
const authMiddleware = require('../middleware/auth')
const Data = require('../model/class')


// View all books
router.get('/', async (req, res) => {
    const users = await Data.dbRead()
    res.render('books', {
        title: 'All user',
        users,
        isBooks: true
    })
})

router.get('/add', (req, res) => {
    res.render('booksForm', {
        title: 'User Add'
    })
})

router.post('/add', (req, res) => {
    const user = new Data(req.body.name, req.body.password, req.body.img)
    user.pushUser()
    res.redirect('/api/books')
})

router.get('/update/:id', (req,res) => {
    res.render('update', {
        title: 'Update',
        usersid: req.params.id
    })
})

router.post('/update/:id/add', (req,res) => {
    const user = new Data(req.body.name, req.body.password, req.body.img)

    user.updateById(req.params.id)

    res.redirect('/api/books')
})

// View chosen user
router.get('/:id', async (req, res) => {
    // const user = new Data()
    Data.findById(req.params.id).then(user => {
        console.log('ishladi');
        res.status(201).render('user', {
            title: user.name,
            user
        })
    }).catch(err => res.redirect('/404'))
    
})

// Delete choosen user
router.get('/delete/:id', async (req, res) => {
    await Data.removeById(req.params.id)
    console.log('ish');
    res.status(200).redirect('/api/books')
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