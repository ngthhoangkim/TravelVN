import { ButtonGradient } from "./button";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';

//hình 63 tỉnh thành
import angiang from "../assets/img/angiang.png";
import bacgiang from "../assets/img/bacgiang.png";
import backan from "../assets/img/backan.png";
import baclieu from "../assets/img/baclieu.png";
import bacninh from "../assets/img/bacninh.png";
import bentre from "../assets/img/bentre.png";
import binhduong from "../assets/img/binhduong.png";
import binhdinh from "../assets/img/binhdinh.png";
import binhphuoc from "../assets/img/binhphuoc.png";
import binhthuan from "../assets/img/binhthuan.png";
import camau from "../assets/img/camau.png";
import cantho from "../assets/img/cantho.png";
import caobang from "../assets/img/caobang.png";
import daklak from "../assets/img/daklak.png";
import daknong from "../assets/img/daknong.png";
import danang from "../assets/img/danang.png";
import dienbien from "../assets/img/dienbien.png";
import dongnai from "../assets/img/dongnai.png";
import dongthap from "../assets/img/dongthap.png";
import gialai from "../assets/img/gialai.png";
import hagiang from "../assets/img/hagiang.png";
import hanam from "../assets/img/hanam.png";
import hanoi from "../assets/img/hanoi.png";
import hatinh from "../assets/img/hatinh.png";
import haiduong from "../assets/img/haiduong.png";
import haiphong from "../assets/img/haiphong.png";
import haugiang from "../assets/img/haugiang.png";
import hoabinh from "../assets/img/hoabinh.png";
import hue from "../assets/img/hue.png";
import hungyen from "../assets/img/hungyen.png";
import khanhhoa from "../assets/img/khanhhoa.png";
import kiengiang from "../assets/img/kiengiang.png";
import kontum from "../assets/img/kontum.png";
import laichau from "../assets/img/laichau.png";
import lamdong from "../assets/img/lamdong.png";
import langson from "../assets/img/langson.png";
import laocai from "../assets/img/laocai.png";
import longan from "../assets/img/longan.png";
import namdinh from "../assets/img/namdinh.png";
import nghean from "../assets/img/nghean.png";
import ninhbinh from "../assets/img/ninhbinh.png";
import ninhthuan from "../assets/img/ninhthuan.png";
import phutho from "../assets/img/phutho.png";
import phuyen from "../assets/img/phuyen.png";
import quangbinh from "../assets/img/quangbinh.png";
import quangnam from "../assets/img/quangnam.png";
import quangngai from "../assets/img/quangngai.png";
import quangninh from "../assets/img/quangninh.png";
import quangtri from "../assets/img/quangtri.png";
import soctrang from "../assets/img/soctrang.png";
import sonla from "../assets/img/sonla.png";
import tayninh from "../assets/img/tayninh.png";
import thaibinh from "../assets/img/thaibinh.png";
import thainguyen from "../assets/img/thainguyen.png";
import thanhhoa from "../assets/img/thanhhoa.png";
import tiengiang from "../assets/img/tiengiang.png";
import tphcm from "../assets/img/hcm.png";
import travinh from "../assets/img/travinh.png";
import tuyenquang from "../assets/img/tuyenquang.png";
import vinhlong from "../assets/img/vinhlong.png";
import vinhphuc from "../assets/img/vinhphuc.png";
import yenbai from "../assets/img/yenbai.png";


