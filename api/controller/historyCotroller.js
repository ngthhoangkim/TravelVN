import History from "../model/historyModel.js";
import User from "../model/userModel.js";

const HistorylController = {
  //get
  getAllHistoryl: async (req, res, next) => {
    try {
      const history = await History.find().populate("region");
      res.status(200).json(history);
    } catch (err) {
      next(err);
    }
  },
  //add
  addHistory: async (req, res, next) => {
    const newHistory = new History(req.body);
    try {
      const saveHistory = await newHistory.save();
      res.status(200).json(saveHistory);
    } catch (err) {
      next(err);
    }
  },
  //delete
  deleteHistory: async (req, res, next) => {
    try {
      await History.findByIdAndDelete(req.params.id);
      res.status(200).json("Xóa thành công!");
    } catch (err) {
      next(err);
    }
  },
  //update
  updateHistory: async (req, res, next) => {
    try {
      const updatedHistory = await History.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      res.status(200).json(updatedHistory);
    } catch (err) {
      next(err);
    }
  },
  //count
  countHistory: async (req, res, next) => {
    try {
      const count = await History.countDocuments();
      res.status(200).json({ totalRecords: count });
    } catch (err) {
      next(err);
    }
  },
  //get theo id
  getHistoryById: async (req, res, next) => {
    try {
      const history = await History.findById(req.params.id).populate("region");
      if (!history) {
        return res.status(404).json({ message: "Không có dữ liệu!" });
      }
      res.status(200).json(history);
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
      const history = await History.findById(req.params.id);
      if (!history) {
        return res.status(404).json({ message: "Bài viết không tồn tại!" });
      }
      // Người dùng chỉ được đánh giá 1 lần
      const alreadyReviewed = history.reviews.find(
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

      history.reviews.push(review);

      // Cập nhật số lượng đánh giá và điểm trung bình
      history.numReviews = history.reviews.length;
      history.rating =
        history.reviews.reduce((acc, item) => item.rating + acc, 0) /
        history.reviews.length;

      await history.save();

      res.status(201).json({ message: "Thêm bình luận thành công!" });
    } catch (error) {
      console.error("Error creating review:", error.message);
      res.status(500).json({ message: "Lỗi server" });
    }
  },
  //get all review
  getReviewsById: async (req, res, next) => {
    try {
      const historyId = req.params.id;

      const history = await History.findById(historyId);

      if (!history) {
        return res.status(404).json({ message: "Bài viết không tồn tại!" });
      }

      const reviews = history.reviews.map((review) => ({
        ...review._doc,
        title: history.title,
      }));

      res.status(200).json(reviews);
    } catch (err) {
      console.error("Lỗi:", err);
      next(err);
    }
  },
};
export default HistorylController;
