import path from "path";
import React from "react";

interface RouteConfig {
    id: string;
    path: string;
    component: React.LazyExoticComponent<React.FC>;
};

const getRouteConfigs = (): RouteConfig[] => {
    const CONFIGS: RouteConfig[] = [
        {
            id: 'login',
            path: "/login",
            component: React.lazy(() => import("./pages/Login/Login"))
        },
        {
            id: 'dashboard',
            path: "/",
            component: React.lazy(() => import("./pages/Dashboard/Dashboard"))
        },
        {
            id: 'add-task',
            path: "/add-task",
            component: React.lazy(() => import("./pages/AddTask/AddTask"))
        },
        {
            id: 'edit-task',
            path: "/edit-task",
            component: React.lazy(() => import("./pages/EditTask/EditTask"))
        },
        // {
        //     id: 'users',
        //     path: "/users",
        //     component: React.lazy(() => import("./pages/Users/Users")))
        // }
    ];

    return CONFIGS;
};

export default getRouteConfigs;