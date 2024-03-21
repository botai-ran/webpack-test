import React from "react";
import App from "./App";
import {createRoot} from "react-dom/client";

// 渲染 React 组件
const root = createRoot(document.getElementById('root'));
root.render(<App/>);
