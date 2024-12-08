import React from 'react';

function Header() {
  return (
    <div className="Image w-full max-w-[1920px] h-[300px] relative bg-black mx-auto px-[15px] mt-20">
      <img
        className="w-full h-full object-cover absolute inset-0 opacity-60"
        alt="Blog" 
        src="assets/img/background.jpg"/>
      <div className="tieu-de mx-auto px-4 h-full relative flex flex-col justify-center items-center">
        <div className="blog text-4xl md:text-6xl font-bold font-['Teko'] uppercase leading-tight text-center text-white">Blog</div>
        <div className="mo-dau mt-2 text-white text-base md:text-lg font-medium font-['Rajdhani'] leading-[24px] text-center">
          "Chào Mừng Đến Với Hành Trình Khám Phá Việt Nam"<br />
          "Trang blog của chúng tôi là nơi lưu giữ những hành trình thú vị, từ những điểm đến quen thuộc đến những khám phá mới mẻ và độc đáo."
        </div>
      </div>
    </div>
  );
}

export default Header;