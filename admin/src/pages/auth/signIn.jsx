import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/authContext";
import '../../css/App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useNavigate } from 'react-router-dom';

function SignIn() {
    const navigate = useNavigate(); // Khởi tạo useNavigate
    const { loading, error, dispatch } = useContext(AuthContext);

    const [credentials, setCredentials] = useState({
        username: undefined,
        password: undefined,
    });

    const handleChange = (e) => {
        setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    };

    const handleClick = async (e) => {
        e.preventDefault();
        dispatch({ type: "LOGIN_START" });
        // console.log("Form submitted with credentials:", credentials);
        try {
            const res = await axios.post("http://localhost:8800/v1/user/login", credentials);
            console.log("Login response:", res);
            if (res.data.isAdmin) {
                dispatch({ type: "LOGIN_SUCCESS", payload: res.data.details });
                navigate("/");
            } else {
                dispatch({
                    type: "LOGIN_FAILURE",
                    payload: { message: "Bạn không có quyền!" },
                });
            }
        } catch (err) {
            console.log("Login error:", err);
            dispatch({ type: "LOGIN_FAILURE", payload: err.response.data });
        }
    };
    // State cho việc hiển thị mật khẩu
    const [passwordVisible, setPasswordVisible] = useState(false);
    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };
    return (
        <div className="auth h-screen">
            <div className="flex flex-col items-center justify-center h-screen">
                <div className="w-full max-w-md bg-white bg-opacity-50 rounded-xl shadow-md py-10 px-10">
                    <h2 className="text-[28px] font-bold text-blue-700 mb-6 text-center">Đăng nhập</h2>
                    {/* Form */}
                    <form className="flex flex-col" onSubmit={handleClick} disabled={loading}>
                        {/* Nhập email */}
                        <input
                            type="text"
                            id="username" 
                            placeholder="username"
                            className="bg-white-700 text-black border border-black rounded-md p-2 mb-4 focus:bg-white-600 focus:outline-none transition ease-in-out duration-150 placeholder-black-300"
                            onChange={handleChange}
                        />
                        {/* Nhập mật khẩu */}
                        <div className="relative mb-4">
                            <input
                                type={passwordVisible ? "text" : "password"}
                                id="password" 
                                placeholder="Mật khẩu"
                                className="bg-white-700 text-black border border-black rounded-md p-2 w-full focus:bg-white-600 focus:outline-none transition ease-in-out duration-150 placeholder-black-300"
                                onChange={handleChange}
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute right-3 top-2 text-gray-500"
                            >
                                {passwordVisible ? (
                                    <i className="fas fa-eye-slash"></i>
                                ) : (
                                    <i className="fas fa-eye"></i>
                                )}
                            </button>
                        </div>
                        <div className="flex flex-col items-center">
                            <button
                                disabled={loading}
                                className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-medium py-2 px-4 rounded-md hover:bg-indigo-600 hover:to-blue-600 transition ease-in duration-200"
                                type="submit"
                            >
                                Đăng nhập
                            </button>
                            {error && <span className="text-red-500 mt-3">{error.message}</span>}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default SignIn;
