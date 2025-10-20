import { zodResolver } from "@hookform/resolvers/zod";
import {
    Button,
    Paper,
    TextField,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import z, { set } from "zod";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import { getUsers } from "../../services/getUsers";
import { addTask } from "../../services/addTask";
import SnackBar from "../../utils/SnackBar";
import TaskForm from "../../components/TaskForm/TaskForm";
import { getTodoTasks } from "../../services/getTasks";

const newTaskSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    dueDate: z.string().min(1, "Due date is required"),
    priority: z.string().min(1, "Priority is required"),
    status: z.string().min(1, "Status is required"),
    assignedUser: z.string().min(1, "Assigned user is required"),
});

type NewTaskFormInputs = z.infer<typeof newTaskSchema>;

interface TaskType {
    title: string;
    description?: string;
    dueDate: string;
    priority: string;
    status: string;
    assignedUser: string;
}

const EditTask: React.FC = () => {

    const [taskData, setTaskData] = React.useState<TaskType>({
        title: '',
        description: '',
        dueDate: '',
        priority: '',
        status: '',
        assignedUser: '',
    });

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const id = params.get('id');
        const fetchTasks = async () => {
            try {
                const data = await getTodoTasks(id || undefined);
                console.log("Task data for editing:", data);
                setTaskData(data);
            } catch (err) {
                console.error("Failed to fetch tasks:", err);
            }
        };
        fetchTasks();
    }, []);


    const [dueDate, setDueDate] = React.useState<Dayjs | null>(null);
    const [users, setUsers] = React.useState<Array<{ id: string; name: string }>>([]);
    const [showSnackbar, setShowSnackbar] = React.useState<boolean>(false);
    const [snackbarData, setSnackbarData] = React.useState<{ message: string; type: 'success' | 'error' }>({ message: '', type: 'success' });

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const id = params.get('id');
        const fetchTasks = async () => {
            try {
                const data = await getTodoTasks(id || undefined);
                setTaskData(data);
            } catch (err) {
                console.error("Failed to fetch tasks:", err);
            }
        };
        fetchTasks();
    }, []);

    const constructPayload = (data: NewTaskFormInputs) => {
        return {
            title: data.title,
            description: data.description || '',
            dueDate: data.dueDate,
            priority: data.priority,
            status: data.status,
            assignedUser: data.assignedUser,
        };
    };

    const onSubmit = async (data: NewTaskFormInputs) => {
        const payload = constructPayload(data);
        const response = await addTask(payload);
        if (response) {
            setSnackbarData({ message: 'Task updated successfully!', type: 'success' });
            setShowSnackbar(true);
        } else {
            setSnackbarData({ message: 'Failed to update task.', type: 'error' });
            setShowSnackbar(true);
        }
    };

    return (
        <Paper
            elevation={5}
            sx={{
                padding: 3,
                borderRadius: 2,
                width: 400,
                margin: "40px auto",
                display: "flex",
                flexDirection: "column",
                gap: 2,
            }}
        >
            <Typography variant="h5" fontWeight="bold" textAlign="center">
                Edit Task
            </Typography>
            <TaskForm onSubmit={onSubmit} taskData={taskData} shouldResetOnSubmit={true} buttonText="Update Task" />
            <SnackBar
                message={snackbarData.message}
                type={snackbarData.type}
                open={showSnackbar}
                onClose={() => setShowSnackbar(false)}
            />
        </Paper>
    );
};

export default EditTask;