//mảng chứa ảnh
const locationData = [
    { img: angiang, title: "An Giang" },
    { img: bacgiang, title: "Bắc Giang" },
    { img: backan, title: "Bắc Kạn" },
    { img: baclieu, title: "Bạc Liêu" },
    { img: bacninh, title: "Bắc Ninh" },
    { img: bentre, title: "Bến Tre" },
    { img: binhduong, title: "Bình Dương" },
    { img: binhdinh, title: "Bình Định" },
    { img: binhphuoc, title: "Bình Phước" },
    { img: binhthuan, title: "Bình Thuận" },
    { img: camau, title: "Cà Mau" },
    { img: cantho, title: "Cần Thơ" },
    { img: caobang, title: "Cao Bằng" },
    { img: daklak, title: "Đắk Lắk" },
    { img: daknong, title: "Đắk Nông" },
    { img: danang, title: "Đà Nẵng" },
    { img: dienbien, title: "Điện Biên" },
    { img: dongnai, title: "Đồng Nai" },
    { img: dongthap, title: "Đồng Tháp" },
    { img: gialai, title: "Gia Lai" },
    { img: hagiang, title: "Hà Giang" },
    { img: hanam, title: "Hà Nam" },
    { img: hanoi, title: "Hà Nội" },
    { img: hatinh, title: "Hà Tĩnh" },
    { img: haiduong, title: "Hải Dương" },
    { img: haiphong, title: "Hải Phòng" },
    { img: haugiang, title: "Hậu Giang" },
    { img: hoabinh, title: "Hòa Bình" },
    { img: hue, title: "Huế" },
    { img: hungyen, title: "Hưng Yên" },
    { img: khanhhoa, title: "Khánh Hòa" },
    { img: kiengiang, title: "Kiên Giang" },
    { img: kontum, title: "Kon Tum" },
    { img: laichau, title: "Lai Châu" },
    { img: lamdong, title: "Lâm Đồng" },
    { img: langson, title: "Lạng Sơn" },
    { img: laocai, title: "Lào Cai" },
    { img: longan, title: "Long An" },
    { img: namdinh, title: "Nam Định" },
    { img: nghean, title: "Nghệ An" },
    { img: ninhbinh, title: "Ninh Bình" },
    { img: ninhthuan, title: "Ninh Thuận" },
    { img: phutho, title: "Phú Thọ" },
    { img: phuyen, title: "Phú Yên" },
    { img: quangbinh, title: "Quảng Bình" },
    { img: quangnam, title: "Quảng Nam" },
    { img: quangngai, title: "Quảng Ngãi" },
    { img: quangninh, title: "Quảng Ninh" },
    { img: quangtri, title: "Quảng Trị" },
    { img: soctrang, title: "Sóc Trăng" },
    { img: sonla, title: "Sơn La" },
    { img: tayninh, title: "Tây Ninh" },
    { img: thaibinh, title: "Thái Bình" },
    { img: thainguyen, title: "Thái Nguyên" },
    { img: thanhhoa, title: "Thanh Hóa" },
    { img: tiengiang, title: "Tiền Giang" },
    { img: tphcm, title: "TP Hồ Chí Minh" },
    { img: travinh, title: "Trà Vinh" },
    { img: tuyenquang, title: "Tuyên Quang" },
    { img: vinhlong, title: "Vĩnh Long" },
    { img: vinhphuc, title: "Vĩnh Phúc" },
    { img: yenbai, title: "Yên Bái" },
];

export function CardLocation() {
    // set state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(null);

    const navigate = useNavigate();

    //mở 
    const handleExploreClick = (location) => {
        setSelectedLocation(location);
        setIsModalOpen(true);
    };
    //đóng
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedLocation(null);
    };
    return (
        <div className="min-h-screen flex flex-col justify-center items-center lg:px-32 px-5">
            <h1 className="text-4xl font-semibold text-center pt-24 pb-10">63 tỉnh thành</h1>
            <div className="flex flex-wrap gap-8 justify-center">
                {locationData.map((location, index) => (
                    <div key={index} className=" w-full lg:w-1/4 p-5 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] rounded-lg">
                        <img className=" rounded-xl" src={location.img} alt="img" />
                        <div className=" space-y-4">
                            <h3 className=" font-semibold text-center text-xl pt-6">{location.title}</h3>
                            <div className=" flex flex-row items-center justify-center gap-4">
                                <ButtonGradient title="Khám phá" onClick={() => handleExploreClick(location.title)} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Hiện box chuyển hướng */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg w-80">
                        <h2 className="text-xl font-semibold text-center mb-4">
                            Hãy cùng khám phá {selectedLocation} thôi nào!
                        </h2>
                        <div className="flex flex-col space-y-3">
                            <button className="bg-blue-500 text-white p-2 rounded" onClick={() => navigate(`/location?search=${encodeURIComponent(selectedLocation)}`)}>
                                Địa điểm
                            </button>
                            <button className="bg-yellow-500 text-white p-2 rounded" onClick={() => navigate(`/history?search=${encodeURIComponent(selectedLocation)}`)}>
                                Lịch sử
                            </button>
                            <button className="bg-red-500 text-white p-2 rounded" onClick={() => navigate(`/cultural?search=${encodeURIComponent(selectedLocation)}`)}>
                                Văn hóa
                            </button>
                        </div>
                        <button className="mt-4 bg-gray-300 p-2 rounded w-full" onClick={closeModal}>
                            Đóng
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}


export function ListLocation({ txt }) {
    return (
        <div className="flex flex-col items-center p-4">
            <div className="w-full max-w-xs">
                {locationData.map((item, index) => (
                    <div key={index} className="flex items-center mb-4 p-4 border rounded-lg shadow hover:bg-gray-100">
                        <img src={item.img} alt={item.title} className="w-16 h-16 rounded-md mr-4" />
                        <div>
                            <h2 className="text-lg font-semibold">{item.title}</h2>
                            <p className="text-sm text-gray-600">{txt}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

