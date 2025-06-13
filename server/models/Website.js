import mongoose from 'mongoose';

const websiteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  components: [{
    type: {
      type: String,
      required: true
    },
    content: String,
    style: {
      type: Map,
      of: mongoose.Schema.Types.Mixed
    },
    animation: {
      type: {
        type: String,
        default: 'none'
      },
      duration: String,
      timing: String
    },
    action: {
      type: {
        type: String,
        enum: ['link', 'scroll', 'none'],
        default: 'none'
      },
      url: String,
      targetId: String
    }
  }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  publishedUrl: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
websiteSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Website = mongoose.model('Website', websiteSchema);
export default Website; 