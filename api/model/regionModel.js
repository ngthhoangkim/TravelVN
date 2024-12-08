import mongoose from "mongoose";

const regionSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    imgRegion: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Image"
    }
},
    { timestamps: true },
);

const Region = mongoose.model("Region", regionSchema);

export default Region;

