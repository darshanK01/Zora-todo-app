import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const isAuthenticated = sessionStorage.getItem("isAuthenticated") === "true";
  const userName = sessionStorage.getItem("userName") || "User";

  const handleLogout = () => {
    sessionStorage.removeItem("isAuthenticated");
    navigate("/login");
  };

  const handleTitleClick = () => {
    navigate("/");
  };

  return (
    <AppBar
      position="static"
      color="primary"
      sx={{
        mb: 3,
        boxShadow: "none",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }} onClick={handleTitleClick} style={{ cursor: 'pointer' }}>
          Todo App
        </Typography>

        {isAuthenticated && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Typography
              variant="subtitle1"
              component="div"
              sx={{ fontWeight: 500 }}
            >
              Hi, {userName}!
            </Typography>

            <Button
              color="inherit"
              onClick={handleLogout}
              sx={{ fontWeight: 500 }}
            >
              Logout
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
