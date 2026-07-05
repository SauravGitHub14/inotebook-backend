const express = require('express');
const User = require('../models/User')
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs')
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser')

const JWT_SECRET = process.env.JWT_SECRET;
// ROUTE-1 :- create a user using : POST "/api/auth/createuser". no login required
router.post('/createuser',
    [
        body('name', 'Enter a Valid name').isLength({ min: 3 }),
        body('email', 'Enter a valid email').isEmail(),
        body('password', 'password must be atleast 6 character').isLength({ min: 4 }),
    ],
    async (req, res) => {
        let success = false;
        // if there are error return bad request or error
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success,errors: errors.array() });
        }
        // check user/ email is already exist in db
        try {
            let user = await User.findOne({ email: req.body.email });
            if (user) {
                return res.status(400).json({success, error: "Sorry a user wtih this email is already exist!" })
            }

            const salt = await bcrypt.genSalt(10);
            const secPass = await bcrypt.hash(req.body.password, salt)

            user = await User.create({
                name: req.body.name,
                email: req.body.email,
                // password: req.body.password,
                password: secPass,
            });
            const data = {
                user: {
                    id: user.id
                }
            }
            const authtoken = jwt.sign(data, JWT_SECRET);
            console.log(authtoken);
            success =true
            res.json({ success,authtoken })

        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error Occur!");
        }
    })

// Route 2:- for login user using creds : POST "/api/auth/login"  
router.post('/login',
    [
        body('email', 'Enter a valid email').isEmail(),
        body('password', 'password cannot be blank').exists(),
    ],
    async (req, res) => {
        let success = false;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success,errors: errors.array() });
        }
        const { email, password } = req.body
        try {
            let user = await User.findOne({ email });
            if (!user) {
                const success = false
                return res.status(400).json({ success,error: "Please enter correct credentials" })
            }
            const passwordCompare = await bcrypt.compare(password, user.password);
            if (!passwordCompare) {
                let success = false
                return res.status(400).json({success,error: "Please enter correct credentials" })
            }
            const data = {
                user: {
                    id: user.id
                }
            }
            const authtoken = jwt.sign(data, JWT_SECRET);
            success = true;
            res.json({ success,authtoken })
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error Occur!");
        }
    });

// Route 3:- Get User loggedIn details using POST: POST "/api/auth/getuser". Login required
router.post('/getuser', fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password")
        res.send(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error Occur!");
    }
})

module.exports = router





//line35
       // .then(user => res.json(user))
        //   .catch(err => console.log(err))
        //   res.json({error: 'Please Enter a unique Value for email'}))

        // console.log(req.body);
        // const user = User(req.body);
        // user.save();
        //  res.send(req.body);