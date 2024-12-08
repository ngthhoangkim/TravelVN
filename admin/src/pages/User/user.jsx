import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import axios from "axios";
import { AuthContext } from "../../context/authContext";

function User() {
    const navigate = useNavigate();
    const { loading, error, user } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [userError, setUserError] = useState(null);

    // Hàm điều hướng về trang chủ
    const BackHome = () => {
        navigate('/');
    };

    // Lấy danh sách người dùng
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:8800/v1/user');
                setUsers(response.data);
            } catch (err) {
                setUserError(err.response?.data?.message || err.message);
            }
        };
        fetchUsers();
    }, [user]);

    // Lọc những người dùng không phải là admin
    const filteredUsers = users.filter(user => !user.isAdmin);

    // Hàm xóa người dùng
    const deleteUser = async (userId,avatarId,photo) => {
        const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa không?");
        if (!confirmDelete) return;

        try {
            //xóa ảnh 
            if (avatarId) {
                const imageResponse = await axios.delete(`http://localhost:8800/v1/image/${avatarId}`, {
                    headers: { Authorization: `Bearer ${user.token}` },
                });
                if (imageResponse.status !== 200) {
                    throw new Error('Không thể xóa avata');
                }
            }
            //xóa photo
            if (photo) {
                const imageResponse = await axios.delete(`http://localhost:8800/v1/image/${photo}`, {
                    headers: { Authorization: `Bearer ${user.token}` },
                });
                if (imageResponse.status !== 200) {
                    throw new Error('Không thể xóa ảnh');
                }
            }
            const response = await axios.delete(`http://localhost:8800/v1/user/${userId}`, {
                headers: { Authorization: `Bearer ${user.token}` },
            });

            if (response.status === 200) {
                setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
                alert("xóa thành công!");
                window.location.reload();
            } else {
                throw new Error('Không thể xóa người dùng');
            }
        } catch (err) {
            setUserError(err.response?.data?.message || err.message);
        }
    };

    if (loading) return <p>Đang tải...</p>;
    if (error || userError) return <p>{error || userError}</p>;

    return (
        <div className="p-6">
            <div className="flex items-center mb-4">
                <i onClick={BackHome} className="fas fa-arrow-left text-2xl text-blue-500 cursor-pointer mr-2"></i>
                <h1 className="text-xl text-blue-500 font-semibold">Thông tin người dùng</h1>
            </div>
            <table className="min-w-full table-auto border-collapse border border-gray-200">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="py-2 px-4 border border-gray-300">Username</th>
                        <th className="py-2 px-4 border border-gray-300">Email</th>
                        <th className="py-2 px-4 border border-gray-300">Số điện thoại</th>
                        <th className="py-2 px-4 border border-gray-300">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.map(user => (
                        <tr key={user._id} className="border-b">
                            <td className="py-2 px-4 border border-gray-300 text-center">{user.username}</td>
                            <td className="py-2 px-4 border border-gray-300 text-center">{user.email}</td>
                            <td className="py-2 px-4 border border-gray-300 text-center">{user.phone}</td>
                            <td className="py-2 px-4 border border-gray-300 flex justify-center items-center">
                                <button onClick={() => deleteUser(user._id)} className="text-red-500">Xóa</button>
                                <button className="text-red-500 ml-4">Khóa</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default User;
