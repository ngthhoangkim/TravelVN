import React, { useState } from "react";
import { ButtonGradient } from "../../layouts/button";
function ForgotPassword() {
    // const [email, setEmail] = useState('');
    // const [successMessage, setSuccessMessage] = useState('');
    // const [errorMessage, setErrorMessage] = useState('');

    // // Function to handle password reset
    // const handlePasswordReset = async (e) => {
    //     e.preventDefault(); 

    //     setSuccessMessage(''); 
    //     setErrorMessage('');

    //     try {
    //         await sendPasswordResetEmail(auth, email); 
    //         setSuccessMessage('Email đã được gửi để cập nhật mật khẩu.'); 
    //     } catch (error) {
    //         setErrorMessage('Có lỗi xảy ra! Vui lòng kiểm tra email và thử lại.'); 
    //     }
    // };

    return (
        <div className="auth h-screen">
            <div className="flex flex-col items-center justify-center h-screen">
                <div className="w-full max-w-md bg-white bg-opacity-50 rounded-xl shadow-md py-10 px-10">
                    <h2 className="text-[28px] font-bold text-blue-700 mb-6 text-center">Cập nhật mật khẩu</h2>
                    {/* Form */}
                    <form className="flex flex-col">
                        {/* Nhập email */}
                        <input
                            type="email"
                            placeholder="Email"
                            className="bg-white-700 text-black border border-black rounded-md p-2 mb-4 focus:bg-white-600 focus:outline-none transition ease-in-out duration-150 placeholder-black-300"
                        
                        />
                        {/* Button */}
                        <div className="flex justify-center">
                            <ButtonGradient title="Cập nhật" />
                        </div>
                    </form>
                    {/* thông báo */}
                    {/* {successMessage && <span className="text-green-500 text-center mt-4">{successMessage}</span>}
                    {errorMessage && <span className="text-red-500 text-center mt-4">{errorMessage}</span>} */}
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;
