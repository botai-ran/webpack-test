import React from "react";

function Login() {
    return <div>
        <input type="text" id="username" />
        <input type="password" id="password" />
        <div>
            <button>登录</button>
            <button>注册</button>
        </div>
    </div>
}

export default Login;