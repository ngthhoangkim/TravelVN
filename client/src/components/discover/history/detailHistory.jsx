import React, { useState, useEffect, useContext } from 'react';
import Navbar from "../../../layouts/navBar";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { ButtonGradient } from '../../../layouts/button';
import { AuthContext } from "../../../context/authContext";

function DetailHistory() {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [historyDetail, setHistoryDetail] = useState(null);
    const [error, setError] = useState(null);
    const [isFavorited, setIsFavorited] = useState(false);
    const [featuredHistorys, setFeaturedHistorys] = useState([]);

    // Fetch all
    const fetchAllHistorys = async () => {
        try {
            const response = await axios.get("http://localhost:8800/v1/history");
            const allHistory = response.data;

            //chọn 4 thẻ
            const shuffledHistorys = allHistory.sort(() => 0.5 - Math.random());
            const randomHistorys = shuffledHistorys.slice(0, 4);
            setFeaturedHistorys(randomHistorys);
        } catch (error) {
            alert("Lỗi");
        }
    };
    // fetch yêu thích
    const fetchFavoriteStatus = async () => {
        if (!user) return;
        try {
            const response = await axios.get(`http://localhost:8800/v1/favorite?userId=${user._id}`);
            const isFavorited = response.data.data.histories.some(history => history._id === id);
            setIsFavorited(isFavorited);
        } catch (error) {
            console.error("Error fetching favorite status", error);
        }
    };
    const toggleFavorite = async () => {
        if (!user) return;
        try {
            if (isFavorited) {
                // Remove 
                await axios.delete(
                    `http://localhost:8800/v1/favorite`,
                    {
                        data: {
                            userId: user._id,
                            type: "history",
                            itemId: historyDetail._id
                        },
                        headers: {
                            Authorization: `Bearer ${user.token}`,
                        }
                    }
                );
                setIsFavorited(false);
            } else {
                // Add 
                await axios.post(
                    "http://localhost:8800/v1/favorite",
                    {
                        userId: user._id,
                        type: "history",
                        itemId: historyDetail._id,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${user.token}`,
                        }
                    }
                );
                setIsFavorited(true);
            }
        } catch (error) {
            console.error("Error toggling favorite status", error);
            alert(error.response?.data?.message || "Lỗi không xác định");
        }
    };
    useEffect(() => {
        const fetchHistoryDetail = async () => {
            try {
                const response = await axios.get(`http://localhost:8800/v1/history/${id}`);
                setHistoryDetail(response.data);
            } catch (error) {
                setError("Lỗi tải dữ liệu!");
                console.error(error);
            }
        };
        if (id) {
            fetchHistoryDetail();
            fetchFavoriteStatus();
        }
        fetchAllHistorys();
    }, [id, user]);

    if (error) return <p>{error}</p>;
    if (!historyDetail) return <p>Loading...</p>;

    return (
        <div className='m-5' >
            <div className="fixed top-0 left-0 right-0 z-50">
                <Navbar />
            </div>
            <div className="container my-5 pt-20">
                <div className="flex flex-col md:flex-row items-center justify-between space-x-6">
                    <div className="w-full md:w-1/2 flex justify-center">
                        <img
                            src={`http://localhost:8800/v1/img/${historyDetail.imgHistory}`}
                            alt={historyDetail.region.name}
                            className="rounded-lg shadow-lg max-w-full h-auto"
                        />
                    </div>
                    <div className="w-full md:w-1/2 flex flex-col justify-center text-center md:text-left space-y-4">
                        <div className="flex items-center justify-center md:justify-start space-x-2">
                            <h1 className="text-3xl font-bold">{historyDetail.title}</h1>
                            <button onClick={toggleFavorite} className="text-red-500 text-2xl focus:outline-none">
                                <i className={`fas fa-heart ${isFavorited ? 'text-red-500' : 'text-gray-400'}`}></i>
                            </button>
                        </div>
                        <hr className="border-t-2 border-gray-300 my-2" />
                        <h2 className="text-xl font-semibold">{historyDetail.region.name}</h2>
                        <p className="text-gray-700">{historyDetail.content}</p>
                        <p className="text-gray-700">{historyDetail.address}</p>
                    </div>
                </div>
                {/* Địa điểm nổi bật lấy random */}
                <div className="mt-10">
                    <h2 className="text-2xl font-bold mb-6">Địa điểm nổi bật</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {featuredHistorys.map((location) => (
                            <div key={location._id || location.title} className="border rounded-lg overflow-hidden shadow-lg bg-white">
                                <img
                                    src={`http://localhost:8800/v1/img/${location.imgHistory}`}
                                    alt={location.title}
                                    className="w-full h-40 object-cover"
                                />
                                <div className="p-4">
                                    <div className="flex justify-between items-center">
                                        <h2 className="font-semibold text-lg">
                                            {historyDetail.region ? historyDetail.region.name : "Vùng không xác định"}
                                        </h2>
                                        <ButtonGradient
                                            title="Chi tiết"
                                            onClick={() => navigate(`/history/${location._id}`)}
                                        />
                                    </div>
                                    <p className="text-gray-600 text-lg">{location.title}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

}

export default DetailHistory;