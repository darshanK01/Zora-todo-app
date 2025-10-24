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
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { getTodoTasks } from "../../services/getTasks";
import { getUsers } from "../../services/getUsers";
import { useNavigate } from "react-router";

const Dashboard: React.FC = () => {
    const [tasks, setTasks] = useState<any[]>([]);
    const [filteredTasks, setFilteredTasks] = useState<any[]>([]);
    const [users, setUsers] = useState<Array<{ id: string; name: string }>>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [statusFilter, setStatusFilter] = useState<string>("");
    const [assignedUserFilter, setAssignedUserFilter] = useState<string>("");

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [taskData, userData] = await Promise.all([getTodoTasks(), getUsers()]);
                setTasks(taskData);
                setFilteredTasks(taskData);
                setUsers(userData);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Failed to load data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const debounce = (func: Function, delay: number) => {
        let timer: NodeJS.Timeout;
        return (...args: any[]) => {
            if (timer) clearTimeout(timer);
            timer = setTimeout(() => func(...args), delay);
        };
    };

    const applyFilters = useMemo(
        () =>
            debounce(() => {
                let filtered = tasks;

                if (searchTerm.trim()) {
                    filtered = filtered.filter((task) =>
                        task.title.toLowerCase().includes(searchTerm.toLowerCase())
                    );
                }

                if (statusFilter) {
                    filtered = filtered.filter((task) => task.status === statusFilter);
                }

                if (assignedUserFilter) {
                    filtered = filtered.filter((task) => task.assignedUser === assignedUserFilter);
                }

                setFilteredTasks(filtered);
            }, 300),
        [tasks, searchTerm, statusFilter, assignedUserFilter]
    );

    useEffect(() => {
        applyFilters();
    }, [applyFilters]);

    const handleClearFilters = () => {
        setSearchTerm("");
        setStatusFilter("");
        setAssignedUserFilter("");
        setFilteredTasks(tasks);
    };

    const handleEditTaskClick = (id: number) => navigate(`/edit-task?id=${id}`);
    const handleAddNewTaskClick = () => navigate("/add-task");

    const paginationModel = { page: 0, pageSize: 5 };

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
            field: "assignedUser",
            headerName: "Assigned User",
            flex: 1.5,
            minWidth: 150,
            valueGetter: (value, row) => {
                const user = users.find((u) => u.id.toString() === row.assignedUser.toString());
                return user ? user.name : "-";
            },
        },
        {
            field: "id",
            headerName: "Actions",
            flex: 1,
            minWidth: 120,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleEditTaskClick(params.value)}
                >
                    Edit
                </Button>
            ),
        },
    ];

    return (
        <Box sx={{ height: "100vh", p: 4, backgroundColor: "#f4f6f8" }}>
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
                    p: 3,
                    height: "80vh",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 2,
                        alignItems: "center",
                        mb: 2,
                    }}
                >
                    <TextField
                        label="Search Tasks"
                        variant="outlined"
                        size="small"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by Title"
                        sx={{ width: 250 }}
                    />
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <InputLabel>Status</InputLabel>
                        <Select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            label="Status"
                        >
                            <MenuItem value="">All</MenuItem>
                            <MenuItem value="todo">Todo</MenuItem>
                            <MenuItem value="inProgress">In Progress</MenuItem>
                            <MenuItem value="done">Done</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl size="small" sx={{ minWidth: 180 }}>
                        <InputLabel>Assigned User</InputLabel>
                        <Select
                            value={assignedUserFilter}
                            onChange={(e) => setAssignedUserFilter(e.target.value)}
                            label="Assigned User"
                        >
                            <MenuItem value="">All</MenuItem>
                            {users.map((user) => (
                                <MenuItem key={user.id} value={user.id}>
                                    {user.name} - ({user.id})
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Button variant="outlined" color="secondary" onClick={handleClearFilters}>
                        Clear Filters
                    </Button>
                </Box>
                {loading ? (
                    <Stack justifyContent="center" alignItems="center" sx={{ flexGrow: 1 }}>
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
                        initialState={{ pagination: { paginationModel } }}
                        pageSizeOptions={[5, 10, 20]}
                        sx={{
                            border: 0,
                            "& .status-done": { color: "green" },
                            "& .status-inProgress": { color: "orange" },
                            "& .status-todo": { color: "gray" },
                        }}
                    />
                )}
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2, alignSelf: "flex-end" }}
                    onClick={handleAddNewTaskClick}
                >
                    Add New Task
                </Button>
            </Paper>
        </Box>
    );
};

export default Dashboard;
