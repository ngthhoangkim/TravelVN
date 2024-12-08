import Local from "../model/localModel.js";
import User from "../model/userModel.js";

const localController = {
  //get
  getAlllocal: async (req, res, next) => {
    try {
      const local = await Local.find().populate("region");
      res.status(200).json(local);
    } catch (err) {
      next(err);
    }
  },
  //add
  addLocal: async (req, res, next) => {
    const newLocal = new Local(req.body);
    try {
      const saveLocal = await newLocal.save();
      res.status(200).json(saveLocal);
    } catch (err) {
      next(err);
    }
  },
  //delete
  deleteLocal: async (req, res, next) => {
    try {
      await Local.findByIdAndDelete(req.params.id);
      res.status(200).json("Xóa thành công!");
    } catch (err) {
      next(err);
    }
  },
  //update
  updateLocal: async (req, res, next) => {
    try {
      const updatedLocal = await Local.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      res.status(200).json(updatedLocal);
    } catch (err) {
      next(err);
    }
  },
  //count
  countLocal: async (req, res, next) => {
    try {
      const count = await Local.countDocuments();
      res.status(200).json({ totalRecords: count });
    } catch (err) {
      next(err);
    }
  },
  //get theo id
  getLocalById: async (req, res, next) => {
    try {
      const local = await Local.findById(req.params.id).populate("region");
      if (!local) {
        return res.status(404).json({ message: "Không có dữ liệu!" });
      }
      res.status(200).json(local);
    } catch (err) {
      next(err);
    }
  },
  //tạo review
  createReview: async (req, res) => {
    try {
      const { userId, rating, comment } = req.body;

      const user = await User.findById(userId);
      console.log("data", userId, rating, comment);
      if (!user) {
        return res.status(400).json({ message: "Người dùng không tồn tại" });
      }

      // Tìm theo ID bài viết
      const local = await Local.findById(req.params.id);
      if (!local) {
        return res.status(404).json({ message: "Bài viết không tồn tại!" });
      }
      // Người dùng chỉ được đánh giá 1 lần
      const alreadyReviewed = local.reviews.find(
        (review) => review.user.toString() === userId
      );
      if (alreadyReviewed) {
        return res
          .status(400)
          .json({ message: "Bạn đã đánh giá trước đó rồi!" });
      }
      // Tạo đánh giá mới
      const review = {
        username: user.username,
        rating: Number(rating),
        comment,
        user: userId,
      };

      local.reviews.push(review);

      // Cập nhật số lượng đánh giá và điểm trung bình
      local.numReviews = local.reviews.length;
      local.rating =
        local.reviews.reduce((acc, item) => item.rating + acc, 0) /
        local.reviews.length;

      await local.save();

      res.status(200).json({ message: "Thêm bình luận thành công!" });
    } catch (error) {
      console.error("Error creating review:", error.message);
      res.status(500).json({ message: "Lỗi server" });
    }
  },
  //get all review
  getReviewsById: async (req, res, next) => {
    try {
      const localId = req.params.id;

      const local = await Local.findById(localId);

      if (!local) {
        return res.status(404).json({ message: "Bài viết không tồn tại!" });
      }

      const reviews = local.reviews.map((review) => ({
        ...review._doc,
        title: local.title,
      }));

      res.status(200).json(reviews);
    } catch (err) {
      console.error("Lỗi:", err);
      next(err);
    }
  },
};
export default localController;
