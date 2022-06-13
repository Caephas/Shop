import axios from "axios"

export const axiosInstance = axios.create(
    {
        baseURL : "https://caephas-ecommerce.herokuapp.com/api/"
    }
)