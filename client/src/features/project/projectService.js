// import axios from "axios"

// const fetchProjects = async () => {

//     const response = await axios.get("/api/project")
//     return response.data

// }

// const createProject = async (formData, token) => {

//     let options = {
//         headers: {
//             authorization: `Bearer ${token}`
//         }
//     }


//     const response = await axios.post("/api/project/add", formData, options)
//     return response.data

// }


// const checkBids = async (projectId, token) => {
//     let options = {
//         headers: {
//             authorization: `Bearer ${token}`
//         }
//     }
//     const response = await axios.get("/api/project/" + projectId, options)
//     return response.data

// }


// const acceptBid = async (bidId, status, token) => {
//     let options = {
//         headers: { authorization: `Bearer ${token}` }
//     }
//     const response = await axios.post("/api/project/" + bidId, { status }, options)
//     return response.data
// }


// const projectService = { fetchProjects, createProject, checkBids, acceptBid }

// export default projectService

import API from "../../app/axiosConfig"

const fetchProjects = async () => {
    const response = await API.get("/api/project")
    return response.data
}

const createProject = async (formData, token) => {
    let options = {
        headers: {
            authorization: `Bearer ${token}`
        }
    }

    const response = await API.post("/api/project/add", formData, options)
    return response.data
}

const checkBids = async (projectId, token) => {
    let options = {
        headers: {
            authorization: `Bearer ${token}`
        }
    }

    const response = await API.get("/api/project/" + projectId, options)
    return response.data
}

const acceptBid = async (bidId, status, token) => {
    let options = {
        headers: {
            authorization: `Bearer ${token}`
        }
    }

    const response = await API.post(
        "/api/project/" + bidId,
        { status },
        options
    )

    return response.data
}

const projectService = {
    fetchProjects,
    createProject,
    checkBids,
    acceptBid
}

export default projectService