import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 4,
            maxlength: 20,
        },
        rawPassword: {  // Laikome nešifruotą slaptažodį tik norint jį užšifruoti
            type: String,
            required: false,  // Šis laukas nebus būtinas profilio atnaujinimui
        },
        photoUrl: {
            type: String,
            default: "https://via.placeholder.com/150",
        },
        favorites: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Post",
            },
        ],
    },
    { timestamps: true }
);

// Vidurinė funkcija, kuri užšifruoja slaptažodį prieš išsaugant
userSchema.pre("save", async function (next) {
    if (this.isModified("rawPassword")) {
        const bcrypt = require("bcrypt");
        const hashedPassword = await bcrypt.hash(this.rawPassword, 10);
        this.password = hashedPassword;
        this.rawPassword = undefined; // Išvalome rawPassword
    }
    next();
});

const User = mongoose.model("User", userSchema);
export default User;
