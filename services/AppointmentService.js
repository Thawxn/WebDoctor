const appointment = require('../models/Appointment');
const mongoose = require('mongoose');
const Appo = mongoose.model('Appointment', appointment);
const AppointmentFactory = require('../Factories/AppointmentFactory')
const transport = require('nodemailer')

class AppointmentService {
    async Create(name, email, cpf, description, date, time){
        var newAppo = new Appo({
            name,
            email,
            cpf,
            description,
            date,
            time,
            finished: false,
            notified: false
        })

        try {
            await newAppo.save();
            return true
        } catch (error) {
            console.log(error);
            return false
        }
    }

    async GetAll(showFinished){
        if(showFinished){
            return await Appo.find();
        }else{
            var appos = await Appo.find({'finished': false})
            var appointments = [];

            appos.forEach(appointment => {
                if(appointment.date != undefined){
                    appointments.push( AppointmentFactory.Build(appointment) )
                }
                
            })

            return appointments

        }
    }

    async GetById(id){
        try{
            var event = await Appo.findById({'_id': id});
            return event
        }catch(err){
            console.log(err)
        }
        
    }

    async Finish(id){
        try{
            await Appo.findByIdAndUpdate(id, {finished: true});
            return true;
        }catch(err){
            console.log(err);
            return false;
        }
    }

    async Search(query){
        try{
            var appos = await Appo.find().or([{email: query},{cpf: query}])
            return appos
        }catch(err){
            console.log(err)
            return []
        }
        
    }

    async sendNotification(){
        var appos = await this.GetAll(false);
        var mailer = transport.createTransport({
            host: 'sandbox.smtp.mailtrap.io',
            port: 2525,
            auth: {
                user: 'cb5e117c4d89c1',
                pass: '38b38c31842fc2'
            }
        })

        appos.forEach(async app => {
            var date = app.start.getTime();
            var hour = 1000 * 60 * 60;
            var get = date-Date.now();

            if(get <= hour){
                if(!app.notified){
                    await Appo.findByIdAndUpdate(app.id, ({notified: true}))

                    mailer.sendMail({
                        from: 'Lucas Marques <lucas@gmail.com>',
                        to: app.email,
                        subject: 'Consulta',
                        text: 'Olá, você tem uma consulta marcada hoje daqui 1hr, aguardamos você!'
                    })

                }
            }
        })
    }
};

module.exports = new AppointmentService();