import axios from "axios";
import React from "react";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const authenticateUser = async (username: string, password: string) => {
    try {
        const response = await axios.get(`${BASE_URL}/auth`);
        if (response.data) {
            if(response.data.username === username && response.data.password === password) {
                return true;
            }
        } else {
            return false;
        }
    }
    catch (error) {
        console.error("Authentication failed:", error);
        throw error;
    } 
};

export { authenticateUser };