import jwt from "jsonwebtoken"
import User from "../models/userModel.js";

const forAuthUsers = async (req, res, next) => {

    try {
        if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer ")) {
            res.status(401)
            throw new Error("UnAuthorised Access : No Token Found")
        }

        // Extract Token From Headers
        let token = req.headers.authorization.split(" ")[1]

        // Check Token
        let decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find User
        let user = await User.findById(decoded.id).select("-password")

        if (!user) {
            res.status(401)
            throw new Error("UnAuthorised Access : User Not Found")
        }

        //    Add User Into Request Object
        req.user = user

        next()

    } catch (error) {
        console.error("forAuthUsers Error:", error);
        res.status(res.statusCode <= 200 ? 401 : res.statusCode)
        next(new Error(error.message || "UnAuthorised Access : Access Denied"))
    }

}

const forAdmin = async (req, res, next) => {

    try {
        if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer ")) {
            res.status(401)
            throw new Error("UnAuthorised Access : No Token Found")
        }

        // Extract Token From Headers
        let token = req.headers.authorization.split(" ")[1]

        // Check Token
        let decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find User
        let user = await User.findById(decoded.id).select("-password")

        if (!user) {
            res.status(401)
            throw new Error("UnAuthorised Access : User Not Found")
        }

        //    Add User Into Request Object
        req.user = user

        // Check if user is admin
        if (user.isAdmin) {
            next()
        } else {
            res.status(403)
            throw new Error("UnAuthorised Access : Admin Only")
        }

    } catch (error) {
        console.error("forAdmin Error:", error);
        res.status(res.statusCode <= 200 ? 401 : res.statusCode)
        next(new Error(error.message || "UnAuthorised Access : Access Denied"))
    }

}

const protect = { forAuthUsers, forAdmin }

export default protect