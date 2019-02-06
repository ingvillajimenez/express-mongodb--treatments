const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../../models/User');
const Treatment = require('../../models/Treatment')

const index = (req, res) => {
    User
        .find()
        .exec()
        .then(data => {
            res
                .json({
                    type: 'Getting users',
                    data: data,
                    total: data.length
                })
                .status(200)
        })
        .catch(err => {
            console.log(`caugth err: ${err}`);
            return res.status(500).json(err);
        })
}

const findBy = (req, res) => {
    User
        .findById(req.params.userId)
        .exec()
        .then(data => {
            res.json({
                type: 'Found User by Id',
                data: data
            })
            .status(200)
        })
        .catch(err => {
            console.log(`caugth err: ${err}`);
            return res.status(500).json(err);
        })
}

const create = (req, res) => {
    const newUser = new User({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        email: req.body.email
    })
    newUser
        .save()
        .then(data => {
            res
                .json({
                    type: 'New User',
                    data: data
                })
                .status(200)
        })
        .catch(err => {
            console.log(`caugth err: ${err}`);
            return res.status(500).json({message: `Post Failed`});
        })
}

const signup = (req, res) => {
    User
        .find({email: req.body.email})
        .exec()
        .then(users => {
            if(users.length < 1) {
                //save new user using bcrypt
                bcrypt.hash(req.body.password, 10, (error, hash) => {
                    if(error) {
                        return res
                                .status(500)
                                .json({
                                    message: error
                                })
                    }
                    //create new user
                    const newUser =  new User ({
                        _id: mongoose.Types.ObjectId(),
                        name: req.body.name,
                        email: req.body.email,
                        password: hash,
                        phoneNumber: req.body.phoneNumber
                    });

                    newUser
                        .save()
                        .then(saved => {
                            res
                                .status(200)
                                .json({
                                    message: 'User created successfully',
                                    data: saved
                                });
                        })
                });
            } else {
                res
                    .status(422)
                    .json({
                        message: 'User already exists.'
                    })
            }
        })
}

const login = (req, res) => {
    User
        .find({email: req.body.email})
        .exec()
        .then(user => {
            if(user.length > 0) {
                //comparacion de passwords
                bcrypt.compare(req.body.password, user[0].password, (error, result) => {
                    if(error) {
                        return res
                                .status(401)
                                .json({
                                    message: 'Authentication Failed'
                                })
                    }
                    //se crea token
                    if(result) {
                        const token = jwt.sign({
                            name: user[0].name,
                            email: user[0].email
                        }, process.env.JWT_SECRETKEY, {
                            expiresIn: '1hr'
                        });

                        return res
                                .status(200)
                                .json({
                                    message: 'Authentication Successful',
                                    token
                                });
                    }

                    res
                        .status(401)
                        .json({
                            message: 'Authentication Failed'
                        })
                });
            } else {
                res
                    .status(422)
                    .json({
                        message: 'Authentication Failed'
                    })
            }
        })
}

const updateBy = (req, res) => {
    User
        .findOne({_id: req.params.userId})
        .then(user => {
            bcrypt.compare(req.body.password, user.password, (error, result) => {
                if(result) {
                    user.name = req.body.name;
                    user.email = req.body.email;
                    user.phoneNumber = req.body.phoneNumber;

                    user
                        .save()
                        .then(saved => {
                            res
                                .status(201)
                                .json({
                                    message: 'User updated successfuly',
                                    user: saved
                                });
                        })
                } else {
                    bcrypt.hash(req.body.password, 10, (error, hash) => {
                        if(error) {
                            return res
                                    .status(500)
                                    .json({
                                        message: error
                                    });
                        }

                        user.name = req.body.name;
                        user.email = req.body.email;
                        user.phoneNumber = req.body.phoneNumber;
                        user.password = hash;

                        user
                            .save()
                            .then(saved => {
                                res
                                    .status(201)
                                    .json({
                                        message: 'User updated successfully',
                                        user: saved
                                    });
                            })
                    });
                }
            });
        })
        .catch(err => {
            console.log(`caught the error: ${err}`);
            return res.status(404).json({'type': "Not Found."});
        })
}

const findTreatmentsBy = (req, res) => {
    Treatment
        .find({user: req.params.userId})
        // .populate()
        .exec()
        .then(data => {
            res
                .json({
                    type: 'Finding the treatment',
                    data: data
                })
                .status(200)
        })
        .catch(err => {
            console.log(`caugth err ${err}`);
            return res.status(500).json(err);
        })
}

module.exports = {
    index,
    create,
    findBy,
    updateBy,
    findTreatmentsBy,
    signup,
    login
}