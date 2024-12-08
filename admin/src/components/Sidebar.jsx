import React,{useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { FaSignOutAlt } from "react-icons/fa";
import { AuthContext } from "../context/authContext";

function Sidebar() {
  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();
  // Đăng xuất người dùng
  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/signin");
  };

  const danhMucItems = [
    { icon: 'fa-home', text: 'Trang chủ', path: '/' },
    { icon: 'fa-users', text: 'Quản lý người dùng', path: '/manageUser' },
    { icon: 'fa-chart-bar', text: 'Quản lý bài viết', path: '/local' },
    { icon: 'fa-exclamation-triangle', text: 'Quản lý báo cáo và vi phạm', path: '/manageReport' },
  ];

  return (
    <nav className="bg-[#f8f8f8] p-5 h-full flex flex-col">
      <div className="flex-1">
        <ul className="list-none p-0 m-0">
          {danhMucItems.map((item, index) => (
            <li key={index} className="mb-5">
              <a href={item.path} className="text-[#333] flex items-center text-lg py-1 px-0 hover:text-[#348498]">
                <i className={`fas ${item.icon} mr-3.5`}></i>
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <FaSignOutAlt onClick={handleLogout} size={20} />
    </nav>
  );
}

export default Sidebar;
