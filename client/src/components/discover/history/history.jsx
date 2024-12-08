import Navbar from "../../../layouts/navBar";
import { Search } from "../../../layouts/search";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate,useLocation } from "react-router-dom";
import { ButtonGradient } from "../../../layouts/button";

function History() {
    const [historys, setHistory] = useState([]);
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const initialSearchTerm = searchParams.get("search") || "";
    const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
    const [historyError, setHistoryError] = useState(null);
    const [regions, setRegions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 16;

    const navigate = useNavigate();

    // Fetch dữ liệu từ API
    const fetchHistory = async () => {
        try {
            const response = await axios.get("http://localhost:8800/v1/history");
            setHistory(response.data);
            setHistoryError(null);
        } catch (err) {
            setHistoryError(err.response?.data?.message || err.message);
        }
    };

    const fetchRegions = async () => {
        try {
            const response = await axios.get("http://localhost:8800/v1/region");
            setRegions(response.data);
        } catch (error) {
            console.error("Error fetching regions:", error);
        }
    };

    useEffect(() => {
        fetchHistory();
        fetchRegions();
    }, []);

    const filteredHistory = historys.filter((history) =>
        history.region.name && history.region.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentPageData = searchTerm
        ? filteredHistory
        : filteredHistory.slice(startIndex, startIndex + itemsPerPage);

    const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Hàm tạo mảng số trang giới hạn xung quanh trang hiện tại
    const getVisiblePages = () => {
        const delta = 2; // Hiển thị 2 trang trước và sau trang hiện tại
        const pages = [];

        for (let i = Math.max(1, currentPage - delta); i <= Math.min(totalPages, currentPage + delta); i++) {
            pages.push(i);
        }

        return pages;
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <div className="flex flex-1 mt-16">
                <main className="flex-1 p-6">
                    <Search
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                    <div className="p-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {currentPageData.map((local) => (
                                <div key={local._id || local.title} className="border rounded-lg overflow-hidden shadow-lg bg-white">
                                    <img
                                        src={`http://localhost:8800/v1/img/${local.imgHistory}`}
                                        alt={local.region.name}
                                        className="w-full h-40 object-cover"
                                    />
                                    <div className="p-4">
                                        <div className="flex justify-between items-center">
                                            <h2 className="font-semibold text-lg">{local.region.name}</h2>
                                            <ButtonGradient
                                                title="Chi tiết"
                                                onClick={() => navigate(`/history/${local._id}`)}
                                            />
                                        </div>
                                        <p className="text-gray-600 text-lg">{local.title}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Pagination */}
                    {!searchTerm && (
                        <div className="flex justify-center mt-4 space-x-2">
                            {/* Nút Previous */}
                            <button
                                className={`px-3 py-1 rounded ${
                                    currentPage === 1 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-gray-200 text-gray-700"
                                }`}
                                onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                {"<"}
                            </button>

                            {/* Hiển thị các số trang */}
                            {getVisiblePages().map((page) => (
                                <button
                                    key={page}
                                    className={`px-3 py-1 rounded ${
                                        currentPage === page ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
                                    }`}
                                    onClick={() => handlePageChange(page)}
                                >
                                    {page}
                                </button>
                            ))}

                            {/* Nút Next */}
                            <button
                                className={`px-3 py-1 rounded ${
                                    currentPage === totalPages ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-gray-200 text-gray-700"
                                }`}
                                onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                {">"}
                            </button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

export default History;
