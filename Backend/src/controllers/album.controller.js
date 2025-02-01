// import { v2 as cloudinary } from "cloudinary";
// import albumModel from '../models/album.model.js'

// const addAlbum = async (req, res) => {

// }

// const listAlbum = async (req, res) => {

// }

// const removeAlbum = async (req, res) => {

// }

// export {addAlbum, listAlbum, removeAlbum}

// import { v2 as cloudinary } from "cloudinary";
import albumModel from '../models/album.model.js'
import { uploadOnCloudinary } from "../config/cloudinary.js";

const addAlbum = async (req, res) => {
    try {
        const name = req.body.name;
        const desc = req.body.desc;
        const bgColour = req.body.bgColour;
        const imageFile = req.file.path;
        // const imageFile = req.files?.image[0]?.path
        console.log("name",name,"desc",desc,"bgColour",bgColour);
        console.log("imageFile for album",imageFile);
        const imageUpload = await uploadOnCloudinary(imageFile);
        // const imageUpload = await cloudinary.uploader.upload(imageFile.path,{resource_type:"image"});
        console.log("imageUpload",imageUpload);
        
        // let imageFile;
        // if(req.files && Array.isArray(req.files.image) && req.files.image.length > 0){
        //     imageFile = req.files.imageFile[0].path
        // }
        const ablumData = {
            name,
            desc,
            bgColour,
            image: imageUpload.secure_url
        }

        const album = albumModel(ablumData);
        await album.save();

        res.json({success:true, message:"Album added"})

    } catch (error) {
        res.status(400).json({success:false, message:"error while adding ablum"})
    }
}

const listAlbum = async (req, res) => {
    try {
        const allAlbums = await albumModel.find({});
        res.status(200).json({success:true, albums: allAlbums})

    } catch (error) {
        res.status(404).json({ success: false, message:"error in finding all album"})
    }
}

const removeAlbum = async (req, res) => {  // i wrote this completed on my own 
    try {
        await albumModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "album removed successfully"})
    } catch (error) {
        res.json({success: false})
    }
}

export {addAlbum, listAlbum, removeAlbum}