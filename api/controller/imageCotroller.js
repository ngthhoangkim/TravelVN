import multer from 'multer';
import Image from "../model/imgModel.js";

// Cấu hình multer
const storage = multer.memoryStorage();


const imageController = {
    //get
    getIMG: async (req, res, next) => {
        try {
            const image = await Image.findById(req.params.id);
            if (!image) {
                return res.status(404).json({ message: 'Không có ảnh!' });
            }

            // Đặt Content-Type dựa trên loại ảnh được lưu
            res.set('Content-Type', image.img.contentType);
            // Gửi dữ liệu ảnh nhị phân
            res.send(image.img.data);
        } catch (error) {
            res.status(500).json({ error: 'Failed to retrieve image' });
        }
    },
    //add
    addIMG: async (req, res, next) => {
        try {
            const newImage = new Image({
                name: req.body.name,
                img: {
                    data: req.file.buffer,
                    contentType: req.file.mimetype,
                },
            });
            const savedImage = await newImage.save();
            res.json(savedImage); // Trả về thông tin hình ảnh đã lưu, bao gồm ID
        } catch (error) {
            res.status(500).json({ error: 'Failed to upload image' });
        }
    },
    //delete
    deleteIMG: async (req, res, next) => {
        try {
            const image = await Image.findByIdAndDelete(req.params.id);
            if (!image) {
                return res.status(404).json({ message: 'Không có ảnh' });
            }
            res.json({ message: 'Xóa thành công' });
        } catch (error) {
            res.status(500).json({ error: 'Lỗi xóa ảnh' });
        }
    },
    //update 
    updateIMG: async (req, res, next) => {
        try {
            const { id } = req.params;
    
            // Tìm ảnh theo ID
            const image = await Image.findById(id);
            if (!image) {
                return res.status(404).json({ message: 'Không tìm thấy ảnh!' });
            }
    
            // Cập nhật thông tin ảnh
            image.name = req.body.name || image.name; // Cập nhật tên nếu có trong body
            if (req.file) {
                image.img = {
                    data: req.file.buffer,
                    contentType: req.file.mimetype,
                };
            }
    
            // Lưu ảnh đã cập nhật
            const updatedImage = await image.save();
            res.json(updatedImage); // Trả về thông tin ảnh đã cập nhật
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi cập nhật ảnh' });
        }
    }
}

export default imageController;