import { Alert, Snackbar } from "@mui/material";
import React, { useState } from "react";

interface SnackBarProps {
    message: string;
    type: 'success' | 'error';
    open: boolean;
    onClose: () => void;
    closeDuration?: number;
}

const SnackBar: React.FC<SnackBarProps> = ({ message, type, open, onClose, closeDuration }) => {

    return (
        <Snackbar
            style={{ color: 'red' }}
            open={open}
            onClose={onClose}
            autoHideDuration={closeDuration || 5000}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
            <Alert severity={type} sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>
    );
};

export default SnackBar;