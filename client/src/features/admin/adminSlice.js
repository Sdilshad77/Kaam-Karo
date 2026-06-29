import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import adminService from './adminService'

const initialState = {
    users: [],
    adminLoading: false,
    adminSuccess: false,
    adminError: false,
    adminErrorMessage: ""
}

// ======================
// ASYNC THUNKS
// ======================

// GET ALL USERS
export const getAllUsers = createAsyncThunk(
    "FETCH/ADMIN/USERS",
    async (_, thunkAPI) => {

        try {

            const token = thunkAPI.getState()?.auth?.user?.token

            if (!token) {
                return thunkAPI.rejectWithValue("No token found")
            }

            return await adminService.fetchAllUsers(token)

        } catch (error) {

            const message =
                error?.response?.data?.message ||
                error?.message ||
                "Failed to fetch users"

            return thunkAPI.rejectWithValue(message)
        }
    }
)


// GRANT CREDITS
export const grantCredits = createAsyncThunk(
    "ADD/ADMIN/CREDITS",
    async (userDetails, thunkAPI) => {

        try {

            const token = thunkAPI.getState()?.auth?.user?.token

            if (!token) {
                return thunkAPI.rejectWithValue("No token found")
            }

            return await adminService.updateCredits(token, userDetails)

        } catch (error) {

            const message =
                error?.response?.data?.message ||
                error?.message ||
                "Failed to update credits"

            return thunkAPI.rejectWithValue(message)
        }
    }
)


// ======================
// SLICE
// ======================

const adminSlice = createSlice({
    name: 'admin',
    initialState,

    reducers: {

        resetAdminState: (state) => {
            state.adminLoading = false
            state.adminSuccess = false
            state.adminError = false
            state.adminErrorMessage = ""
        }

    },

    extraReducers: (builder) => {

        builder

            // ======================
            // GET ALL USERS
            // ======================

            .addCase(getAllUsers.pending, (state) => {
                state.adminLoading = true
                state.adminSuccess = false
                state.adminError = false
                state.adminErrorMessage = ""
            })

            .addCase(getAllUsers.fulfilled, (state, action) => {
                state.adminLoading = false
                state.adminSuccess = true
                state.users = action.payload
                state.adminError = false
            })

            .addCase(getAllUsers.rejected, (state, action) => {
                state.adminLoading = false
                state.adminSuccess = false
                state.adminError = true
                state.adminErrorMessage = action.payload
            })


            // ======================
            // GRANT CREDITS
            // ======================

            .addCase(grantCredits.pending, (state) => {
                state.adminLoading = true
                state.adminSuccess = false
                state.adminError = false
                state.adminErrorMessage = ""
            })

            .addCase(grantCredits.fulfilled, (state, action) => {

                state.adminLoading = false
                state.adminSuccess = true
                state.adminError = false

                state.users = state.users.map((user) =>
                    user._id === action.payload._id
                        ? action.payload
                        : user
                )
            })

            .addCase(grantCredits.rejected, (state, action) => {
                state.adminLoading = false
                state.adminSuccess = false
                state.adminError = true
                state.adminErrorMessage = action.payload
            })
    }
})


// EXPORTS
export const { resetAdminState } = adminSlice.actions

export default adminSlice.reducer