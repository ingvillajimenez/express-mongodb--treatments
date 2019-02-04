const mongoose = require('mongoose');
const Appointment = require('../../models/Appointment');

const index = (req, res) => {
    Appointment
        .find()
        .exec()
        .then(data => {
            res.json({
                type: 'Getting appointmens',
                data: data
            })
            .status(200)
        })
        .catch(err => {
            console.log(`caught error: ${err}`);
            return res.status(500).json(err);
        })
}

const removeBy = (req, res) => {
    Appointment.
        deleteOne({_id: req.params.appointmentId})
        .then(data => {
            res.json({
                type: 'Removing an appointment',
                data: data
            })
            .status(200)
        })
        .catch(err => {
            console.log(`caught error: ${err}`);
            return res.status(500).json(err);
        })
}

module.exports = {
    index,
    removeBy
    // findBy,
    // create
    // updateBy,
    // findTreatmentsBy
}