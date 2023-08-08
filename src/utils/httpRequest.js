import axios from "axios";

const request = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
});

const freeRequest = axios.create()

export const freeGet = async (path, options = {}) => {
    const response = await freeRequest.get(path, options)
    return response
}

export const get = async (path, options = {}) => {
    const response = await request.get(path, options);
    return response.data;
};