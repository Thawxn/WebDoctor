const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const mongoose = require('mongoose')
const appointmentService = require('./services/AppointmentService');

app.use(express.static('public'))

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/data', {useNewUrlParser: true, useUnifiedTopology: true})

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/cadastro', (req, res) => {
    res.render('create')
})

app.post('/cadastro', async (req, res) => {
    var status = await appointmentService.Create(
        req.body.name,
        req.body.email,
        req.body.cpf,
        req.body.description,
        req.body.date,
        req.body.time
    )

    if(status){
        res.redirect('/')
    }else{
        res.send('Ocorreu um erro na validação!')
    }
})

app.get('/consultas', async (req, res) => {
    var appointments = await appointmentService.GetAll(false);
    res.json(appointments)

})

app.get('/event/:id', async (req, res) => {
    var appoId = await appointmentService.GetById(req.params.id)

    if(appoId == undefined){
        console.log('Cliente não existe!')
        res.redirect('/')
    }else{
        console.log(appoId)
        res.render('event', {appo: appoId});
    }

})

app.post('/finish', async (req, res) => {
    var id = req.body.id;
    var result = await appointmentService.Finish(id);

    res.redirect('/');
})

app.listen(8080, () => {})