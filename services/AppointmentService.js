const appointment = require('../models/Appointment');
const mongoose = require('mongoose');
const Appo = mongoose.model('Appointment', appointment);
const AppointmentFactory = require('../Factories/AppointmentFactory')

class AppointmentService {
    async Create(name, email, cpf, description, date, time){
        var newAppo = new Appo({
            name,
            email,
            cpf,
            description,
            date,
            time,
            finished: false
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
};

module.exports = new AppointmentService();