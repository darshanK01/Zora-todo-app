import axios from "axios";
import React from "react";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const getUsers = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/users`);
        if (response.data) {
            console.log("Fetched users:", response.data);
            return response.data;
        } else {
            return false;
        }
    }
    catch (error) {
        console.error("Authentication failed:", error);
        throw error;
    } 
};

export { getUsers };