import { v2 as cloudinary } from "cloudinary";
import songModel from "../models/song.model.js";
import { uploadOnCloudinary } from "../config/cloudinary.js";

const addSong = async (req, res) => {
    try {
        const name = req.body.name;
        const desc = req.body.desc;
        const album = req.body.album;
        // const audioFile = req.files.audio[0];
        const audioFile = req.files?.audio[0]?.path
        const imageFile = req.files?.image[0]?.path
        console.log("imageFile for song",imageFile);
        
        // const imageFile = req.files.image[0];
        const audioUpload = await uploadOnCloudinary(audioFile)
        const imageUpload = await uploadOnCloudinary(imageFile)
        console.log("name",name,"desc", desc, "album",album, "audioUpload",audioUpload, "imageUpload",imageUpload);
        const duration = `${Math.floor(audioUpload.duration / 60)}: ${Math.floor(audioUpload.duration % 60)}` // get duration in miniutes then secends
        const songData = { // this is same to the model created so this will fill in the table of mongooes perfectly
            name,
            desc,
            album,
            image:imageUpload.secure_url,
            file: audioUpload.secure_url,
            duration
        }
        const song = songModel(songData) // the songData will go to songModel and the response will be stored in song
        await song.save(); // then with the save method the data in song will be saved in database
        res.json({success: true, message: "Song added successfully"})//we will get a json response for conformation of upload in mongodb

    } catch (err) {
        res.json({success:false})
        console.log(err);
    }
}

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