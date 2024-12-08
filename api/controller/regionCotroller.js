import Region from '../model/regionModel.js';

const regionController = {
    //get
    getAllRegion: async (req, res, next) => {
        try {
            const region = await Region.find();
            res.status(200).json(region);
        } catch (err) {
            next(err);
        }
    },
    //add
    addRegion: async (req, res, next) => {
        const newRegion = new Region(req.body);
        try {
            const saveRegion = await newRegion.save();
            res.status(200).json(saveRegion);
        } catch (err) {
            next(err);
        }
    },
    //delete
    deleteRegion: async (req, res, next) => {
        try {
            await Region.findByIdAndDelete(req.params.id);
            res.status(200).json("Xóa thành công!");
        } catch (err) {
            next(err);
        }
    },
    //update
    updateRegion: async (req, res, next) => {
        try {
            const updatedRegion = await Region.findByIdAndUpdate(
                req.params.id,
                { $set: req.body },
                { new: true }
            );
            res.status(200).json(updatedRegion);
        } catch (err) {
            next(err);
        }
    }
}
export default regionController;