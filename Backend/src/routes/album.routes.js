import express from 'express'
import { addAlbum, listAlbum, removeAlbum } from '../controllers/album.controller.js'
import upload from '../middleware/multer.middleware.js'

const albumRoutes = express.Router();

albumRoutes.post('/add',upload.single('image'),addAlbum)
albumRoutes.get('/list',listAlbum)
albumRoutes.post('/remove',removeAlbum)

export default albumRoutes;