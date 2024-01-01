const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    postTitle: {
      type: String,
    },
    postDescription: {
      type: String,
    },
    postPhotos:{
      type : Array,
    },
    postType:{
      type: String,
      enum:['Photo', 'Text'],
      default: 'Photo',
    },
    tags: {
      type: Array,
    },
    nsfw: {
      type: Boolean,
      default: false
    },
    postAudienceType: {
      type: String, 
      enum: ['Public', 'Friends', 'onlyme'],
      default: 'Public'
    },
    postUser: {
      type: String,
    },
    tagUsers: {
      type: Array,
    },
    postAudience: { 
      type: Array,
    },
    likes: {
      type: Array
    },
    comments: [
      {
        userId: {
          type: String,
          required : true,
      },
      postId: {
          type: String,
          required : true, // required informs for missing fields
      },
      comment: {
        type: String,
        required : true, // required informs for missing fields
    },
    user:{
      type:Object,
      required: false
    }
      }
    ],
    reShare: {
      type: Array
    },
  },
  { timestamps: true }
);

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
