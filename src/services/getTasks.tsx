import axios from "axios";
import React from "react";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const getTodoTasks = async (id?: string) => {
    try {
        const response = await axios.get(`${BASE_URL}/todo${id ? `/${id}` : ""}`);
        if (response.data) {
            console.log("Fetched tasks:", response.data);
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

export { getTodoTasks };