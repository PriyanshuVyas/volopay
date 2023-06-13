import express from 'express';
import router from './routes/routes.js';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use('/api',router);

app.get('/',(req,res)=>{
    res.send('Submitted by Priyanshu Vyas');
})

mongoose.connect(process.env.CONNECTION_URL, {useNewUrlParser:true, useUnifiedTopology:true})   
    .then(() => app.listen(PORT, ()=> { 
        console.log(`Server listening on port ${PORT}`)
    })) 
    .catch((error) => console.log(error.message)); 

