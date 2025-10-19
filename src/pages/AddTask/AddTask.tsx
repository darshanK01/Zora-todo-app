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

const newTaskSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    dueDate: z.string().min(1, "Due date is required"),
    priority: z.string().min(1, "Priority is required"),
    status: z.string().min(1, "Status is required"),
    assignedUser: z.string().min(1, "Assigned user is required"),
});

type NewTaskFormInputs = z.infer<typeof newTaskSchema>;

const AddTask: React.FC = () => {
    const {
        register,
        handleSubmit,
        setValue,
        control,
        formState: { errors },
        reset
    } = useForm<NewTaskFormInputs>({
        resolver: zodResolver(newTaskSchema),
        defaultValues: {
            title: "",
            description: "",
            dueDate: "",
            priority: "",
            status: "",
            assignedUser: "",
        },
    });


    const [dueDate, setDueDate] = React.useState<Dayjs | null>(null);
    const [users, setUsers] = React.useState<Array<{ id: string; name: string }>>([]);
    const [showSnackbar, setShowSnackbar] = React.useState<boolean>(false);
    const [snackbarData, setSnackbarData] = React.useState<{ message: string; type: 'success' | 'error' }>({ message: '', type: 'success' });

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const users = await getUsers();
                setUsers(users);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers();
    }, []);

    const handleDateChange = (date: Dayjs | null) => {
        setDueDate(date);
        setValue("dueDate", date ? date.format("YYYY-MM-DD") : "", { shouldValidate: true });
    };

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
            reset({
                title: '',
                description: '',
                dueDate: '',
                priority: '',
                status: '',
                assignedUser: '',
            });
            setDueDate(null);
            setSnackbarData({ message: 'Task added successfully!', type: 'success' });
            setShowSnackbar(true);
        } else {
            setSnackbarData({ message: 'Failed to add task.', type: 'error' });
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
                Create New Task
            </Typography>
            <TaskForm onSubmit={onSubmit} shouldResetOnSubmit={true} buttonText="Create Task" />
            <SnackBar
                message={snackbarData.message}
                type={snackbarData.type}
                open={showSnackbar}
                onClose={() => setShowSnackbar(false)}
            />
        </Paper>
    );
};

export default AddTask;
