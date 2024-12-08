import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/App.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

function SignUp() {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [errors, setErrors] = useState({
        emptyError: '',
        passwordsMatchError: '',
        passwordLengthError: '',
        usernameExistsError: '',
        emailExistsError:'',
        submissionError: '',
    });
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        if (successMessage) {
            // Redirect to signin after success
            setTimeout(() => {
                navigate("/signin");
            }, 1500);
        }
    }, [successMessage, navigate]);

    const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);
    const toggleConfirmPasswordVisibility = () => setConfirmPasswordVisible(!confirmPasswordVisible);

    const handleConfirmPasswordChange = (e) => {
        const value = e.target.value;
        setConfirmPass(value);
        setErrors((prevErrors) => ({
            ...prevErrors,
            passwordsMatchError: value === pass ? '' : 'Mật khẩu không khớp!',
        }));
    };

    const checkUsernameExists = async (username) => {
        try {
            const response = await fetch(`http://localhost:8800/v1/user/check-username?username=${username}`);
            const data = await response.json();
            return data.exists;
        } catch (error) {
            console.error("Lỗi:", error);
            return false;
        }
    };

    const checkEmailExists = async (email) =>{
        try {
            const response = await fetch(`http://localhost:8800/v1/user/check-email?email=${email}`);
            const data = await response.json();
            return data.exists;
        } catch (error) {
            console.error("Lỗi:", error);
            return false;
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Reset errors
        setErrors({
            emptyError: '',
            passwordsMatchError: '',
            passwordLengthError: '',
            usernameExistsError: '',
            submissionError: '',
        });
    
        // Validate inputs
        if (!username || !pass || !confirmPass || !email ) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                emptyError: 'Hãy điền đầy đủ thông tin!',
            }));
            return;
        }
    
        if (pass.length < 6) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                passwordLengthError: 'Mật khẩu phải có ít nhất 6 ký tự!',
            }));
            return;
        }
    
        if (pass !== confirmPass) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                passwordsMatchError: 'Mật khẩu không khớp!',
            }));
            return;
        }
    
        try {
            const [usernameExists, emailExists] = await Promise.all([
                checkUsernameExists(username),
                checkEmailExists(email),
            ]);
            if (usernameExists && emailExists) {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    usernameExistsError: usernameExists ? 'Tên đăng nhập đã được sử dụng!' : '',
                emailExistsError: emailExists ? 'Email đã được sử dụng!' : '',

                }));
                return;
            }
    
            const response = await fetch("http://localhost:8800/v1/user/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    email,
                    password: pass,
                }),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Có lỗi xảy ra khi gửi dữ liệu.");
            }
    
            const data = await response.json();
            setSuccessMessage(data.message || "Tạo tài khoản thành công, hãy đăng nhập!");
        } catch (err) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                submissionError: err.message || JSON.stringify(err),
            }));
        }
    };

    return (
        <div className="auth h-screen">
            <div className="flex flex-col items-center justify-center h-screen">
                <div className="w-full max-w-md bg-white bg-opacity-50 rounded-xl shadow-md py-10 px-10">
                    <h2 className="text-[28px] font-bold text-blue-700 mb-6 text-center">Đăng ký</h2>
                    <div className="flex justify-between space-x-4">
                        <button className="flex items-center justify-center border border-blue-500 text-blue-500 font-medium py-2 rounded-md hover:bg-blue-500 hover:text-white transition ease-in duration-200 w-full">
                            <i className="fab fa-facebook-f mr-2"></i>
                            Facebook
                        </button>
                        <button className="flex items-center justify-center border border-red-500 text-red-500 font-medium py-2 rounded-md hover:bg-red-500 hover:text-white transition ease-in duration-200 w-full">
                            <i className="fab fa-google mr-2"></i>
                            Google
                        </button>
                    </div>
                    <div className="flex items-center my-4">
                        <div className="flex-grow border-t border-black"></div>
                        <span className="mx-4 text-black">Hoặc</span>
                        <div className="flex-grow border-t border-black"></div>
                    </div>
                    <form className="flex flex-col" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Tên đăng nhập"
                            className="bg-white-700 text-black border border-black rounded-md p-2 mb-4"
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        {errors.emptyError && <span className="text-red-500 text-sm">{errors.emptyError}</span>}
                        {errors.usernameExistsError && (
                            <span className="text-red-500 text-sm">
                                {typeof errors.usernameExistsError === "string"
                                    ? errors.usernameExistsError
                                    : JSON.stringify(errors.usernameExistsError)}
                            </span>
                        )}
                        <input
                            type="email"
                            placeholder="Email"
                            className="bg-white-700 text-black border border-black rounded-md p-2 mb-4"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <div className="relative mb-4">
                            <input
                                type={passwordVisible ? "text" : "password"}
                                placeholder="Mật khẩu"
                                className="bg-white-700 text-black border border-black rounded-md p-2 w-full"
                                onChange={(e) => setPass(e.target.value)}
                            />
                            {errors.passwordLengthError && <span className="text-red-500 text-sm">{errors.passwordLengthError}</span>}
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute right-3 top-2 text-gray-500"
                            >
                                {passwordVisible ? <i className="fas fa-eye-slash"></i> : <i className="fas fa-eye"></i>}
                            </button>
                        </div>
                        <div className="relative mb-4">
                            <input
                                type={confirmPasswordVisible ? "text" : "password"}
                                placeholder="Nhập lại mật khẩu"
                                className="bg-white-700 text-black border border-black rounded-md p-2 w-full"
                                value={confirmPass}
                                onChange={handleConfirmPasswordChange}
                            />
                            <button
                                type="button"
                                onClick={toggleConfirmPasswordVisibility}
                                className="absolute right-3 top-2 text-gray-500"
                            >
                                {confirmPasswordVisible ? <i className="fas fa-eye-slash"></i> : <i className="fas fa-eye"></i>}
                            </button>
                            {errors.passwordsMatchError && <span className="text-red-600 text-sm">{errors.passwordsMatchError}</span>}
                        </div>
                        <button
                            className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-medium py-2 px-4 rounded-md hover:bg-indigo-600"
                            type="submit"
                        >
                            Đăng ký
                        </button>
                        {successMessage && <p className="text-blue-700 text-center">{successMessage}</p>}
                        {errors.submissionError && <span className="text-red-500 text-sm text-center">{errors.submissionError}</span>}
                        <p className="text-black mt-4 text-center">
                            Bạn đã có tài khoản?
                            <a href="/signin" className="text-blue-500 font-bold hover:underline ml-1">Đăng nhập</a>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default SignUp;
