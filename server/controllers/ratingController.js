import Rating from "../models/ratingModel.js"
import Freelancer from "../models/freelancerModel.js"



const getRatings = async (req, res) => {
    try {
        let freelancerId = req.params.fid

        let ratings = await Rating.find({ freelancer: freelancerId }).populate('user')

        res.status(200).json(ratings)

    } catch (error) {
        console.error("getRatings error:", error)
        res.status(500).json({ message: error.message })
    }
}

const addRating = async (req, res) => {
    try {
        let userId = req.user._id

        const { rating, review } = req.body

        if (!rating || !review) {
            res.status(409)
            return res.json({ message: "Please fill all details!" })
        }

        const newRating = await Rating.create({
            user: userId,
            freelancer: req.params.fid,
            rating: Number(rating),
            review
        })

        // Populate user info so UI can display reviewer details
        await newRating.populate('user')

        // Recompute and update freelancer's avg rating
        const allRatings = await Rating.find({ freelancer: req.params.fid })
        if (allRatings.length > 0) {
            const avg = allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length
            await Freelancer.findOneAndUpdate(
                { user: req.params.fid },
                { rating: Math.round(avg * 10) / 10, ratingCount: allRatings.length },
                { new: true }
            )
        }

        res.status(201).json(newRating)

    } catch (error) {
        console.error("addRating error:", error)
        res.status(500).json({ message: error.message })
    }
}


const ratingController = { getRatings, addRating }

export default ratingController