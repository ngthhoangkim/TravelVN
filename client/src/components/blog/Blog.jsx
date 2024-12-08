import Navbar from "../../layouts/navBar";
import Header from './header';
import React, { useEffect, useState } from 'react';
import { Search } from "../../layouts/search";


function Blog() {
  const [posts, setPosts] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  // Hàm lấy tất cả bài viết
  const fetchPosts = async () => {
    try {
      const response = await fetch('http://localhost:8800/v1/blog/all');
      const data = await response.json();
      if (data.success) {
        setPosts(data.posts);
      }
    } catch (error) {
      console.error('Lỗi lấy dữ liệu:', error);
    }
  };

  // Hàm lọc bài viết theo username
  const filteredPosts = posts.filter(post => 
    post.postedBy?.username.toLowerCase().includes(searchValue.toLowerCase())
  );

  // Sắp xếp bài viết theo ngày đăng gần nhất
  const recentPosts = [...posts]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3); // Lấy 3 bài viết gần nhất

  // Lọc các bài viết gần đây theo username tìm kiếm
  const filteredRecentPosts = recentPosts.filter(post => 
    post.postedBy?.username.toLowerCase().includes(searchValue.toLowerCase())
  );

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="max-w-full overflow-x-hidden relative bg-white px-[15px]">
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar />
      </div>
      <div className="max-w-[1440px] mx-auto">
        <Header />
        <div className="mt-6">
          <Search value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
        </div>
        {/* Blog gần đây */}
        <div className="w-full flex flex-col justify-start items-center gap-2 mb-4">
          <div className="w-full text-left text-[#1a1a1a] text-xl md:text-2xl font-semibold font-['Inter'] leading-loose mt-6 px-[15px] mb-3">
            Bài blog gần đây
          </div>
          <div className="w-[98%] max-w-[1500px] mx-auto px-[15px] flex flex-col lg:flex-row justify-between items-center gap-4">
            {filteredRecentPosts.map((post) => (
              <div key={post._id} className="BlogPostCard w-full lg:w-[30%] flex-col justify-start items-start gap-4 flex h-[360px]">
                <div className="w-full">
                  <a href={`blog/${post._id}`} className="block hover:scale-105 transition-transform">
                    <img
                      className="Image h-[240px] w-full object-cover rounded-lg"
                      src={`http://localhost:8800/v1/img/${post.image}`}
                      alt={post.title}
                    />
                  </a>
                </div>
                <div className="w-full mx-0 flex flex-col justify-between items-start">
                  <div className="HeadingAndText flex flex-col justify-start items-start gap-3">
                    <div className="List flex items-start gap-5 mb-2">
                      <div className="Item flex items-center gap-2">
                        <div className="text-[#646464] text-sm font-medium font-['Rajdhani'] leading-tight">
                          {post.postedBy?.username}
                        </div>
                      </div>
                      <div className="Item flex items-center gap-2">
                        <div className="text-[#646464] text-sm font-medium font-['Rajdhani'] leading-tight">
                          {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                        </div>
                      </div>
                    </div>
                    <div className="text-[#1a1a1a] text-xl font-semibold font-['Inter'] leading-loose">
                      {post.title}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* tất cả các bài blog */}
        <div className="w-full flex flex-col justify-start items-center gap-2 mt-10">
          <div className="w-full text-left text-[#1a1a1a] text-xl md:text-2xl font-semibold font-['Inter'] leading-loose mt-10 px-[15px]">
            Tất cả bài viết
          </div>
          <div className="w-[98%] max-w-[1500px] mx-auto px-[15px] grid grid-cols-1 md:grid-cols-3 gap-16">
            {filteredPosts.map(post => (
              <div key={post._id} className="BlogPostCard flex-col justify-start items-start gap-4 flex h-[360px] w-full ">
                <div className="w-[98%]">
                  <a href={`blog/${post._id}`} className="block hover:scale-105 transition-transform">
                    <img
                      className="Image h-[240px] w-full object-cover rounded-lg"
                      src={`http://localhost:8800/v1/img/${post.image}`}
                      alt={post.title}
                    />
                  </a>
                </div>
                <div className="w-full mx-0 flex flex-col justify-between items-start">
                  <div className="HeadingAndText flex flex-col justify-start items-start gap-3">
                    <div className="List flex items-start gap-5 mb-2">
                      <div className="Item flex items-center gap-2">
                        <div className="text-[#646464] text-sm font-medium font-['Rajdhani'] leading-tight">
                          {post.postedBy?.username}
                        </div>
                      </div>
                      <div className="Item flex items-center gap-2">
                        <div className="text-[#646464] text-sm font-medium font-['Rajdhani'] leading-tight">
                          {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                        </div>
                      </div>
                    </div>
                    <div className="text-[#1a1a1a] text-xl font-semibold font-['Inter'] leading-loose">
                      {post.title}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Blog;
