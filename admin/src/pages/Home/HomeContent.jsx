import React, { useState, useEffect } from 'react';
import axios from "axios";

export function HomeBar() {
    const [culturalCount, setCulturalCount] = useState(0);
    const [historyCount, setHistoryCount] = useState(0);
    const [localCount, setLocalCount] = useState(0);
    const [userCount, setUserCount] = useState(0);

    //đếm tổng bài viết
    const fetchCounts = async () => {
        try {
            const [localResponse, historyResponse, culturalResponse, userResponse] = await Promise.all([
                axios.get('http://localhost:8800/v1/local/count'),
                axios.get('http://localhost:8800/v1/history/count'),
                axios.get('http://localhost:8800/v1/cultural/count'),
                axios.get('http://localhost:8800/v1/user/count')
            ]);
            setLocalCount(localResponse.data.totalRecords || 0);
            setHistoryCount(historyResponse.data.totalRecords || 0);
            setCulturalCount(culturalResponse.data.totalRecords || 0);
            setUserCount(userResponse.data.totalRecords || 0);
        } catch (error) {
            console.error("Error fetching counts:", error);
        }
    };
    useEffect(() => {
        fetchCounts();
    }, []);
    return (
        <div className="bg-white rounded-lg shadow-sm p-6">

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Các thẻ thống kê */}
                <a href="/local">
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold mb-2">Tổng số bài viết</h3>
                        <p className="text-2xl font-bold text-blue-600">{localCount + culturalCount + historyCount}</p>
                    </div>
                </a>
                <a href="/manageUser">
                    <div className="bg-green-50 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold mb-2">Người dùng đã đăng ký</h3>
                        <p className="text-2xl font-bold text-green-600">{userCount}</p>
                    </div>
                </a>
            </div>
        </div>
    )
}

