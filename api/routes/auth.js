const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const Joi = require("joi")
// const bcrypt = require("bcrypt")

//REGISTER
router.post("/register", async (req, res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(
            req.body.password,
            process.env.PASS_SEC
        ).toString(), 
    });

    try {
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(500).json(err);
    }
});


//LOGIN
// router.post("/login", async (req, res)=> {
//     try {
//         const {error} = validate(req.body)
//         if (error){
//             return res.status(400).send({message: error.details[0].message})
//         }
//         const user = await User.findOne({email: req.body.email})
//         if(!user){
//             return res.status(401).send({message: "Invalid Email or Password"})
//         }
//         const validPassword = await bcrypt.compare(
//             req.body.password, user.password
//         )
//         if(!validPassword){
//             return res.status(401).send({message: "Invalid Email or Password"})
//         }
//         const token = user.generateAuthToken()
//         res.status(200).send({data: token, message: "Logged in successfully"})
//     }catch (error) {
//         res.status(500).send({message: "Internal Server Error"})
//     }
// })

router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        !user && res.status(401).json("Wrong credentials!");

        const hashedPassword = CryptoJS.AES.decrypt(
            user.password,
            process.env.PASS_SEC
        );
        const OriginalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

        OriginalPassword !== req.body.password &&
            res.status(401).json("Wrong credentials!");

        const accessToken = jwt.sign(
            {
                id: user._id,
                isAdmin: user.isAdmin,
            },
            process.env.JWT_SEC,
            { expiresIn: "3d" }
        );

        const { password, ...others } = user._doc;

        res.status(200).json({ ...others, accessToken });
    } catch (err) {
        res.status(500).json(err);
    }
});

const validate = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required().label("Email"),
        password: Joi.string().required().label("Password")
    })
    return schema.validate(data)
}
module.exports = router;
