import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from '../../layouts/navBar';
import axios from 'axios';
import { AuthContext } from "../../context/authContext";
import { IoIosCloseCircle } from "react-icons/io";
import { FaTrash } from "react-icons/fa";

function ProfilePage() {
  //state
  const [erro, setErro] = useState(null);
  const [avatar, setAvatar] = useState();
  const { user, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("posts");
  const [activeSubTab, setActiveSubTab] = useState("cultural");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [posts, setPosts] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newPost, setNewPost] = useState({ title: "", content: "" });
  const [selectedImage, setSelectedImage] = useState(null);

  //modal add bài viết
  const toggleAddModal = () => setIsAddModalOpen(!isAddModalOpen);
  //modal xem avata
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const [users, setUsers] = useState({
    username: "",
    bio: "",
    fullname: "",
    email: "",
    birthday: "",
    gender: "",
    phone: "",
    avatar: null,
  });

  const switchTab = (tab) => setActiveTab(tab);
  const switchSubTab = (subTab) => {
    setActiveSubTab(subTab);
  };

  //get user
  const fetchUser = async () => {
    try {
      const response = await axios.get(`http://localhost:8800/v1/user/${user._id}`);
      setUsers(response.data);
      setErro(null);
    } catch (err) {
      setErro(err.response?.data?.message || err.message);
    }
  };
  // update
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const updateUser = {
        username: users.username,
        bio: users.bio,
        fullname: users.fullname,
        email: users.email,
        birthday: users.birthday,
        gender: users.gender,
        phone: users.phone,
      };

      if (avatar) {
        const formData = new FormData();
        formData.append('image', avatar);

        const imgResponse = await axios.post("http://localhost:8800/v1/img/upload", formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setUsers((prev) => ({ ...prev, avatar: imgResponse.data._id }));
        updateUser.avatar = imgResponse.data._id;
      }

      await axios.put(`http://localhost:8800/v1/user/${user._id}`, updateUser);

      // Fetch the updated user data after updating
      await fetchUser();

      
      // Cập nhật lại user trong context
      dispatch({ type: "UPDATE_USER", payload: { ...users } });
      
      alert("Cập nhật thành công!");
    } catch (error) {
      console.error("Error updating:", error);
      alert("Có lỗi xảy ra khi cập nhật: " + error.message);
    }
  };
  //get danh sách yêu thích
  const fetchFavorites = async () => {
    try {
      const response = await axios.get(`http://localhost:8800/v1/favorite?userId=${user._id}`);
      setFavorites(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách yêu thích:", error);
    }
  };
  //user
  useEffect(() => {
    fetchUser();
  }, []);
  //tab
  useEffect(() => {
    if (activeTab === "favorites") {
      fetchFavorites();
    }
    if (activeTab === "posts") {
      fetchPosts();
    }
  }, [activeTab]);

  // Fetch bài viết
  const fetchPosts = async () => {
    try {
      const response = await axios.get(`http://localhost:8800/v1/blog/showByUser?userId=${user._id}`);

      if (response.data.success === false) {
        // Không có bài viết, hiển thị thông báo
        console.log('Không có bài viết từ người dùng này.');
        setPosts([]); // Đặt danh sách bài viết rỗng nếu cần
        return;
      }

      console.log('Posts response:', response.data);
      setPosts(response.data.posts || []);
    } catch (error) {
      if (error.response?.status === 404 && error.response?.data?.message === 'Không có bài viết nào từ người dùng này.') {
        // Hiển thị thông báo thay vì ghi lỗi ra console
        console.log('Không có bài viết từ người dùng này.');
        setPosts([]); // Đặt danh sách bài viết rỗng nếu cần
      } else {
        // Xử lý các lỗi khác
        console.error("Lỗi khi lấy bài viết:", error);
      }
    }
  };
  // Thêm bài viết mới
  const handleAddPost = async () => {
    try {
      const formData = new FormData();
      formData.append('image', selectedImage);

      const imgResponse = await axios.post("http://localhost:8800/v1/img/upload", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const imageId = imgResponse.data._id;
      const newPostData = {
        ...newPost,
        postedBy: user._id,
        image: imageId
      };

      const response = await axios.post("http://localhost:8800/v1/blog/create", newPostData);
      console.log("Blog create response:", response);
      setPosts([...posts, response.data]);

      setNewPost({
        title: "",
        content: "",
        postedBy: user._id,
        image: null,
      });
      alert("Thêm thành công!");
      toggleAddModal(); // Đóng modal
      window.location.reload();
    } catch (error) {
      console.error("Lỗi khi thêm bài viết:", error.response?.data || error.message);
      alert("Có lỗi xảy ra khi thêm bài viết.");
    }
  };
  //xóa bài viết
  const handleDeletePost = async (postId, imageId) => {
    // Hiển thị hộp thoại xác nhận trước khi xóa
    const confirmDelete = window.confirm("Bạn có muốn xóa không?");
    if (!confirmDelete) {
      return; // Nếu người dùng nhấn "Cancel", không thực hiện xóa
    }

    try {
      let imageDeleted = false;
      // Kiểm tra xem bài viết có ảnh không
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

      // Tiến hành xóa bài viết
      const postResponse = await axios.delete(`http://localhost:8800/v1/blog/delete/${postId}`);
      if (postResponse.status === 200) {
        if (imageDeleted || !imageId) {
          alert("Xóa bài viết và ảnh thành công!");
          window.location.reload();
        }
      } else {
        alert("Lỗi khi xóa bài viết: " + postResponse.data.message);
      }
    } catch (error) {
      alert("Lỗi khi xóa bài viết hoặc ảnh: " + error.message);
    }
  };
  return (
    <div className="m-4">
      <div className="fixed top-0 left-0 right-0 z-10">
        <Navbar />
      </div>

      <div className="pt-16 max-w-4xl mx-auto p-4">
        {/* Profile */}
        <div className="flex items-center space-x-6 mb-8">
          <div
            className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300"
            onClick={toggleModal}>
            <img
              src={users.avatar ? `http://localhost:8800/v1/img/${users.avatar}` : "assets/img/user.jpg"}
              alt="Profile"
              className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold">{users.username}</h1>
            <p className="text-gray-600">
              {users.fullname || "Chưa cập nhật họ tên"}
            </p>
            <p className="text-gray-600">
              {users.bio || "Chưa cập nhật tiểu sử"}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex justify-around border-t border-b border-gray-200 py-2 mb-8">
          <button
            className={`text-sm font-medium ${activeTab === "posts" ? "text-black" : "text-gray-500"}`}
            onClick={() => switchTab("posts")}
          >
            Bài viết
          </button>
          <button
            className={`text-sm font-medium ${activeTab === "favorites" ? "text-black" : "text-gray-500"}`}
            onClick={() => switchTab("favorites")}
          >
            Yêu thích
          </button>
          <button
            className={`text-sm font-medium ${activeTab === "edit" ? "text-black" : "text-gray-500"}`}
            onClick={() => switchTab("edit")}
          >
            Chỉnh sửa trang cá nhân
          </button>
        </div>
        {/* xem avatar */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
            <div className="bg-white p-4 rounded-md relative">
              <img
                src={users.avatar ? `http://localhost:8800/v1/img/${users.avatar}` : "assets/img/user.jpg"}
                alt="Profile"
                className="max-w-full max-h-full" />
              {/* Nút đóng */}
              <IoIosCloseCircle
                onClick={toggleModal}
                className="absolute top-2 right-2 w-6 h-6 text-gray-700 cursor-pointer"
              />
            </div>
          </div>
        )}
        {/* chuyển tab */}
        {/* edit */}
        {activeTab === "edit" && (
          <div className="mt-8 p-4 border border-gray-300 rounded-lg">
            <h2 className="text-lg font-semibold mb-4 text-center">Chỉnh sửa thông tin</h2>
            <form>
              {/* Avatar */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700" htmlFor="avatar">Avatar</label>
                <input
                  type="file"
                  onChange={(e) => setAvatar(e.target.files[0])}
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
                />
              </div>

              {/* Full Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Họ và tên</label>
                <input
                  type="text"
                  name="fullname"
                  value={users.fullname}
                  onChange={(e) => setUsers({ ...users, fullname: e.target.value })}
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Username</label>
                <input
                  type="text"
                  name="username"
                  value={users.username}
                  onChange={(e) => setUsers({ ...users, username: e.target.value })}
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={users.email}
                  onChange={(e) => setUsers({ ...users, email: e.target.value })}
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                <input
                  type="text"
                  name="phone"
                  value={users.phone}
                  onChange={(e) => setUsers({ ...users, phone: e.target.value })}
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Tiểu sử</label>
                <textarea
                  type="bio"
                  name="bio"
                  value={users.bio}
                  onChange={(e) => setUsers({ ...users, bio: e.target.value })}
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
                />
              </div>

              <button
                type="submit"
                onClick={handleUpdate}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
              >
                Cập nhật
              </button>
            </form>
          </div>
        )}
        {/* favorites */}
        {activeTab === "favorites" && (
          <div>
            <h2 className="text-lg font-semibold mb-4 text-center">Danh sách yêu thích</h2>
            <div className="flex justify-around mb-4">
              <button
                className={`text-sm font-medium ${activeSubTab === "cultural" ? "text-black" : "text-gray-500"}`}
                onClick={() => switchSubTab("cultural")}
              >
                Văn hóa
              </button>
              <button
                className={`text-sm font-medium ${activeSubTab === "history" ? "text-black" : "text-gray-500"}`}
                onClick={() => switchSubTab("history")}
              >
                Lịch sử
              </button>
              <button
                className={`text-sm font-medium ${activeSubTab === "local" ? "text-black" : "text-gray-500"}`}
                onClick={() => switchSubTab("local")}
              >
                Địa điểm
              </button>
            </div>
          </div>
        )}
        {/* văn hóa */}
        {activeTab === "favorites" && activeSubTab === "cultural" && (
          <div className="mt-8 p-4 border border-gray-300 rounded-lg">
            {favorites.data && favorites.data.culturals.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {favorites.data.culturals.map((cultural) => (
                  <div
                    key={cultural._id}
                    className="border border-gray-300 p-4 rounded-md shadow-sm flex flex-col items-center text-center"
                  >
                    <img
                      src={`http://localhost:8800/v1/img/${cultural.imgculural}`}
                      alt={cultural.title}
                      className="w-full h-48 object-cover rounded-md mb-4"
                    />
                    <h3 className="font-medium text-lg">{cultural.title}</h3>
                    <p className="text-gray-500 text-sm">{cultural.region.name}</p>
                    <button
                      className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                      onClick={() => navigate(`/cultural/${cultural._id}`)}
                    >
                      Chi tiết
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">Chưa có mục yêu thích nào.</p>
            )}
          </div>
        )}
        {/* lịch sử */}
        {activeTab === "favorites" && activeSubTab === "history" && (
          <div className="mt-8 p-4 border border-gray-300 rounded-lg">
            {favorites.data && favorites.data.histories.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {favorites.data.histories.map((history) => (
                  <div
                    key={history._id}
                    className="border border-gray-300 p-4 rounded-md shadow-sm flex flex-col items-center text-center"
                  >
                    <img
                      src={`http://localhost:8800/v1/img/${history.imgHistory}`}
                      alt={history.title}
                      className="w-full h-48 object-cover rounded-md mb-4"
                    />
                    <h3 className="font-medium text-lg">{history.title}</h3>
                    <p className="text-gray-500 text-sm">{history.region.name}</p>
                    <button
                      className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                      onClick={() => navigate(`/history/${history._id}`)}
                    >
                      Chi tiết
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">Chưa có mục yêu thích nào.</p>
            )}
          </div>
        )}
        {/* địa điểm */}
        {activeTab === "favorites" && activeSubTab === "local" && (
          <div className="mt-8 p-4 border border-gray-300 rounded-lg">
            {favorites.data && favorites.data.locals && favorites.data.locals.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {favorites.data.locals.map((local) => (  // Sửa lại từ favorites.data.histories thành favorites.data.locals
                  <div
                    key={local._id}
                    className="border border-gray-300 p-4 rounded-md shadow-sm flex flex-col items-center text-center"
                  >
                    <img
                      src={`http://localhost:8800/v1/img/${local.imgLocal}`}
                      alt={local.title}
                      className="w-full h-48 object-cover rounded-md mb-4"
                    />
                    <h3 className="font-medium text-lg">{local.title}</h3>
                    <p className="text-gray-500 text-sm">{local.region.name}</p>
                    <button
                      className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                      onClick={() => navigate(`/local/${local._id}`)}  // Đổi URL sang đúng mục tiêu
                    >
                      Chi tiết
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">Chưa có mục yêu thích nào.</p>
            )}
          </div>
        )}
        {/* blog */}
        {activeTab === "posts" && (
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Danh sách bài viết</h2>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
                onClick={toggleAddModal}
              >
                Thêm bài viết
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {posts.length > 0 ? (
                posts.map((post, index) => (
                  <div
                    key={post._id || index}
                    className="border border-gray-300 p-4 rounded-md shadow-sm"
                  >
                    {/* Nút xóa bài viết */}
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium text-lg">{post.title}</h3>
                      {/* Nút xóa bài viết */}
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDeletePost(post._id, post.image)}
                        title="Xóa bài viết"
                      >
                        <FaTrash className="w-5 h-5" /> {/* FA icon */}
                      </button>
                    </div>
                    <p className="text-gray-500 text-sm">{post.content}</p>
                    <div className="mt-2">
                      <p className="text-gray-400 text-xs">
                        Đăng bởi {post.postedBy?.username || "NULL"}
                      </p>
                    </div>

                    {/* Image */}
                    <div className="mt-4">
                      {post.image ? (
                        <img
                          src={`http://localhost:8800/v1/img/${post.image}`}
                          alt={post.title}
                          className="w-full h-48 object-cover rounded-md mb-4"
                        />
                      ) : (
                        <p className="text-gray-400 text-sm">Không có ảnh</p>
                      )}
                    </div>
                    <button
                      className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
                      onClick={() => navigate(`/blog/${post._id}`)}
                    >
                      Chi tiết
                    </button>

                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">Chưa có bài viết nào.</p>
              )}
            </div>
          </div>
        )}
        {/* thêm bài viết */}
        {isAddModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
            <div className="bg-white p-4 rounded-md relative w-full max-w-lg">
              <IoIosCloseCircle
                onClick={toggleAddModal}
                className="absolute top-2 right-2 w-6 h-6 text-gray-700 cursor-pointer"
              />
              <h2 className="text-lg font-semibold mb-4">Thêm bài viết mới</h2>
              <form>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Tiêu đề</label>
                  <input
                    type="text"
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Nội dung</label>
                  <textarea
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Hình ảnh</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelectedImage(e.target.files[0])}
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
                  />
                </div>
                <button
                  onClick={handleAddPost}
                  type="button"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md">
                  Thêm
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
export default ProfilePage;
