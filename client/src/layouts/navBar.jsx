import React, { useState, useContext } from "react";
import { BiChevronDown } from "react-icons/bi";
import { AiOutlineUser } from "react-icons/ai";
import { FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Logo from "./logo";
import { ButtonIcon } from "./button";
import { AuthContext } from "../context/authContext";

function Navbar() {
  const [hovered, setHovered] = useState(null);
  const { user, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleMouseEnter = (item) => {
    setHovered(item);
  };

  const handleMouseLeave = () => {
    setHovered(null);
  };

  // Đăng xuất người dùng
  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/signin");
  };

  return (
    <div className="fixed w-full">
      <div className="flex flex-row justify-between p-5 md:px-32 px-5 bg-white shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
        <a href="/" className="flex flex-row items-center cursor-pointer">
          <Logo />
        </a>

        <nav className="hidden md:flex flex-row items-center text-lg font-medium gap-8">
          <a
            href="/"
            onMouseEnter={() => handleMouseEnter("home")}
            onMouseLeave={handleMouseLeave}
            style={{ color: hovered === "home" ? 'red' : 'black', transition: 'color 0.3s' }}
            className="transition-all cursor-pointer"
          >
            Trang chủ
          </a>

          <div className="relative group">
            <div className="flex items-center gap-1">
              <span
                onMouseEnter={() => handleMouseEnter("travel")}
                onMouseLeave={handleMouseLeave}
                style={{ color: hovered === "travel" ? 'red' : 'black', transition: 'color 0.3s' }}
                className="transition-all cursor-pointer"
              >
                Khám phá
              </span>
              <BiChevronDown className="cursor-pointer" size={25} />
            </div>
            <ul className="absolute hidden min-w-[120px] space-y-2 group-hover:block bg-white border border-gray-300 rounded-lg p-5">
              <li>
                <a
                  href="/location"
                  onMouseEnter={() => handleMouseEnter("location")}
                  onMouseLeave={handleMouseLeave}
                  style={{ color: hovered === "location" ? 'red' : 'black', transition: 'color 0.3s' }}
                  className="transition-all cursor-pointer"
                >
                  Địa điểm
                </a>
              </li>
              <li>
                <a
                  href="/history"
                  onMouseEnter={() => handleMouseEnter("history")}
                  onMouseLeave={handleMouseLeave}
                  style={{ color: hovered === "history" ? 'red' : 'black', transition: 'color 0.3s' }}
                  className="transition-all cursor-pointer"
                >
                  Lịch sử
                </a>
              </li>
              <li>
                <a
                  href="/cultural"
                  onMouseEnter={() => handleMouseEnter("culture")}
                  onMouseLeave={handleMouseLeave}
                  style={{ color: hovered === "culture" ? 'red' : 'black', transition: 'color 0.3s' }}
                  className="transition-all cursor-pointer"
                >
                  Văn hóa
                </a>
              </li>
            </ul>
          </div>

          <a
            href="/blog"
            onMouseEnter={() => handleMouseEnter("plan")}
            onMouseLeave={handleMouseLeave}
            style={{ color: hovered === "plan" ? 'red' : 'black', transition: 'color 0.3s' }}
            className="transition-all cursor-pointer"
          >
            Blog
          </a>
          {user ?
            <div className="flex items-center gap-2 cursor-pointer">
              <a href="/profile"><span>{user.username}</span></a>
              <FaSignOutAlt onClick={handleLogout} size={20} />
            </div>
            : (
              <a href="/signin" className="transition-all cursor-pointer">
                <ButtonIcon title="Đăng nhập" Icon={AiOutlineUser} />
              </a>
            )}
        </nav>
      </div>
    </div>
  );
}

export default Navbar;
