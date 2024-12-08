import LocalBar from "../../../components/postBar";
import { Search } from "../../../components/search";
import React, { useState, useEffect } from 'react';
import axios from "axios";

function Cultural() {
    // State
    const [regions, setRegions] = useState([]);
    const [culturals, setCutural] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [culturalError, setCulturalError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [currentEditData, setCurrentEditData] = useState(null);
    const [newCultura, setnewCultura] = useState({
        region: "",
        title: "",
        content: "",
        address: "",
    });
    // Search 
    const filteredCultural = culturals.filter(
        (cultural) =>
            cultural.region?.name &&
            cultural.region.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    //lấy region
    const fetchRegions = async () => {
        try {
            const response = await axios.get('http://localhost:8800/v1/region');
            setRegions(response.data);
        } catch (error) {
            console.error("Error fetching regions:", error);
        }
    };
    // Fetch data from API
    const fetchCultural = async () => {
        try {
            const response = await axios.get('http://localhost:8800/v1/cultural');
            setCutural(response.data);
            setCulturalError(null);
        } catch (err) {
            setCulturalError(err.response?.data?.message || err.message);
        }
    };

    useEffect(() => {
        fetchCultural();
        fetchRegions();
    }, []);

    // đóng mở form
    const handleAddClick = () => setShowAddForm(true);
    const handleEditClick = (cultural) => {
        setCurrentEditData(cultural);
        setShowEditForm(true);
        setnewCultura({
            region: cultural.region.name,
            title: cultural.title,
            content: cultural.content,
            address: cultural.address,
        });
    };
    const handleCloseForm = () => {
        setShowAddForm(false);
        setShowEditForm(false);
        setCurrentEditData(null);
        setnewCultura({
            region: "",
            title: "",
            content: "",
            address: "",
        });
    };
    //thêm
    const handleAdd = async () => {
        try {
            const formData = new FormData();
            formData.append('image', selectedImage);

            const imgResponse = await axios.post("http://localhost:8800/v1/img/upload", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const newCulturalData = {
                ...newCultura,
                imgculural: imgResponse.data._id,
            };

            const response = await axios.post("http://localhost:8800/v1/cultural", newCulturalData);
            setCutural([...culturals, response.data]);

            setnewCultura({
                region: "",
                title: "",
                content: "",
                address: "",
                imgculural: null,
            });
            setShowAddForm(false);
            alert("Thêm thành công!");
            window.location.reload();
        } catch (error) {
            console.error("Error creating:", error);
            alert("Có lỗi xảy ra khi thêm: " + error.message);
        }
    };
    // sửa
    // Hàm này dùng để xử lý khi người dùng nhấn nút "Cập nhật"
    const handleUpdate = async () => {
        try {
            const updatedCulturalData = {
                region: newCultura.region,
                title: newCultura.title,
                content: newCultura.content,
                address: newCultura.address,
            };

            // Nếu có ảnh mới được chọn, upload ảnh đó trước
            if (selectedImage && currentEditData.imgculural) {
                const formData = new FormData();
                formData.append('image', selectedImage);
    
                // Cập nhật ảnh dựa trên ID ảnh hiện tại
                await axios.put(`http://localhost:8800/v1/img/${currentEditData.imgculural}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            }
    
            // Gửi yêu cầu cập nhật dữ liệu văn hóa
            await axios.put(`http://localhost:8800/v1/cultural/${currentEditData._id}`, updatedCulturalData);

            // Cập nhật lại danh sách văn hóa sau khi chỉnh sửa
            fetchCultural();
            handleCloseForm(); // Đóng form sau khi hoàn tất
            alert("Cập nhật thành công!");
            window.location.reload();
        } catch (error) {
            console.error("Error updating:", error);
            alert("Có lỗi xảy ra khi cập nhật: " + error.message);
        }
    };
    //xóa
    const handleDelete = async (id, imageId) => {
        const confirmDelete = window.confirm("Bạn có muốn xóa không?");
        if (!confirmDelete) return;

        try {
            //xóa ảnh
            let imageDeleted = false;
            if (imageId) {
                // Nếu có ảnh, xóa ảnh
                const imageResponse = await axios.delete(`http://localhost:8800/v1/img/${imageId}`);
                if (imageResponse.status === 200) {
                    imageDeleted = true;
                } else {
                    alert("Lỗi khi xóa ảnh: " + imageResponse.data.message);
                    return;
                }
            }
            //xoá bài viết
            const postResponse = await axios.delete(`http://localhost:8800/v1/cultural/${id}`);
            if (postResponse.status === 200) {
                if (imageDeleted || !imageId) {
                    alert("Xóa bài viết và ảnh thành công!");
                    window.location.reload();
                }
            } else {
                alert("Lỗi khi xóa bài viết: " + postResponse.data.message);
            }
        } catch (err) {
            alert("Lỗi khi xóa bài viết hoặc ảnh: " + err.message);
        }
    };

    return (
        <div>
            <LocalBar />
            <div className="my-2 flex items-center space-x-2">
                <div className="flex-grow">
                    <Search value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <button
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                    style={{ marginRight: '40px' }}
                    onClick={handleAddClick}>
                    Thêm
                </button>
            </div>
            {/* Show error */}
            {culturalError && (
                <div className="text-red-500 mt-2">
                    Lỗi khi tải dữ liệu: {culturalError}
                </div>
            )}
            {/* table hiển thị dữ liệu */}
            <table className="min-w-full table-auto border-collapse border border-gray-200 mt-6">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="py-2 px-4 border border-gray-300">STT</th>
                        <th className="py-2 px-4 border border-gray-300">Tỉnh</th>
                        <th className="py-2 px-4 border border-gray-300">Địa điểm</th>
                        <th className="py-2 px-4 border border-gray-300">Địa chỉ</th>
                        <th className="py-2 px-4 border border-gray-300">Nội dung</th>
                        <th className="py-2 px-4 border border-gray-300">Ảnh</th>
                        <th className="py-2 px-4 border border-gray-300">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredCultural.map((cultural, index) => (
                        <tr key={cultural._id} className="border-b">
                            <td className="py-2 px-4 border border-gray-300 text-center">{index + 1}</td>
                            <td className="py-2 px-4 border border-gray-300">{cultural.region.name}</td>
                            <td className="py-2 px-4 border border-gray-300">{cultural.title}</td>
                            <td className="py-2 px-4 border border-gray-300">{cultural.address}</td>
                            <td className="py-2 px-4 border border-gray-300">{cultural.content}</td>
                            <td className="py-2 px-4 border border-gray-300">
                                {cultural.imgculural ? (
                                    <img src={`http://localhost:8800/v1/img/${cultural.imgculural}`} alt="Cultural" className="w-16 h-16 object-cover" />
                                ) : (
                                    "No image"
                                )}
                            </td>
                            <td className="py-2 px-4 border border-gray-300 flex justify-center items-center">
                                <button onClick={() => handleDelete(cultural._id, cultural.imgculural)} className="text-red-500 hover:underline">Xóa</button>
                                <button onClick={() => handleEditClick(cultural)} className="text-red-500 ml-4 hover:underline">Sửa</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Add & Edit Form */}
            {showAddForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-semibold mb-4">Thêm dữ liệu</h2>
                        <form >
                            <div className="mb-2">
                                <label className="block text-sm font-medium">Tỉnh</label>
                                <select
                                    name="region"
                                    value={newCultura.region}
                                    onChange={(e) => setnewCultura({ ...newCultura, region: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded"
                                >
                                    <option value="">Chọn Tỉnh</option>
                                    {regions.map((region) => (
                                        <option key={region._id} value={region._id}>
                                            {region.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-2">
                                <label className="block text-sm font-medium">Địa điểm</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={newCultura.title}
                                    onChange={(e) => setnewCultura({ ...newCultura, title: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                            </div>
                            <div className="mb-2">
                                <label className="block text-sm font-medium">Địa chỉ</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={newCultura.address}
                                    onChange={(e) => setnewCultura({ ...newCultura, address: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                            </div>
                            <div className="mb-2">
                                <label className="block text-sm font-medium">Nội dung</label>
                                <textarea
                                    name="content"
                                    value={newCultura.content}
                                    onChange={(e) => setnewCultura({ ...newCultura, content: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                            </div>
                            <div className="mb-2">
                                <label className="block text-sm font-medium">Ảnh</label>
                                <input
                                    type="file"
                                    onChange={(e) => setSelectedImage(e.target.files[0])}
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                            </div>
                            <div className="flex justify-between mt-4">
                                <button
                                    type="button"
                                    onClick={handleCloseForm}
                                    className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600">
                                    Hủy
                                </button>
                                <button
                                    type="button"
                                    onClick={handleAdd}
                                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                                    Thêm
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {showEditForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-semibold mb-4">Sửa dữ liệu</h2>
                        <form>
                            <div className="mb-2">
                                <label className="block text-sm font-medium">Tỉnh</label>
                                <select
                                    name="region"
                                    value={newCultura.region}
                                    onChange={(e) => setnewCultura({ ...newCultura, region: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded"
                                >
                                    <option value="">Chọn Tỉnh</option>
                                    {regions.map((region) => (
                                        <option key={region._id} value={region._id}>
                                            {region.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-2">
                                <label className="block text-sm font-medium">Địa điểm</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={newCultura.title}
                                    onChange={(e) => setnewCultura({ ...newCultura, title: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                            </div>
                            <div className="mb-2">
                                <label className="block text-sm font-medium">Địa chỉ</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={newCultura.address}
                                    onChange={(e) => setnewCultura({ ...newCultura, address: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                            </div>
                            <div className="mb-2">
                                <label className="block text-sm font-medium">Nội dung</label>
                                <textarea
                                    name="content"
                                    value={newCultura.content}
                                    onChange={(e) => setnewCultura({ ...newCultura, content: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                            </div>
                            <div className="mb-2">
                                <label className="block text-sm font-medium">Ảnh</label>
                                <input
                                    type="file"
                                    onChange={(e) => setSelectedImage(e.target.files[0])}
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                            </div>
                            <div className="flex justify-between mt-4">
                                <button
                                    type="button"
                                    onClick={handleCloseForm}
                                    className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600">
                                    Hủy
                                </button>
                                <button
                                    type="button"
                                    onClick={handleUpdate}
                                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                                    Cập nhật
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Cultural;
