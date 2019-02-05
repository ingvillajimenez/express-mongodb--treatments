const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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

const updateBy = (req, res) => {
    User
        .updateOne({_id: req.params.userId}, {name: req.body.name, email: req.body.email})
        .then(data => {
            res
                .json({
                    type: 'Update user',
                    data: data
                })
                .status(200)
        })
        .catch(err => {
            console.log(`caugth err ${err}`);
            return res.status(500).json(err);
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
    signup
}