import express from "express";
import jwt from "jsonwebtoken";
import Users from "../models/Users.js";
import bcrypt from "bcrypt";
import { loginValidator, registerValidator } from '../validators/validators.js';
import checkAuth from "../middleware/check_auth.js"

const router = express.Router();

router.post('/login', async (request, response) => {
    const { errors, isValid } = loginValidator(request.body);
    if(!isValid) {
        response.json({ success: false, errors });
    } else {
        Users.findOne({ email: request.body.email }).then(user => {
            if(!user) {
                response.json({ message: "Email does not exist", success: false });
            }
            else{
                bcrypt.compare(request.body.password, user.password).then(success => {
                    if(!success) {
                        response.json({ message: 'Invalid Password', success: false });
                    } else {
                        const payload = {
                            id: user._id,
                            name: user.firstName
                        }
                        jwt.sign(
                            payload,
                            process.env.APP_SECRET, { expiresIn: 2155978926 },
                            (error, token) => {
                                response.json({
                                    user,
                                    token: 'Bearer token: ' + token,
                                    success: true
                                })
                            }
                        )
                    }
                })
            }
        })
    }
})

router.post('/register', async (req, res) => {
    const { errors, isValid } = registerValidator(req.body);       

    if (!isValid) {
        return res.status(400).json({ success: false, errors });
    }
    else{
        const { firstName, lastName, email, password } = req.body;
        const registerUser = new Users({
            firstName,
            lastName,
            email,
            password
        });
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(registerUser.password, salt, (hashErr, hash) => {
                if(err || hashErr) {
                    res.json({ message: "Error occurred hashing", success: false});
                    return;
                }
                registerUser.password = hash;
                registerUser.save().then(() => {
                    res.json({ "message": "User created successfully", "success": true});
                }).catch(er => res.json({ message: er.message, success: false}));
            })
        })
    } 
});

router.get('/:id', checkAuth, (request, response) => {
    Users.findOne({ _id: request.params.id}).then(user => {
        response.json({ user, success: true})
    }).catch(error => {
        response.json({ success: false, message: error.message});
    })
})

export default router;
