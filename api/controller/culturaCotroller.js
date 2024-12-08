import Cultura from "../model/culturalModel.js";
import User from "../model/userModel.js";

const culturalController = {
  //get
  getAllCultural: async (req, res, next) => {
    try {
      const culutural = await Cultura.find().populate("region");
      res.status(200).json(culutural);
    } catch (err) {
      next(err);
    }
  },
  //add
  addCultura: async (req, res, next) => {
    const newCultura = new Cultura(req.body);
    try {
      const saveCultura = await newCultura.save();
      res.status(200).json(saveCultura);
    } catch (err) {
      next(err);
    }
  },
  //delete
  deleteCultura: async (req, res, next) => {
    try {
      await Cultura.findByIdAndDelete(req.params.id);
      res.status(200).json("Xóa thành công!");
    } catch (err) {
      next(err);
    }
  },
  //update
  updateCultura: async (req, res, next) => {
    try {
      const updatedCultura = await Cultura.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      res.status(200).json(updatedCultura);
    } catch (err) {
      next(err);
    }
  },
  //count
  countCultural: async (req, res, next) => {
    try {
      const count = await Cultura.countDocuments();
      res.status(200).json({ totalRecords: count });
    } catch (err) {
      next(err);
    }
  },
  //get theo id
  getCulturalById: async (req, res, next) => {
    try {
      const cultural = await Cultura.findById(req.params.id).populate("region");
      if (!cultural) {
        return res.status(404).json({ message: "Không có dữ liệu!" });
      }
      res.status(200).json(cultural);
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
      const cultural = await Cultura.findById(req.params.id);
      if (!cultural) {
        return res.status(404).json({ message: "Bài viết không tồn tại!" });
      }
      // Người dùng chỉ được đánh giá 1 lần
      const alreadyReviewed = cultural.reviews.find(
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

      cultural.reviews.push(review);

      // Cập nhật số lượng đánh giá và điểm trung bình
      cultural.numReviews = cultural.reviews.length;
      cultural.rating =
        cultural.reviews.reduce((acc, item) => item.rating + acc, 0) /
        cultural.reviews.length;

      await cultural.save();

      res.status(201).json({ message: "Thêm bình luận thành công!" });
    } catch (error) {
      console.error("Error creating review:", error.message);
      res.status(500).json({ message: "Lỗi server" });
    }
  },
  //get all review
  getReviewsById: async (req, res, next) => {
    try {
      const culturalId = req.params.id;

      const cultural = await Cultura.findById(culturalId);

      if (!cultural) {
        return res.status(404).json({ message: "Bài viết không tồn tại!" });
      }

      const reviews = cultural.reviews.map((review) => ({
        ...review._doc,
        title: cultural.title,
      }));

      res.status(200).json(reviews);
    } catch (err) {
      console.error("Lỗi:", err);
      next(err);
    }
  },
};
export default culturalController;
