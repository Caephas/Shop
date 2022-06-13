const mongoose = require("mongoose");
const jwt = require('jsonwebtoken')
const joi = require('joi')
const passwordComplexity = require('joi-password-complexity');
const Joi = require("joi");


const UserSchema = new mongoose.Schema(
    {   firstName: {type: String, required: true, unique: true},
        lastName: {type: String, required: true, unique: true},
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        isAdmin: {
            type: Boolean,
            default: false,
        },
        img: { type: String },
    },
    { timestamps: true }
);

UserSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SEC, { expiresIn: "7d" })
    return token
}
const User = mongoose.model("user", UserSchema)

const validate = (data) => {
    const schema = Joi.object({
        firstName: Joi.string().required().label("First Name"),
        lastName: Joi.string().required().label("Last Name"),
        username: Joi.string().required().label("Username"),
        email: Joi.string().email().required().label("Email"),
        password: passwordComplexity().required().label("Password")
    })
    return schema.validate(data)
}

module.exports = {User,validate}
// module.exports = mongoose.model("User", UserSchema);
