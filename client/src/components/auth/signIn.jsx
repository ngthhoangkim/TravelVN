import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/authContext";
import "../../css/App.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const GoogleLoginButton = () => {
  const handleGoogleLogin = async () => {
    try {
      // Redirect to backend Google OAuth endpoint
      window.location.href = "http://localhost:8800/v1/user/google-login";
    } catch (error) {
      console.error("Google login error:", error);
      alert("Đăng nhập Google không thành công");
    }
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="flex items-center justify-center border border-red-500 text-red-500 font-medium py-2 rounded-md hover:bg-red-500 hover:text-white transition ease-in duration-200 w-full"
    >
      <i className="fab fa-google mr-2"></i>
      Google
    </button>
  );
};
const FacebookLoginButton = ({ onFacebookLogin }) => {
  const handleFacebookLogin = async () => {
    try {
      // Redirect to backend Facebook OAuth endpoint
      window.location.href = "http://localhost:8800/v1/user/facebook-login";
    } catch (error) {
      console.error("Facebook login error:", error);
      alert("Đăng nhập Facebook không thành công");
    }
  };

  return (
    <button
      onClick={handleFacebookLogin}
      className="flex items-center justify-center border border-blue-500 text-blue-500 font-medium py-2 rounded-md hover:bg-blue-500 hover:text-white transition ease-in-out duration-200 w-full"
    >
      <i className="fab fa-facebook-f mr-2"></i>
      Facebook
    </button>
  );
};
function SignIn() {
  const navigate = useNavigate(); // Khởi tạo useNavigate
  const { loading, error, dispatch } = useContext(AuthContext);

  const [credentials, setCredentials] = useState({
    username: undefined,
    password: undefined,
  });
  useEffect(() => {
    const handleGoogleCallback = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");

      if (token) {
        try {
          // Giải mã token
          const decodedUser = jwtDecode(token);

          // Lưu token vào localStorage
          localStorage.setItem("access_token", token);

          // Cập nhật context
          dispatch({
            type: "LOGIN_SUCCESS",
            payload: decodedUser,
          });

          // Chuyển hướng về trang chính
          navigate("/");
        } catch (error) {
          console.error("Lỗi xử lý token:", error);
        }
      }
    };

    handleGoogleCallback();
  }, [dispatch, navigate]);
  useEffect(() => {
    const handleFacebookCallback = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");

      if (token) {
        try {
          // Giải mã token
          const decodedUser = jwtDecode(token);

          // Lưu token vào localStorage
          localStorage.setItem("access_token", token);

          // Cập nhật context
          dispatch({
            type: "LOGIN_SUCCESS",
            payload: decodedUser,
          });

          // Chuyển hướng về trang chính
          navigate("/");
        } catch (error) {
          console.error("Lỗi xử lý token:", error);
        }
      }
    };

    handleFacebookCallback();
  }, [dispatch, navigate]);
  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    dispatch({ type: "LOGIN_START" });
    // console.log("Form submitted with credentials:", credentials);
    try {
      const res = await axios.post(
        "http://localhost:8800/v1/user/login",
        credentials
      );
      // console.log("Login response:", res);
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data.details });
      navigate("/");
    } catch (err) {
      if (err.response && err.response.data) {
        alert(err.response.data.message || "Đã có lỗi xảy ra");
      } else {
        alert("Có lỗi xảy ra. Vui lòng thử lại.");
      }
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
          <h2 className="text-[28px] font-bold text-blue-700 mb-6 text-center">
            Đăng nhập
          </h2>
          {/* Nút xã hội */}
          <div className="flex justify-between space-x-4">
            <FacebookLoginButton />
            <GoogleLoginButton />
          </div>
          {/* Phân cách Hoặc */}
          <div className="flex items-center my-4">
            <div className="flex-grow border-t border-black"></div>
            <span className="mx-4 text-black">Hoặc</span>
            <div className="flex-grow border-t border-black"></div>
          </div>
          {/* Form */}
          <form
            className="flex flex-col"
            onSubmit={handleClick}
            disabled={loading}
          >
            {/* Nhập email */}
            <input
              type="text"
              id="username" // Thêm id đúng ở đây
              placeholder="Username"
              className="bg-white-700 text-black border border-black rounded-md p-2 mb-4 focus:bg-white-600 focus:outline-none transition ease-in-out duration-150 placeholder-black-300"
              onChange={handleChange}
              autoComplete="email"
            />
            {/* Nhập mật khẩu */}
            <div className="relative mb-4">
              <input
                type={passwordVisible ? "text" : "password"}
                id="password" // Thêm id đúng ở đây
                placeholder="Mật khẩu"
                className="bg-white-700 text-black border border-black rounded-md p-2 w-full focus:bg-white-600 focus:outline-none transition ease-in-out duration-150 placeholder-black-300"
                onChange={handleChange}
                autoComplete="password"
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
            {/* Nút gửi */}
            <button
              className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-medium py-2 px-4 rounded-md hover:bg-indigo-600 hover:to-blue-600 transition ease-in duration-200"
              type="submit"
            >
              Đăng nhập
            </button>
            {error && <span>{error.message}</span>}
            {/* Nhắc nhở đăng ký */}
            <p className="text-black mt-4 text-center">
              Bạn chưa có tài khoản?
              <a
                href="/signup"
                className="text-blue-500 font-bold hover:underline mt-4 px-1"
              >
                Đăng ký
              </a>
            </p>
            <div className="mt-4 text-center">
              <a
                href="/forgotpass"
                className="text-blue-500 font-bold hover:underline"
              >
                Quên mật khẩu?
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
