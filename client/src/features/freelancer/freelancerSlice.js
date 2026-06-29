import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import freelancerService from './freelancerService';

const initialState = {
    freelancers: [],
    freelancer: null,
    ratings: [],
    freelancerLoading: false,
    freelancerSuccess: false,
    freelancerError: false,
    freelancerErrorMessage: ""
}

const freelancerSlice = createSlice({
    name: 'freelancer',
    initialState,
    reducers: {
        resetFreelancer: (state) => {
            state.freelancerSuccess = false
            state.freelancerError = false
            state.freelancerErrorMessage = ""
            state.freelancerLoading = false
        },
        clearFreelancerError: (state) => {
            state.freelancerError = false
            state.freelancerErrorMessage = ""
        }
    },
    extraReducers: (builder) => {
        builder
            // ── GET ALL FREELANCERS ──────────────────────────────────────
            .addCase(getFreelancers.pending, (state) => {
                state.freelancerLoading = true
                state.freelancerError = false
            })
            .addCase(getFreelancers.fulfilled, (state, action) => {
                state.freelancerLoading = false
                state.freelancerSuccess = true
                state.freelancerError = false
                state.freelancers = action.payload
            })
            .addCase(getFreelancers.rejected, (state, action) => {
                state.freelancerLoading = false
                state.freelancerError = true
                state.freelancerErrorMessage = action.payload
            })

            // ── GET SINGLE FREELANCER ────────────────────────────────────
            .addCase(getFreelancer.pending, (state) => {
                state.freelancerLoading = true
                state.freelancerError = false
            })
            .addCase(getFreelancer.fulfilled, (state, action) => {
                state.freelancerLoading = false
                state.freelancerSuccess = true
                state.freelancerError = false
                state.freelancer = action.payload
            })
            .addCase(getFreelancer.rejected, (state, action) => {
                state.freelancerLoading = false
                state.freelancerError = true
                state.freelancerErrorMessage = action.payload
                state.freelancer = null
            })

            // ── BECOME FREELANCER ────────────────────────────────────────
            .addCase(becomeFreelancer.pending, (state) => {
                state.freelancerLoading = true
                state.freelancerError = false
            })
            .addCase(becomeFreelancer.fulfilled, (state, action) => {
                state.freelancerLoading = false
                state.freelancerSuccess = true
                state.freelancerError = false
                // action.payload has { user, freelancer }
                // We store the freelancer profile for local reference
                if (action.payload?.freelancer) {
                    state.freelancer = { profile: action.payload.freelancer, previousWorks: [] }
                }
            })
            .addCase(becomeFreelancer.rejected, (state, action) => {
                state.freelancerLoading = false
                state.freelancerError = true
                state.freelancerErrorMessage = action.payload
            })

            // ── CREATE RATING ────────────────────────────────────────────
            .addCase(createRating.pending, (state) => {
                state.freelancerLoading = true
                state.freelancerError = false
            })
            .addCase(createRating.fulfilled, (state, action) => {
                state.freelancerLoading = false
                state.freelancerSuccess = true
                state.freelancerError = false
                state.ratings = [action.payload, ...state.ratings]
            })
            .addCase(createRating.rejected, (state, action) => {
                state.freelancerLoading = false
                state.freelancerError = true
                state.freelancerErrorMessage = action.payload
            })

            // ── GET RATINGS ──────────────────────────────────────────────
            .addCase(getRatings.pending, (state) => {
                state.freelancerLoading = true
                state.freelancerError = false
            })
            .addCase(getRatings.fulfilled, (state, action) => {
                state.freelancerLoading = false
                state.freelancerSuccess = true
                state.freelancerError = false
                state.ratings = action.payload
            })
            .addCase(getRatings.rejected, (state, action) => {
                state.freelancerLoading = false
                state.freelancerError = true
                state.freelancerErrorMessage = action.payload
            })

            // ── ADD PREVIOUS WORK ────────────────────────────────────────
            .addCase(addPreviousProject.pending, (state) => {
                state.freelancerLoading = true
                state.freelancerError = false
            })
            .addCase(addPreviousProject.fulfilled, (state, action) => {
                state.freelancerLoading = false
                state.freelancerSuccess = true
                state.freelancerError = false
                if (state.freelancer) {
                    state.freelancer = {
                        ...state.freelancer,
                        previousWorks: [action.payload, ...(state.freelancer.previousWorks || [])]
                    }
                }
            })
            .addCase(addPreviousProject.rejected, (state, action) => {
                state.freelancerLoading = false
                state.freelancerError = true
                state.freelancerErrorMessage = action.payload
            })
    }
});

export const { resetFreelancer, clearFreelancerError } = freelancerSlice.actions
export default freelancerSlice.reducer


// ── THUNKS ───────────────────────────────────────────────────────────────────

// Get All Freelancers
export const getFreelancers = createAsyncThunk("FETCH/FREELANCERS", async (_, thunkAPI) => {
    try {
        return await freelancerService.fetchFreelancers()
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch freelancers")
    }
})

// Get Single Freelancer Profile
export const getFreelancer = createAsyncThunk("FETCH/FREELANCER", async (id, thunkAPI) => {
    try {
        return await freelancerService.fetchFreelancer(id)
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || "Freelancer not found")
    }
})

// Become a Freelancer
export const becomeFreelancer = createAsyncThunk("BECOME/FREELANCER", async (formData, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token
    try {
        return await freelancerService.becomeFreelancer(formData, token)
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to register as freelancer")
    }
})

// Add Previous Work / Portfolio Project
export const addPreviousProject = createAsyncThunk("ADD/PREV_WORK", async (formData, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token
    try {
        return await freelancerService.addProject(formData, token)
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to add project")
    }
})

// Place a Bid on a Project
export const createBid = createAsyncThunk("BID/PROJECT", async (formData, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token
    try {
        return await freelancerService.bidToProject(formData, token)
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to place bid")
    }
})

// Create a Rating/Review
export const createRating = createAsyncThunk("RATING/ADD", async (formData, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token
    try {
        return await freelancerService.addRating(formData, token)
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to submit review")
    }
})

// Get Ratings for a Freelancer
export const getRatings = createAsyncThunk("RATING/GET", async (id, thunkAPI) => {
    try {
        return await freelancerService.fetchRatings(id)
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch ratings")
    }
})