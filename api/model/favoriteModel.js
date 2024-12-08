import mongoose from "mongoose";
const FavoriteSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    locals: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Local",
    }],
    histories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "History"
    }],
    culturals: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cultural",
    }]
},
    {
        timestamps: true
    });

export default mongoose.model("Favorite", FavoriteSchema)