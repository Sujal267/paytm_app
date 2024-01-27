const express = require("express")
const userRouter = express.Router();
const zod = require("zod")
const jwt = require("jsonwebtoken")
const JWT_SECRET = require("../config")
const mongoose = require("mongoose")

mongoose.connect("mongodb+srv://sujalsanga:Sujal%402003@cluster26.b3x2vtb.mongodb.net/paytm")

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    firstname: String,
    lastname: String
})

const accountSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    balance: {
        type: Number,
        required: true
    }
})

const User = mongoose.model("User", userSchema)
const Account = mongoose.model('Account', accountSchema);

const signupBody = zod.object({
    username: zod.string().email(),
    password: zod.string().min(6),
    firstname: zod.string(),
    lastname: zod.string()
})

userRouter.post("/signup", async (req, res) => {
    const body = req.body;
    const { success } = signupBody.safeParse(body);
    if (!success) {
        return res.status(411).json({
            msg: "Incorrect credentials"
        })
    }
    const found = await User.findOne({
        username: body.username
    })
    if (found) {
        return res.status(410).json({
            msg: "User alredy exists"
        })
    }
    const user = await User.create({
        username: body.username,
        password: body.password,
        firstname: body.firstname,
        lastname: body.lastname
    })
    const userId = user._id

    await Account.create({
        userId,
        balance: (1 + Math.random()) * 1000
    })


    const token = jwt.sign({ userId: user._id }, JWT_SECRET)
    res.status(200).json({
        msg: "User creaeted successfully",
        token: token
    })
})

const signinBody = zod.object({
    username: zod.string().email(),
    password: zod.string().min(6)
})

userRouter.post("/signin", async (req, res) => {
    const body = req.body;
    const { success } = signinBody.safeParse(body)
    if (!success) {
        return res.status(411).json({
            msg: "Invalid credentials"
        })
    }
    const user = await User.findOne({
        username: req.body.username,
        password: req.body.password
    });

    if (user) {
        const token = jwt.sign({
            userId: user._id
        }, JWT_SECRET);

        res.json({
            msg: "User signed",
            token: token,
            firstname:user.firstname
        })
        return;
    }

    res.status(410).json({
        message: "Error while logging in,user does not exists"
    })
})

userRouter.get("/bulk", async (req, res) => {
    const filter = JSON.stringify(req.query.filter)
    const users = await User.find()
    return res.status(200).json({
        user: users.map(user => ({
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname,
            _id: user._id
        }))
    })
})


module.exports = {
    userRouter,
    Account,
    User
};