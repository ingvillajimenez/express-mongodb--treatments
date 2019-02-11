const { Router } = require('express');
const app = Router();

//requerir Auth
const isAuthenticated = require('../../services/Auth');

const Users = require('../controllers/users/users');
const Treatments = require('../controllers/treatments/treatments');
const Appointments = require('../controllers/appointments/appointments');

// user routes
app.get('/users', isAuthenticated, Users.index);
app.get('/users/:userId', isAuthenticated, Users.findBy);
app.get('/users/:userId/treatments', isAuthenticated, Users.findTreatmentsBy)
app.put('/users/:userId', isAuthenticated, Users.updateBy);
app.delete('/users/:userId', isAuthenticated, Users.deleteBy);

//auth routes (para crear un usuario para que se registre)
app.post('/auth/signup', Users.signup);
app.post('/auth/login', Users.login);

// treatment routes
app.get('/treatments', isAuthenticated, Treatments.index);
app.get('/treatments/:treatmentId', isAuthenticated, Treatments.findBy);
// app.get('/treatments/:treatmentId/appointments', Treatments.findAppointmentsBy);
app.post('/treatments', isAuthenticated, Treatments.create);
// app.put('/treatments/:treatmentId', Treatments.updateBy);
app.delete('/treatments/:treatmentId', isAuthenticated, Treatments.deleteBy);

// appointment routes
app.get('/appointments', Appointments.index);
app.get('/appointments/:appointmentId', Appointments.removeBy);
// app.get('/appointments/:appointmentsId', Appointments.findBy);
// app.post('/appointments', Appointments.create);
// app.put('/appointments/:appointmentsId', Appointments.updateBy);
// app.delete('/treatment/:userId', Treatment.removeBy);

module.exports = app;
