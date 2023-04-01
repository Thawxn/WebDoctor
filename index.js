const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const mongoose = require('mongoose')

app.use(express.static('public'))

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/data', {useNewUrlParser: true, useUnifiedTopology: true})

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.send('Hello Word!')
})

app.get('/cadastro', (req, res) => {
    res.render('create')
})

app.listen(8080, () => {})