import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import pageRoutes from './routes/pageRoutes.js';

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
app.use('/api/pages', pageRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Mongo connected'))
  .catch(err => console.log(err));

app.listen(5000, () => console.log('Server started on port 5000'));
