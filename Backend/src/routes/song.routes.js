import { addSong, listSong, removeSong } from "../controllers/song.controller.js";
import express from 'express'
import upload from "../middleware/multer.middleware.js";

const songRouter = express.Router();

songRouter.post('/add',upload.fields([
    {name:'image',maxCount:1},
    {name:"audio",maxCount:1},
]),addSong);
songRouter.get('/list',listSong);
songRouter.post('/remove',removeSong);
// songRouter.get('/test',testingMySkillsInRoutes)/

export default songRouter;