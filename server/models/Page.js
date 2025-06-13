import mongoose from 'mongoose';

const pageSchema = new mongoose.Schema({
  title: String,
  layout: Array,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Page', pageSchema);
