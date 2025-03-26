import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    time: { type: Date, required: true },  // Laiko laukas, tikrai reikalingas
    username: { type: String, required: true },
    imageUrl: { type: String, required: false },  // Galimas, bet neprivalomas
});


const Post = mongoose.model("Post", postSchema);

export default Post;
