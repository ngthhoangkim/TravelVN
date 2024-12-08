import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/authContext";
import axios from "axios";

function Comment({ postId }) {
    const { user } = useContext(AuthContext);
    const [comments, setComments] = useState([]);
    const [formData, setFormData] = useState({
        userId: user._id,
        rating: 0,
        comment: "",
    });
    const [showModal, setShowModal] = useState(false);const [showCommentsModal, setShowCommentsModal] = useState(false);
    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            comment: e.target.value,
        });
    };

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:8800/v1/blog/review/all/${postId}`
                );

                if (Array.isArray(response.data)) {
                    setComments(response.data);
                } else {
                    console.error("Mảng không có!");
                    setComments([]);
                }
            } catch (error) {
                console.error("Lỗi", error.message);
                setComments([]);
                alert("Đã xảy ra lỗi không xác định. Vui lòng thử lại sau.");
            }
        };
        fetchComments();
    }, [postId]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.comment.trim()) {
            setShowModal(true);
            return;
        }

        if (!postId) {
            console.error("Bài viết không tồn tại!");
            return;
        }

        if (!user || !user._id) {
            console.error("Người dùng chưa đăng nhập!");
            return;
        }

        const payload = {
            ...formData,
            userId: user._id,
        };

        console.log("Submitted data:", payload);

        try {
            const response = await fetch(
                `http://localhost:8800/v1/blog/reviews/${postId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                }
            );
            const data = await response.json();
            console.log("Response:", data);

            setFormData({ userId: user._id, comment: "" });
            alert("Đã gửi bình luận!");
            window.location.reload();
        } catch (error) {
            console.error("Error:", error);
            alert("Đã xảy ra lỗi khi gửi đánh giá. Vui lòng thử lại!");
        }
    };

     return (
        <div className="Horizontalborder w-full mt-8 pb-6 border-b border-black/20">
            {/* Header */}
            <div className="Heading4ReletedTags w-full h-[30px] text-[#151515] text-[20px] font-medium leading-[30px] flex justify-between">
                <div className="Tag text-[22px]">Bình luận</div>
                <button
                    onClick={() => setShowCommentsModal(true)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 text-[18px] flex items-center justify-center"
                >
                    Xem bình luận
                </button>
            </div>

            {/* Comment Input */}
            <div className="Form w-full h-auto relative flex flex-col items-start mt-4">
                <textarea
                    className="w-full h-[80px] p-3 bg-white rounded-md border border-gray-300 text-gray-700 text-[18px] resize-none"
                    placeholder="Viết bình luận..."
                    value={formData.comment}
                    onChange={handleInputChange}
                ></textarea>
                <button
                    className="mt-3 w-[100px] h-[36px] bg-blue-500 hover:bg-blue-600 rounded-md text-white text-[18px] font-medium mx-auto"
                    onClick={(e) => {
                        if (!formData.comment.trim()) {
                            setShowModal(true);
                        } else {
                            handleSubmit(e);
                        }
                    }}
                >
                    Gửi
                </button>
            </div>

            {/* Comments Modal */}
            {showCommentsModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold">Danh sách bình luận</h2>
                            <button
                                onClick={() => setShowCommentsModal(false)}
                                className="text-gray-500 hover:text-black"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="flex flex-col space-y-4 max-h-[400px] overflow-y-auto">
                            {comments && comments.length > 0 ? (
                                comments.map((comment, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start space-x-4 p-4 bg-gray-100 rounded-lg"
                                    >
                                        <div className="flex flex-col space-y-2 w-full">
                                            <div className="text-[18px] font-medium text-[#151515]">
                                                {comment.username || "Người dùng"}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {comment.createdAt
                                                    ? new Date(comment.createdAt).toLocaleDateString()
                                                    : "Ngày không xác định"}
                                            </div>
                                            <div className="text-base text-gray-700">
                                                {comment.comment}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500">Chưa có bình luận nào.</p>
                            )}
                        </div>
                        <div className="mt-4 text-right">
                            <button
                                onClick={() => setShowCommentsModal(false)}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Notification Modal */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                        <h2 className="text-xl font-semibold mb-4">Thông báo</h2>
                        <p className="text-gray-700">Bạn chưa nhập bình luận!</p>
                        <button
                            className="mt-4 px-6 py-2 bg-[#007BFF] text-white rounded-lg"
                            onClick={() => setShowModal(false)}
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Comment;


