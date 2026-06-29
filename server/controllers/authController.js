import bcrypt from "bcryptjs";

import User from "../models/userModel.js"
import jwt from "jsonwebtoken";

const registerUser = async (req, res) => {

    // Check if all fields are coming
    const { name, email, phone, password, profilePic } = req.body

    if (!name || !email || !password || !phone) {
        res.status(409)
        throw new Error("Please Fill All Details!")
    }

    // Check if user exists
    const phoneExist = await User.findOne({ phone: phone })
    const emailExist = await User.findOne({ email: email })

    if (phoneExist || emailExist) {
        res.status(401)
        throw new Error("User Already Exists!")
    }

    // Hash Password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);


    const user = await User.create({
        name, email, phone, password: hashedPassword, profilePic
    })


    if (!user) {
        res.status(409)
        throw new Error("User Not Registered")
    }

    res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        profilePic: user.profilePic,
        isAdmin: user.isAdmin,
        isFreelancer: user.isFreelancer,
        token: generateToken(user._id)
    })

}

const loginUser = async (req, res) => {
    // Check if all fields are coming
    const { email, password } = req.body

    if (!email || !password) {
        res.status(409)
        throw new Error("Please Fill All Details!")
    }

    let user = await User.findOne({ email: email })

    if (user && bcrypt.compareSync(password, user.password)) {
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            profilePic: user.profilePic,
            isAdmin: user.isAdmin,
            isFreelancer: user.isFreelancer,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error("Invalid Credentials")
    }


}


const privateController = (req, res) => {
    res.send("Request Made By : " + req.user.name)
}



// Generate Token 
const generateToken = (id) => {
    let token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' })
    return token
}


const updateUserProfile = async (req, res) => {
    const { name, phone, profilePic } = req.body

    const userId = req.user._id

    // Get the original token from Authorization header to return it back
    const token = req.headers.authorization.split(" ")[1]

    // Check if phone is taken by another user
    if (phone) {
        const phoneExist = await User.findOne({ phone, _id: { $ne: userId } })
        if (phoneExist) {
            res.status(409)
            throw new Error("Phone number already in use!")
        }
    }

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { name, phone, profilePic },
        { new: true, runValidators: true }
    ).select("-password")

    if (!updatedUser) {
        res.status(404)
        throw new Error("User not found!")
    }

    res.status(200).json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        profilePic: updatedUser.profilePic,
        isAdmin: updatedUser.isAdmin,
        isFreelancer: updatedUser.isFreelancer,
        credits: updatedUser.credits,
        token
    })
}


const authController = { registerUser, loginUser, privateController, updateUserProfile }

export default authController