import React from 'react';
import {BrowserRouter, Routes, Route, Router } from "react-router-dom";
import { routes } from "./router";


function App () {
    return <BrowserRouter>
        <Routes>
            {
                routes.map(item => {
                    return <Route key={item.key} path={item.path} element={item.component} />;
                })
            }
        </Routes>
    </BrowserRouter>
}

export default App;