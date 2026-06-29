import axios from "axios"


const register = async (formData) => {
    const response = await axios.post("/api/auth/register", formData)
    localStorage.setItem('user', JSON.stringify(response.data))
    return response.data
}

const login = async (formData) => {
    const response = await axios.post("/api/auth/login", formData)
    localStorage.setItem('user', JSON.stringify(response.data))
    return response.data
}

const updateProfile = async (formData, token) => {
    const options = { headers: { authorization: `Bearer ${token}` } }
    const response = await axios.put("/api/auth/update-profile", formData, options)
    localStorage.setItem('user', JSON.stringify(response.data))
    return response.data
}


const authService = { register, login, updateProfile }


export default authService