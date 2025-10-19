import axios from "axios";
import React from "react";

const BASE_URL = process.env.REACT_APP_BASE_URL;

interface TaskData {
    title: string;
    description: string;
    dueDate: string;
    priority: string;
    status: string;
    assignedUser: string;
}

const addTask = async (data: TaskData) => {
    try {
        const response = await axios.post(`${BASE_URL}/todo`, data);
        if (response.data) {
            console.log("Task added:", response.data);
            return true;
        } else {
            return false;
        }
    }
    catch (error) {
        console.error("Error adding task:", error);
        throw error;
    }
};

export { addTask };