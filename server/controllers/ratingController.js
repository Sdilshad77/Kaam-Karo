import Rating from "../models/ratingModel.js"



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

        res.status(201).json(newRating)

    } catch (error) {
        console.error("addRating error:", error)
        res.status(500).json({ message: error.message })
    }
}


const ratingController = { getRatings, addRating }

export default ratingController