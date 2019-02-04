const { Router } = require('express');
const app = Router();

const Users = require('../controllers/users/users');
const Treatments = require('../controllers/treatments/treatments');
const Appointments = require('../controllers/appointments/appointments');

// user routes
app.get('/users', Users.index);
app.get('/users/:userId', Users.findBy);
app.get('/users/:userId/treatments', Users.findTreatmentsBy)
app.post('/users', Users.create);
app.put('/users/:userId', Users.updateBy);
// app.delete('/users/:userId', Users.removeBy);

// treatment routes
app.get('/treatments', Treatments.index);
app.get('/treatments/:treatmentId', Treatments.findBy);
// app.get('/treatments/:treatmentId/appointments', Treatments.findAppointmentsBy);
app.post('/treatments', Treatments.create);
// app.put('/treatments/:treatmentId', Treatments.updateBy);
// app.delete('/treatment/:userId', Treatment.removeBy);

// appointment routes
app.get('/appointments', Appointments.index);
app.get('/appointments/:appointmentId', Appointments.removeBy)
// app.get('/appointments/:appointmentsId', Appointments.findBy);
// app.post('/appointments', Appointments.create);
// app.put('/appointments/:appointmentsId', Appointments.updateBy);
// app.delete('/treatment/:userId', Treatment.removeBy);

module.exports = app;
