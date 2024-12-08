import User from "../model/userModel.js";
import bcrypt from "bcrypt";
import { createError } from "../utils/error.js";
import jwt from "jsonwebtoken";
let refreshTokenArr = [];

const userController = {
  // Thêm người dùng
  addUser: async (req, res) => {
    try {
      // kiểm tra tài khoản
      const existingUser = await User.findOne({ username: req.body.username });
      if (existingUser) {
        return res.status(400).json({ message: "Tên đã tồn tại!" });
      }

      // Hash
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);

      //tạo tài khoản
      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
        isAdmin: false,
      });

      const savedUser = await newUser.save();
      res
        .status(200)
        .json({ message: "Tạo tài khoản thành công!", user: savedUser });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Có lỗi xảy ra. Vui lòng thử lại.", error: err });
    }
  },
  //face
  facebookCallback: async (req, res) => {
    try {
      // Tạo token cho người dùng với đầy đủ thông tin
      const token = jwt.sign(
        {
          _id: req.user._id,
          isAdmin: req.user.isAdmin,
          username: req.user.username,
          email: req.user.email,
          photos: req.user.photos || [],
          createdAt: req.user.createdAt,
          updatedAt: req.user.updatedAt,
          __v: req.user.__v,
        },
        process.env.JWT,
        { expiresIn: "1h" }
      );

      // Chuyển hướng về frontend với token
      res.redirect(`http://localhost:3000/signin?token=${token}`);
    } catch (error) {
      res.redirect("http://localhost:3000/signin?error=authentication_failed");
    }
  },
  //gg
  googleCallback: async (req, res) => {
    try {
      // Tạo token cho người dùng
      const token = jwt.sign(
        {
          _id: req.user._id,
          isAdmin: req.user.isAdmin,
          username: req.user.username,
          email: req.user.email,
          photos: req.user.photos || [],
          createdAt: req.user.createdAt,
          updatedAt: req.user.updatedAt,
          __v: req.user.__v,
        },
        process.env.JWT,
        { expiresIn: "1h" }
      );

      // Chuyển hướng về frontend với token
      res.redirect(`http://localhost:3000/signin?token=${token}`);
    } catch (error) {
      res.redirect("http://localhost:3000/signin?error=authentication_failed");
    }
  },
  // Đăng nhập bằng username
  loginUser: async (req, res, next) => {
    try {
      const user = await User.findOne({ username: req.body.username });
      if (!user) return next(createError(404, "Không có tài khoản"));

      const isPasswordCorrect = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!isPasswordCorrect)
        return next(createError(400, "Sai mật khẩu hoặc email!"));

      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT,
        { expiresIn: "1h" }
      );

      const { password, isAdmin, ...otherDetails } = user._doc;
      res
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .status(200)
        .json({ details: { ...otherDetails }, isAdmin, token });
    } catch (err) {
      next(err);
    }
  },
  // Lấy tất cả người dùng
  getAllUsers: async (req, res, next) => {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (err) {
      return next(
        createError(500, "Có lỗi xảy ra khi lấy thông tin người dùng")
      );
    }
  },
  // Lấy thông tin người dùng theo ID
  getIdUser: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Đăng xuất
  logoutUser: async (req, res) => {
    try {
      res.clearCookie("refreshToken");
      refreshTokenArr = refreshTokenArr.filter(
        (token) => token !== req.cookies.refreshToken
      );
      res.status(200).json({ message: "Đăng xuất thành công" });
    } catch (err) {
      console.error("Lỗi trong hàm logoutUser:", err);
      res
        .status(500)
        .json({ message: "Lỗi máy chủ nội bộ", error: err.message });
    }
  },
  //check trùng
  checkUsernameExists: async (req, res) => {
    try {
      const username = req.query.username;
      const user = await User.findOne({ username });
      res.status(200).json({ exists: !!user });
    } catch (err) {
      res.status(500).json({ message: "Có lỗi xảy ra", error: err.message });
    }
  },
  //check trùng email
  checkEmailExists: async (req, res) => {
    try {
      const email = req.query.email;
      //định dạng email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        return res.status(400).json({ message: "Email không hợp lệ!" });
      }
      const user = await User.findOne({ email });
      res.status(200).json({ exists: !!user });
    } catch (err) {
      res.status(500).json({ message: "Có lỗi xảy ra", error: err.message });
    }
  },
  //update người dùng
  updateUser: async (req, res) => {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      res.status(200).json(updatedUser);
    } catch (err) {
      next(err);
    }
  },
  // Xóa người dùng
  deleteUser: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user)
        return res.status(404).json({ message: "Người dùng không tồn tại" });

      await user.deleteOne();
      res.status(200).json({ message: "Xóa người dùng thành công!" });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  //count
  countUser: async (req, res, next) => {
    try {
      const count = await User.countDocuments();
      res.status(200).json({ totalRecords: count });
    } catch (err) {
      next(err);
    }
  },
  //forgot pass
  forgotPassword: async (req, res) => {
    try {
      const { email } = req.query;

      // Sử dụng checkEmail để kiểm tra email
      const user = await User.findOne({ email });
      if (!user) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy email trong hệ thống!" });
      }

      // Tạo mã khôi phục
      const resetCode = Math.floor(100000 + Math.random() * 900000);
      console.log(`Mã khôi phục của người dùng ${email}: ${resetCode}`);

      // Giả sử bạn có trường resetCode trong model User
      user.resetCode = resetCode;
      await user.save();

      res.status(200).json({ message: "Mã khôi phục đã được gửi qua email!" });
    } catch (err) {
      res.status(500).json({ message: "Có lỗi xảy ra", error: err.message });
    }
  },
};

export default userController;
