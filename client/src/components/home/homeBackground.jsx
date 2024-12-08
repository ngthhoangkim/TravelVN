import React from "react";

function HomeBackground(){
    return (
        <div className="homeBackground min-h-screen flex flex-row justify-between items-center lg:px-32 px-5 relative">
            {/* Background overlay */}
            <div className="absolute inset-0 bg-black opacity-50 z-10"></div>

            <div className="w-full space-y-5 z-20 relative">
                <h1 className="txtHome font-semibold text-7xl text-center">
                    Khám Phá Vẻ Đẹp Việt Nam
                </h1>
                <p className="text-white text-2xl text-center">
                    Nơi những ký ức được hình thành. Nơi mà từng món ăn là một cuộc phiêu lưu. <br />
                    Nơi văn hóa hòa quyện với thiên nhiên. Nơi trái tim ta tìm thấy bình yên.<br />
                    Nơi mỗi bước chân đều dẫn lối đến những câu chuyện
                </p>
            </div>
        </div>
    );
};

export default HomeBackground;
