import Favorite from "../model/favoriteModel.js";
import History from "../model/historyModel.js";
import Cultural from "../model/culturalModel.js";
import Local from "../model/localModel.js";
import User from "../model/userModel.js";

const FavoriteController = {
  // Get
  getFavorites: async (req, res) => {
    try {
      const { userId } = req.query;
      // Kiểm tra xem userId có hợp lệ không
      if (!userId) {
        return res.status(400).json({ message: "Thiếu userId." });
      }

      // Kiểm tra xem người dùng có tồn tại trong cơ sở dữ liệu không
      const user = await User.findById(userId);
      if (!user) {
        return res.status(400).json({ message: "Người dùng không hợp lệ." });
      }

      // Tìm danh sách yêu thích của người dùng
      const favorites = await Favorite.findOne({ user: userId })
        .populate({
          path: "culturals",
          populate: { path: "region", model: "Region" },
        })
        .populate({
          path: "histories",
          populate: { path: "region", model: "Region" },
        })
        .populate({
          path: "locals",
          populate: { path: "region", model: "Region" },
        });

      if (!favorites) {
        return res.status(200).json({
          success: true,
          favorites: [],
          message: "Danh sách yêu thích hiện đang trống.",
        });
      }

      // Trả về danh sách yêu thích
      const populatedFavorites = {
        culturals: favorites.culturals || [],
        histories: favorites.histories || [],
        locals: favorites.locals || [],
      };

      res.status(200).json({
        message: "Danh sách yêu thích.",
        data: populatedFavorites,
      });
    } catch (error) {
      res.status(500).json({ message: "Lỗi hệ thống", error: error.message });
    }
  },
  // ADD
  addFavorite: async (req, res) => {
    try {
      const { userId, type, itemId } = req.body;
      const validTypes = ["cultural", "history", "local"];

      // Kiểm tra xem userId có tồn tại không
      if (!userId) {
        return res.status(400).json({ message: "Thiếu userId." });
      }

      // Kiểm tra người dùng có tồn tại trong cơ sở dữ liệu không
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "Người dùng không hợp lệ." });
      }

      // Kiểm tra loại (cultural, history, local)
      if (!validTypes.includes(type)) {
        return res
          .status(400)
          .json({
            message:
              "Loại không hợp lệ. Vui lòng chọn loại: 'cultural', 'history' hoặc 'local'.",
          });
      }

      // Kiểm tra xem mục có tồn tại trong cơ sở dữ liệu không
      let item;
      if (type === "history") {
        item = await History.findById(itemId);
      } else if (type === "cultural") {
        item = await Cultural.findById(itemId);
      } else if (type === "local") {
        item = await Local.findById(itemId);
      }

      if (!item) {
        return res
          .status(404)
          .json({ message: "Không có bài viết!" });
      }

      // Tìm hoặc tạo mới danh sách yêu thích cho người dùng
      let favorite = await Favorite.findOne({ user: userId });
      if (!favorite) {
        // Nếu chưa có danh sách yêu thích, tạo mới
        favorite = new Favorite({
          user: userId,
          [`${type}s`]: [itemId],
        });
      } else {
        // Đảm bảo trường tương ứng là mảng nếu chưa có
        if (!favorite[`${type}s`]) {
          favorite[`${type}s`] = [];
        }

        // Kiểm tra xem mục đã có trong danh sách yêu thích chưa
        if (favorite[`${type}s`].includes(itemId)) {
          return res
            .status(400)
            .json({ message: `Bài viết đã tồn tại trong danh sách yêu thích.` });
        }

        // Thêm mục vào danh sách yêu thích trực tiếp
        if (type === "history") {
          favorite.histories.push(itemId);
        } else if (type === "cultural") {
          favorite.culturals.push(itemId);
        } else if (type === "local") {
          favorite.locals.push(itemId);
        }
      }

      // Lưu lại danh sách yêu thích sau khi đã thay đổi
      await favorite.save();
      res
        .status(200)
        .json({ message: "Đã thêm vào danh sách yêu thích.", favorite });
    } catch (error) {
      console.error(error); // Ghi log lỗi để dễ dàng gỡ lỗi
      res.status(500).json({ message: "Lỗi hệ thống", error: error.message });
    }
  },
  // Delete
  removeFavorite: async (req, res) => {
    try {
      const { userId, type, itemId } = req.body;
      const validTypes = ["cultural", "history", "local"];

      // Kiểm tra xem userId có tồn tại không
      if (!userId) {
        return res.status(400).json({ message: "Thiếu userId." });
      }

      // Kiểm tra người dùng có tồn tại trong cơ sở dữ liệu không
      const user = await User.findById(userId);
      if (!user) {
        return res.status(400).json({ message: "Người dùng không hợp lệ." });
      }

      // Kiểm tra loại (cultural, history, local)
      if (!validTypes.includes(type)) {
        return res.status(400).json({ message: "Loại không hợp lệ." });
      }

      // Tìm danh sách yêu thích của người dùng
      let favorite = await Favorite.findOne({ user: userId });

      if (!favorite) {
        return res
          .status(404)
          .json({ message: "Danh sách yêu thích không tồn tại." });
      }

      // Kiểm tra nếu mục có trong danh sách yêu thích và xóa nó
      const typeKey = `${type}s`; // Ví dụ: "culturals"
      const itemIndex = favorite[typeKey].indexOf(itemId);

      if (itemIndex === -1) {
        return res
          .status(404)
          .json({ message: "Mục không có trong danh sách yêu thích." });
      }

      // Xóa mục khỏi danh sách
      favorite[typeKey].splice(itemIndex, 1);

      // Lưu lại danh sách yêu thích sau khi đã thay đổi
      await favorite.save();

      res
        .status(200)
        .json({ message: "Đã xóa khỏi danh sách yêu thích.", favorite });
    } catch (error) {
      res.status(500).json({ message: "Lỗi hệ thống", error: error.message });
    }
  },
};

export default FavoriteController;
