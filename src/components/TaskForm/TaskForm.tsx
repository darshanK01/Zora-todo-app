import { zodResolver } from "@hookform/resolvers/zod";
import { TextField, FormControl, InputLabel, Select, MenuItem, Button } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { getUsers } from "../../services/getUsers";

const taskSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    dueDate: z.string().min(1, "Due date is required"),
    priority: z.string().min(1, "Priority is required"),
    status: z.string().min(1, "Status is required"),
    assignedUser: z.string().min(1, "Assigned user is required"),
});

type TaskFormInputs = z.infer<typeof taskSchema>;

interface TaskFormProps {
    onSubmit: (data: TaskFormInputs) => void;
    taskData?: TaskFormInputs;
    shouldResetOnSubmit: boolean;
    buttonText: string;
}


const TaskForm = ({ onSubmit, taskData, shouldResetOnSubmit, buttonText }: TaskFormProps) => {

    const [dueDate, setDueDate] = React.useState<Dayjs | null>(null);
    const [users, setUsers] = React.useState<Array<{ id: string; name: string }>>([]);

    const {
        register,
        handleSubmit,
        setValue,
        control,
        formState: { errors },
        reset
    } = useForm<TaskFormInputs>({
        resolver: zodResolver(taskSchema),
        defaultValues: {
            title: taskData?.title || "",
            description: taskData?.description || "",
            dueDate: taskData?.dueDate || "",
            priority: taskData?.priority || "",
            status: taskData?.status || "",
            assignedUser: taskData?.assignedUser || "",
        },
    });

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

    const handleSubmitClick = (data: TaskFormInputs) => {
        onSubmit(data);
        if(shouldResetOnSubmit) {
            reset();
            setDueDate(null);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
                label="Title"
                variant="outlined"
                {...register("title")}
                error={!!errors.title}
                helperText={errors.title?.message}
                fullWidth
                margin="normal"
            />

            <TextField
                label="Description"
                variant="outlined"
                {...register("description")}
                error={!!errors.description}
                helperText={errors.description?.message}
                fullWidth
                margin="normal"
            />

            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                    label="Due Date"
                    value={dueDate}
                    onChange={handleDateChange}
                    slotProps={{
                        textField: {
                            fullWidth: true,
                            margin: "normal",
                            error: !!errors.dueDate,
                            helperText: errors.dueDate?.message,
                        },
                    }}
                />
            </LocalizationProvider>

            <FormControl fullWidth margin="normal" error={!!errors.priority}>
                <InputLabel id="priority-label">Priority</InputLabel>
                <Controller
                    name="priority"
                    control={control}
                    render={({ field }) => (
                        <Select
                            {...field}
                            labelId="priority-label"
                            label="Priority"
                        >
                            <MenuItem value="high">High</MenuItem>
                            <MenuItem value="low">Low</MenuItem>
                        </Select>
                    )}
                />
            </FormControl>
            <FormControl fullWidth margin="normal" error={!!errors.status}>
                <InputLabel id="status-label">Status</InputLabel>
                <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                        <Select
                            {...field}
                            labelId="status-label"
                            label="Status"
                        >
                            <MenuItem value="todo">Todo</MenuItem>
                            <MenuItem value="inProgress">In Progress</MenuItem>
                            <MenuItem value="done">Done</MenuItem>
                        </Select>
                    )}
                />
            </FormControl>

            <FormControl fullWidth margin="normal" error={!!errors.assignedUser}>
                <InputLabel id="assigned-user-label">Assigned User</InputLabel>
                <Controller
                    name="assignedUser"
                    control={control}
                    render={({ field }) => (
                        <Select
                            {...field}
                            labelId="assigned-user-label"
                            label="Assigned User"
                        >{users.map((user) => (
                            <MenuItem key={user.id} value={user.id}>
                                {user.name} {`(`}{user.id}{`)`}
                            </MenuItem>
                        ))}
                        </Select>
                    )}
                />
            </FormControl>

            <Button
                variant="contained"
                color="primary"
                type="submit"
                fullWidth
                sx={{ mt: 2 }}
            >
                {buttonText}
            </Button>
        </form>
    );
}

export default TaskForm;
