import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import songRouter from './src/routes/song.routes.js';
import conntectDb from './src/config/mongodb.js';
import albumRoutes from './src/routes/album.routes.js';
// import connectCloudinary from './src/config/cloudinary.js';

// app config
const app = express();
const port = process.env.PORT || 4000;
conntectDb();
// connectCloudinary();


// middlewares
app.use(express.json()); // when we will get any request it will be passing through here 
app.use(cors()) // connect frontend and backend even if both are in different port 


// initializing routes
app.use('/api/song',songRouter)
app.use('/api/album',albumRoutes)
app.get('/', (req, res) => {res.send("Api working")})

app.listen(port, () => {console.log(`server running on port: ${port}`);
})