import Navbar from "../../../layouts/navBar";
import { Search } from "../../../layouts/search";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate,useLocation } from "react-router-dom";
import { ButtonGradient } from "../../../layouts/button";

function Location() {
    const [locals, setLocals] = useState([]);
    const [regions, setRegions] = useState([]);
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const initialSearchTerm = searchParams.get("search") || "";
    const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
    const [currentPage, setCurrentPage] = useState(1); // State cho trang hiện tại
    const itemsPerPage = 16; // Số lượng item trên mỗi trang

    const navigate = useNavigate();

    // Fetch local data
    const fetchLocals = async () => {
        try {
            const response = await axios.get("http://localhost:8800/v1/local");
            setLocals(response.data);
        } catch (error) {
            console.error("Error fetching locals:", error);
        }
    };

    // Fetch region data
    const fetchRegions = async () => {
        try {
            const response = await axios.get("http://localhost:8800/v1/region");
            setRegions(response.data);
        } catch (error) {
            console.error("Error fetching regions:", error);
        }
    };

    useEffect(() => {
        fetchLocals();
        fetchRegions();
    }, []);

    // Filter locals by province name based on search input
    const filteredLocal = locals.filter(
        (local) =>
            local.region.name &&
            local.region.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Tính toán dữ liệu hiển thị trên trang hiện tại
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentPageData = searchTerm
        ? filteredLocal // Hiển thị toàn bộ khi tìm kiếm
        : filteredLocal.slice(startIndex, startIndex + itemsPerPage); // Phân trang khi không tìm kiếm

    // Tính tổng số trang
    const totalPages = Math.ceil(filteredLocal.length / itemsPerPage);

    // Hàm xác định các trang liên quan
    const getVisiblePages = () => {
        const delta = 2; // Số trang trước và sau trang hiện tại
        const pages = [];
        for (let i = Math.max(1, currentPage - delta); i <= Math.min(totalPages, currentPage + delta); i++) {
            pages.push(i);
        }
        return pages;
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="min-h-screen flex flex-col">
            {/* Navbar */}
            <Navbar />
            {/* Main Content */}
            <div className="flex flex-1 mt-16">
                <main className="flex-1 p-6">
                    {/* Search Component */}
                    <Search
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1); // Reset về trang đầu khi tìm kiếm
                        }}
                    />
                    <div className="p-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {currentPageData.map((local) => (
                                <div
                                    key={local._id || local.title}
                                    className="border rounded-lg overflow-hidden shadow-lg bg-white"
                                >
                                    <img
                                        src={`http://localhost:8800/v1/img/${local.imgLocal}`}
                                        alt={local.region.name}
                                        className="w-full h-40 object-cover"
                                    />
                                    <div className="p-4">
                                        <div className="flex justify-between items-center">
                                            <h2 className="font-semibold text-lg">
                                                {local.region.name}
                                            </h2>
                                            <ButtonGradient
                                                title="Chi tiết"
                                                onClick={() => navigate(`/local/${local._id}`)}
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
                                    currentPage === 1
                                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                        : "bg-gray-200 text-gray-700"
                                }`}
                                onClick={() =>
                                    currentPage > 1 && handlePageChange(currentPage - 1)
                                }
                                disabled={currentPage === 1}
                            >
                                {"<"}
                            </button>

                            {/* Hiển thị các trang */}
                            {getVisiblePages().map((page) => (
                                <button
                                    key={page}
                                    className={`px-3 py-1 rounded ${
                                        currentPage === page
                                            ? "bg-blue-500 text-white"
                                            : "bg-gray-200 text-gray-700"
                                    }`}
                                    onClick={() => handlePageChange(page)}
                                >
                                    {page}
                                </button>
                            ))}

                            {/* Nút Next */}
                            <button
                                className={`px-3 py-1 rounded ${
                                    currentPage === totalPages
                                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                        : "bg-gray-200 text-gray-700"
                                }`}
                                onClick={() =>
                                    currentPage < totalPages &&
                                    handlePageChange(currentPage + 1)
                                }
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

export default Location;
