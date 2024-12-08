import React, { useState, useRef } from 'react';
import Logo from './logo';
import { Search } from './search';

function Header  ()  {
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
  };

  return (
    <header className="h-16 bg-white flex items-center justify-between px-5">
      <div>
        <Logo/>
      </div>
      <div className="flex items-center justify-center flex-grow mx-4">
        <div className="relative w-[30rem]">
          <Search/>
        </div>
      </div>
      <div
        className="relative cursor-pointer w-10 h-10"
        onClick={toggleNotifications}
        ref={notificationRef}
      >
        <div className="w-10 h-10 bg-[#f0f0f0] rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <i className="fas fa-bell w-5 h-5 text-gray-500"></i>
        </div>
        <div className="absolute top-[0.31rem] right-[0.31rem] w-2 h-2 bg-red rounded-full"></div>
        {showNotifications && (
          <div className="absolute top-full right-0 bg-white rounded p-3 min-w-[12.50rem] z-[1000]">
            <div className="p-3">Thông báo 1</div>
            <div className="p-3">Thông báo 2</div>
            <div className="p-3">Thông báo 3</div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
