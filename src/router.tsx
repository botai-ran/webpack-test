import React from "react";
import Login from "./page/login";
import ColorPicker from "./components/colorPicker";

export const router = {
    login: {
        path: '/login',
        component: <Login/>,
    },
}

export const routes = [
    {
        key: 'login',
        path: '/login',
        component: <Login/>,
    },
    {
        key: 'colorPicker',
        path: '/colorPicker',
        component: <ColorPicker/>,
    }
]