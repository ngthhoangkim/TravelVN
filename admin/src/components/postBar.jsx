import { useNavigate, useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from "axios";

function LocalBar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [culturalCount, setCulturalCount] = useState(0);
    const [historyCount, setHistoryCount] = useState(0);
    const [localCount, setLocalCount] = useState(0);

    const isActive = (path) => location.pathname === path;

    const BackHome = () => {
        navigate('/'); // Điều hướng về trang Home
    };
    //đếm tổng bài viết
    const fetchCounts = async () => {
        try {
            const [localResponse, historyResponse, culturalResponse] = await Promise.all([
                axios.get('http://localhost:8800/v1/local/count'),
                axios.get('http://localhost:8800/v1/history/count'),
                axios.get('http://localhost:8800/v1/cultural/count'),
            ]);
            setLocalCount(localResponse.data.totalRecords || 0);
            setHistoryCount(historyResponse.data.totalRecords || 0);
            setCulturalCount(culturalResponse.data.totalRecords || 0);
        } catch (error) {
            console.error("Error fetching counts:", error);
        }
    };

    useEffect(() => {
        fetchCounts();
    }, []);


    return (
        <div className="p-6">
            <div className="flex items-center mb-4">
                {/* Icon */}
                <i
                    onClick={BackHome}
                    className="fas fa-arrow-left text-2xl text-blue-500 cursor-pointer mr-2"
                ></i>
                {/* Tiêu đề */}
                <h1 className="text-xl text-blue-500 font-semibold">Thông tin bài viết</h1>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Các thẻ thống kê */}
                    <div
                        onClick={() => navigate('/local')}
                        className={`p-4 rounded-lg text-center cursor-pointer ${isActive('/local') ? 'bg-blue-200 text-blue-700' : 'bg-blue-50 text-blue-600'}`}>
                        <h3 className="text-lg font-semibold mb-2">Địa điểm</h3>
                        <p className="text-2xl font-bold text-blue-600">{localCount}</p>
                    </div>
                    <div
                        onClick={() => navigate('/history')}
                        className={`p-4 rounded-lg text-center cursor-pointer ${isActive('/history') ? 'bg-yellow-200 text-yellow-700' : 'bg-yellow-50 text-yellow-600'}`}>
                        <h3 className="text-lg font-semibold mb-2">Lịch sử</h3>
                        <p className="text-2xl font-bold text-yellow-600">{historyCount}</p>
                    </div>
                    <div
                        onClick={() => navigate('/cultural')}
                        className={`p-4 rounded-lg text-center cursor-pointer ${isActive('/cultural') ? 'bg-red-200 text-red-700' : 'bg-red-50 text-red-600'}`}>
                        <h3 className="text-lg font-semibold mb-2">Văn hóa ẩm thực</h3>
                        <p className="text-2xl font-bold text-orange-600">{culturalCount}</p>
                    </div>
                </div>
            </div>
            <div className="flex-grow border-t border-black"></div>
        </div>
    )
}

export default LocalBar

