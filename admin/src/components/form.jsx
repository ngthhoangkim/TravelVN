import React, { useState, useEffect } from 'react';
import axios from "axios";

// form thêm
export function AddForm({ onCancel, apiUrl }) {
    const [regions, setRegions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);

    const [formData, setFormData] = useState({
        region: "",
        title: "",
        content: "",
        image: null
    });

    const fetchRegions = async () => {
        try {
            const response = await axios.get('http://localhost:8800/v1/region');
            setRegions(response.data);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRegions();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        setFormData((prevData) => ({
            ...prevData,
            image: e.target.files[0]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('image', selectedImage);
            const imageResponse = await axios.post("http://localhost:8800/v1/img/upload", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            
            const newData = {
                ...newData,
                
            }
        } catch (error) {
            setError(error.message);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-semibold mb-4">Thêm dữ liệu</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-2">
                        <label className="block text-sm font-medium">Tỉnh</label>
                        <select
                            name="region"
                            value={formData.region}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        >
                            <option value="">Chọn tỉnh</option>
                            {regions.map((region) => (
                                <option key={region._id} value={region.name}>
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
                            value={formData.title}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div className="mb-2">
                        <label className="block text-sm font-medium">Nội dung</label>
                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div className="mb-2">
                        <label className="block text-sm font-medium">Ảnh</label>
                        <input
                            type="file"
                            name="image"
                            onChange={handleFileChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div className="flex space-x-2 mt-4 justify-center">
                        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                            Lưu
                        </button>
                        <button type="button" onClick={onCancel} className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600">
                            Hủy
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// Component to Edit Existing Cultural Data
export function EditForm({ onCancel, apiUrl, initialData }) {
    const [regions, setRegions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        local_name: "",
        title: "",
        content: "",
        image: null
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                local_name: initialData.local_name,
                title: initialData.title,
                content: initialData.content,
                image: initialData.image || null
            });
        }
        const fetchRegions = async () => {
            try {
                const response = await axios.get('http://localhost:8800/v1/region');
                setRegions(response.data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRegions();
    }, [initialData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        setFormData((prevData) => ({
            ...prevData,
            image: e.target.files[0]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        formDataToSend.append("local_name", formData.local_name);
        formDataToSend.append("title", formData.title);
        formDataToSend.append("content", formData.content);
        if (formData.image) formDataToSend.append("image", formData.image);

        try {
            const response = await axios.put(apiUrl, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            console.log('Data updated successfully:', response.data);
            onCancel();
            window.location.reload();
            setFormData({ local_name: "", title: "", content: "", image: null });
        } catch (error) {
            setError(error.message);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-semibold mb-4">Edit Cultural Data</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-2">
                        <label className="block text-sm font-medium">Region</label>
                        <select
                            name="region"
                            value={formData.region}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        >
                            <option value="">Select Region</option>
                            {regions.map((region) => (
                                <option key={region._id} value={region.name}>
                                    {region.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-2">
                        <label className="block text-sm font-medium">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div className="mb-2">
                        <label className="block text-sm font-medium">Content</label>
                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div className="mb-2">
                        <label className="block text-sm font-medium">Image</label>
                        <input
                            type="file"
                            name="image"
                            onChange={handleFileChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div className="flex space-x-2 mt-4 justify-center">
                        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                            Save
                        </button>
                        <button type="button" onClick={onCancel} className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
