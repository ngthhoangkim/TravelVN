import React, { useState, useEffect } from 'react';
import LocalBar from "../../../components/postBar";
import { Search } from "../../../components/search";
import axios from "axios";


function Local() {
    //state
    const [locals, setLocal] = useState([]);
    const [localError, setLocalError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [regions, setRegions] = useState([]);
    const [currentEditData, setCurrentEditData] = useState(null);
    const [newLocal, setnewLocal] = useState({
        region: "",
        title: "",
        content: "",
        address: "",
    });
    //tìm kiếm 
    const filteredLocal = locals.filter((local) =>
        local.region.name && local.region.name.toLowerCase().includes(searchTerm.toLowerCase())
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
    // Fetch dữ liệu từ API
    const fetchLocal = async () => {
        try {
            const response = await axios.get('http://localhost:8800/v1/local');
            setLocal(response.data);
            setLocalError(null);
        } catch (err) {
            setLocalError(err.response?.data?.message || err.message);
        }
    }

    useEffect(() => {
        fetchLocal();
        fetchRegions();
    }, []);
    // đóng mở form
    const handleAddClick = () => setShowAddForm(true);
    const handleEditClick = (local) => {
        setCurrentEditData(local);
        setShowEditForm(true);
        setnewLocal({
            region: local.region.name,
            title: local.title,
            content: local.content,
            address: local.address,
        });
    };
    const handleCloseForm = () => {
        setShowAddForm(false);
        setShowEditForm(false);
        setCurrentEditData(null);
        setnewLocal({
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

            const newLocalData = {
                ...newLocal,
                imgLocal: imgResponse.data._id,
            };

            const response = await axios.post("http://localhost:8800/v1/local", newLocalData);
            setLocal([...locals, response.data]);

            setnewLocal({
                region: "",
                title: "",
                content: "",
                address: "",
                imgLocal: null,
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
            const updatedLocalData = {
                region: newLocal.region,
                title: newLocal.title,
                content: newLocal.content,
                address: newLocal.address,
            };

            // Nếu có ảnh mới được chọn, update ảnh đó trước
            if (selectedImage && currentEditData.imgLocal) {
                const formData = new FormData();
                formData.append('image', selectedImage);
    
                // Cập nhật ảnh dựa trên ID ảnh hiện tại
                await axios.put(`http://localhost:8800/v1/img/${currentEditData.imgLocal}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            }

            // Gửi yêu cầu cập nhật dữ liệu văn hóa
            await axios.put(`http://localhost:8800/v1/local/${currentEditData._id}`, updatedLocalData);

            // Cập nhật lại danh sách văn hóa sau khi chỉnh sửa
            fetchLocal();
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
            const postResponse = await axios.delete(`http://localhost:8800/v1/local/${id}`);
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
            {localError && (
                <div className="text-red-500 mt-2">
                    Lỗi khi tải dữ liệu: {localError}
                </div>
            )}
            {/* table hiển thị dữ liệu */}
            <table className="min-w-full table-auto border-collapse border border-gray-200 mt-6">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="py-2 px-4 border border-gray-300">STT</th>
                        <th className="py-2 px-4 border border-gray-300">Tỉnh</th>
                        <th className="py-2 px-4 border border-gray-300">Địa điểm nổi bật</th>
                        <th className="py-2 px-4 border border-gray-300">Địa chỉ</th>
                        <th className="py-2 px-4 border border-gray-300">Nội dung</th>
                        <th className="py-2 px-4 border border-gray-300">Ảnh</th>
                        <th className="py-2 px-4 border border-gray-300">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredLocal.map((local,index) => (
                        <tr key={local._id} className="border-b">
                            <td className="py-2 px-4 border border-gray-300 text-center">{index + 1}</td>
                            <td className="py-2 px-4 border border-gray-300 text-center">{local.region.name}</td>
                            <td className="py-2 px-4 border border-gray-300 text-center">{local.title}</td>
                            <td className="py-2 px-4 border border-gray-300 text-center">{local.address}</td>
                            <td className="py-2 px-4 border border-gray-300 text-center">{local.content}</td>
                            <td className="py-2 px-4 border border-gray-300">
                                {local.imgLocal ? (
                                    <img src={`http://localhost:8800/v1/img/${local.imgLocal}`} alt="Local" className="w-16 h-16 object-cover" />
                                ) : (
                                    "No image"
                                )}
                            </td>
                            <td className="py-2 px-4 border border-gray-300 flex justify-center items-center">
                                <button onClick={() => handleDelete(local._id, local.imgLocal)} className="text-red-500">Xóa</button>
                                <button onClick={() => handleEditClick(local)} className="text-red-500 ml-4">Sửa</button>
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
                                    value={newLocal.region}
                                    onChange={(e) => setnewLocal({ ...newLocal, region: e.target.value })}
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
                                    value={newLocal.title}
                                    onChange={(e) => setnewLocal({ ...newLocal, title: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                            </div>
                            <div className="mb-2">
                                <label className="block text-sm font-medium">Địa chỉ</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={newLocal.address}
                                    onChange={(e) => setnewLocal({ ...newLocal, address: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                            </div>
                            <div className="mb-2">
                                <label className="block text-sm font-medium">Nội dung</label>
                                <textarea
                                    name="content"
                                    value={newLocal.content}
                                    onChange={(e) => setnewLocal({ ...newLocal, content: e.target.value })}
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
                                    value={newLocal.region}
                                    onChange={(e) => setnewLocal({ ...newLocal, region: e.target.value })}
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
                                    value={newLocal.title}
                                    onChange={(e) => setnewLocal({ ...newLocal, title: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                            </div>
                            <div className="mb-2">
                                <label className="block text-sm font-medium">Địa chỉ</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={newLocal.address}
                                    onChange={(e) => setnewLocal({ ...newLocal, address: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                            </div>
                            <div className="mb-2">
                                <label className="block text-sm font-medium">Nội dung</label>
                                <textarea
                                    name="content"
                                    value={newLocal.content}
                                    onChange={(e) => setnewLocal({ ...newLocal, content: e.target.value })}
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
    )
}

export default Local