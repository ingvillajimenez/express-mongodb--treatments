const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../../models/User');
const Treatment = require('../../models/Treatment');
const Appointment = require('../../models/Appointment');

const index = (req, res) => {
    Treatment
        .find()
        .exec()
        .then(data => {
            res.json({
                type: 'Getting treatments',
                data: data
            })
            .status(200)
        })
        .catch(err => {
            console.log(`caught error: ${err}`);
            return res.status(500).json(err);
        })
}

const findBy = (req, res) => {
    Treatment
        .findById(req.params.treatmentId)
        .then(data => {
            res.json({
                type: 'Found treatment by id',
                data: data
            })
            .status(200)
        })
        .catch(err => {
            console.log(`caught error: ${err}`);
            return res.status(500).json(err);
        })
}

const createAppointment = (body, day) => {
    const newAppointment = new Appointment({
        _id: mongoose.Types.ObjectId(),
        name: 'Juan',
        phoneNumber: 657578968,
        day,
        treatment: body._id,
        user: body.user
    })
    newAppointment.save()

    return newAppointment._id
}

const create = (req, res) => {
    const newIds = req.body.listOfTreatments.split(' ')
    const newTreatment = new Treatment({
        _id: mongoose.Types.ObjectId(),
        description: req.body.description,
        listOfTreatments: req.body.listOfTreatments,
        user: req.body.user,
        listOfAppointments: newIds.map((day) => createAppointment(req.body, day)) 
        // 1. si tenemos 5 tratamientos se crean 5 citas
        // 2. si tenemos 5 citas, tenemos 5 id que estaran en lista de citas
        
    })
    newTreatment
        .save()
        .then(data => {
            res.json({
                type: 'New Treatment',
                data: data
            })
            .status(200)
        })
        .catch(err => {
            console.log(`caught error: ${err}`);
            return res.status(500).json(err);
        })
}

const deleteBy = (req, res) => {
    Treatment
        .findById(req.params.treatmentId, (err, treatment) => {
            if(!err) {
                Appointment.deleteMany({treatment: {$in: [treatment._id]}}, (err) => {})
                treatment
                    .remove()
                    .then(() => {
                        res
                            .status(200)
                            .json({
                                message: 'Treatment was deleted.'
                            });
                    });
            }
        })
        .catch(err => {
            console.log(`caught error: ${err}`);
            return res.status(401).json({message: 'You do not have permision to delete'});
        })
}

module.exports = {
    index,
    findBy,
    create,
    deleteBy
    // updateBy,
    // findTreatmentsBy
}