import { VisibilityOff, Visibility } from "@mui/icons-material";
import { TextField, Typography, Paper, InputAdornment, IconButton, Box, Button } from "@mui/material";
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authenticateUser } from "../../services/auth";
import { useNavigate } from "react-router-dom";
import SnackBar from "../../utils/SnackBar";

const loginSchema = z.object({
    userName: z.string().min(2, "Username must be at least 2 characters long"),
    password: z.string().min(3, "Password must be at least 3 characters long"),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

const LoginPage = () => {
    const [showPassword, setShowPassword] = React.useState<boolean>(false);
    const [message, setMessage] = React.useState<string>('');
    const [showSnackbar, setShowSnackbar] = React.useState<boolean>(false);
    const [type, setType] = React.useState<'success' | 'error'>('success');

    const navigate = useNavigate();

    const { handleSubmit, register, formState: { errors } } = useForm<LoginFormInputs>({
        resolver: zodResolver(loginSchema),
    });

    const onClick = async (data: LoginFormInputs) => {
        console.log(data);
        const response = await authenticateUser(data.userName, data.password);
        if (response) {
            sessionStorage.setItem("isAuthenticated", "true");
            sessionStorage.setItem("userName", data.userName);
            setMessage("Login successful!");
            setType("success");
            setShowSnackbar(true);
            navigate("/");
        } else {
            sessionStorage.setItem("isAuthenticated", "false");
            setMessage("Invalid userName or password");
            setType("error");
            setShowSnackbar(true);
        }
    }

    return (
        <div>
            <Box
                sx={{
                    height: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#f4f6f8",
                }}
            >
                <Paper elevation={5} sx={{ padding: 2, borderRadius: 2, width: 300, margin: '20px auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Typography variant="h5" fontWeight="bold" textAlign="center">
                        Login
                    </Typography>
                    <form onSubmit={handleSubmit(onClick)}>
                        <TextField
                            label="Username"
                            variant="outlined"
                            {...register("userName")}
                            error={!!errors.userName}
                            helperText={errors.userName?.message}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Password"
                            variant="outlined"
                            type={showPassword ? "text" : "password"}
                            {...register("password")}
                            error={!!errors.password}
                            helperText={errors.password?.message}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowPassword((p) => !p)}>
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            fullWidth
                            margin="normal"
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{ mt: 2 }}
                        >
                            Login
                        </Button>
                    </form>
                </Paper>
            </Box>
            <SnackBar
                open={showSnackbar}
                message={message}
                type={type}
                onClose={() => setShowSnackbar(false)}
            />
        </div>
    );
};

export default LoginPage;
