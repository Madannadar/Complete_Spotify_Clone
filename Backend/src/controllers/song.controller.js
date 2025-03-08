import { v2 as cloudinary } from "cloudinary";
import songModel from "../models/song.model.js";
import { uploadOnCloudinary } from "../config/cloudinary.js";

const addSong = async (req, res) => {
    try {
        const { name, desc, album, lyrics } = req.body; // Extract lyrics from request body
        const audioFile = req.files?.audio[0]?.path;
        const imageFile = req.files?.image[0]?.path;

        console.log("Received lyrics:", lyrics); // Debugging: Log the received lyrics

        const audioUpload = await uploadOnCloudinary(audioFile);
        const imageUpload = await uploadOnCloudinary(imageFile);

        const duration = `${Math.floor(audioUpload.duration / 60)}:${Math.floor(audioUpload.duration % 60)}`;

        const songData = {
            name,
            desc,
            album,
            image: imageUpload.secure_url,
            file: audioUpload.secure_url,
            duration,
            lyrics, // Include lyrics in the song data
        };

        const song = songModel(songData);
        await song.save();
        res.json({ success: true, message: "Song added successfully" });
    } catch (err) {
        res.status(401).json({ success: false });
        console.error(err);
    }
};

const listSong = async (req, res) => {
    try {
        const allSongs = await songModel.find({});
        res.json({success:true, songs: allSongs})

    } catch (error) {
        res.json({success:false});
    }
}

const removeSong = async (req, res) => {
    try {
        await songModel.findByIdAndDelete(req.body.id);
        res.json({ success:true, message:"song removed successfully"})
    } catch (error) {
        res.json({success:false});
    }
}

// const testingMySkillsInRoutes = async => {
//     console.log("testing");
// }

export {addSong, listSong, removeSong}