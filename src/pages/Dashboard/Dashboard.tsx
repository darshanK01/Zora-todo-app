import React, { useEffect, useMemo, useState } from "react";
import {
    Box,
    Paper,
    Typography,
    CircularProgress,
    Alert,
    Stack,
    TextField,
    Button,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { getTodoTasks } from "../../services/getTasks";
import { useNavigate } from "react-router";

const Dashboard: React.FC = () => {
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedTaskIds, setSelectedTaskIds] = useState<number[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [filteredTasks, setFilteredTasks] = useState<any[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const data = await getTodoTasks();
                // Ensure every task has a unique "id" field (DataGrid requires it)
                const formattedData = data.map((task: any, index: number) => ({
                    id: task.id || index + 1,
                    ...task,
                }));
                setTasks(formattedData);
            } catch (err) {
                console.error("Failed to fetch tasks:", err);
                setError("Failed to load tasks. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        fetchTasks();
    }, []);

    const debounce = (func: Function, delay: number) => {
        let timer: NodeJS.Timeout;
        return (...args: any[]) => {
            if (timer) clearTimeout(timer);
            timer = setTimeout(() => {
                func(...args);
            }, delay);
        };
    };

    const handleSearch = useMemo(() => debounce(() => {
        if (searchTerm.trim() === "") {
            setFilteredTasks(tasks);
        } else {
            const filtered = tasks.filter((task) =>
                task.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredTasks(filtered);
        }
    }, 300), [searchTerm, tasks]);

    useEffect(() => {
        handleSearch();
    }, [handleSearch]);

    const columns: GridColDef[] = [
        { field: "title", headerName: "Title", flex: 1, minWidth: 150 },
        { field: "description", headerName: "Description", flex: 2, minWidth: 200 },
        {
            field: "dueDate",
            headerName: "Due Date",
            flex: 1,
            minWidth: 150,
            valueGetter: (value, row) =>
                row.dueDate ? new Date(row.dueDate).toLocaleDateString() : "-",
        },
        { field: "priority", headerName: "Priority", flex: 1, minWidth: 120 },
        {
            field: "status",
            headerName: "Status",
            flex: 1,
            minWidth: 120,
            cellClassName: (params) =>
                params.value === "done"
                    ? "status-done"
                    : params.value === "inProgress"
                        ? "status-inProgress"
                        : "status-todo",
        },
        {
            field: "id",
            headerName: "Actions",
            flex: 1,
            minWidth: 120,
            renderCell: (params) => (
                   <Button variant="contained" size="small" onClick={() => handleEditTaskClick(params.value)}>
                       Edit
                   </Button>
            )
        }
    ];

    const handleEditTaskClick = (id: number) => {
        navigate(`/edit-task?id=${id}`);
    };

    const handleAddNewTaskClick = () => {
        navigate("/add-task");
    };

    return (
        <Box
            sx={{
                height: "100vh",
                p: 4,
                backgroundColor: "#f4f6f8",
            }}
        >
            <Typography
                variant="h4"
                fontWeight="bold"
                gutterBottom
                sx={{ textAlign: "center" }}
            >
                Task Dashboard
            </Typography>

            <Paper
                elevation={3}
                sx={{
                    p: 2,
                    height: "80vh",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <TextField
                    label="Search Tasks"
                    variant="outlined"
                    size="small"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by Title"
                    sx={{ maxWidth: 300 }}
                />
                {loading ? (
                    <Stack
                        justifyContent="center"
                        alignItems="center"
                        sx={{ flexGrow: 1 }}
                    >
                        <CircularProgress />
                        <Typography variant="body1" mt={2}>
                            Loading tasks...
                        </Typography>
                    </Stack>
                ) : error ? (
                    <Alert severity="error">{error}</Alert>
                ) : (
                    <DataGrid
                        rows={filteredTasks}
                        columns={columns}
                        paginationModel={{ page: 0, pageSize: 5 }}
                        pageSizeOptions={[5, 10, 20]}
                        sx={{
                            border: 0,
                            "& .status-done": { color: "green" },
                            "& .status-inProgress": { color: "orange" },
                            "& .status-todo": { color: "gray" },
                        }}
                    />
                )}
                <Button variant="contained" color="primary" sx={{ mt: 2, alignSelf: "flex-end" }} onClick={handleAddNewTaskClick}>
                    Add New Task
                </Button>
            </Paper>
        </Box>
    );
};

export default Dashboard;
