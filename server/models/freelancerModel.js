import mongoose from "mongoose";

const freelancerSchema = new mongoose.Schema({
    user: {
        type: String,
        ref: "User",
        required: true
    },
    description: {
        type: String,
        required: true
    },
    skills: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    experience: {
        type: Number,
        required: true
    },
    rating: {
        type: Number,
        default: 0
    },
    ratingCount: {
        type: Number,
        default: 0
    },
}, {
    timestamps: true
})

const Freelancer = mongoose.model("Freelancer", freelancerSchema)

export default Freelancer