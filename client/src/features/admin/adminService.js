import API from "../axiosConfig";



const fetchAllUsers = async (token) => {
  const options = {
    headers: {
      authorization: `Bearer ${token}`,
    },
  };

  const response = await API.get("/api/admin/users", options);
  return response.data;
};

const updateCredits = async (token, userDetails) => {
  const options = {
    headers: {
      authorization: `Bearer ${token}`,
    },
  };

  const response = await API.put(
    `/api/admin/users/${userDetails._id}`,
    userDetails,
    options
  );

  return response.data;
};

const adminService = { fetchAllUsers, updateCredits };

export default adminService;