const express = require('express');
const {
  createPost,
  editPost,
  delPost,
  getPost,
  getAllPosts,
  getPostByType,
  getPostOfUser,
  getPostByAudience,
  likePost,
  unlikePost,
  addComment,
  removeComment,
  reShare
} = require('../controllers/postController');

const router = express.Router({ mergeParams: true });

router.route('/createPost').post(createPost);
router.route('/editPost').post(editPost);
router.route('/delPost').delete(delPost);
router.route('/getPost').get(getPost);
router.route('/getAllPost').get(getAllPosts);
router.route('/getPostByType').get(getPostByType);
router.route('/getPostOfUser').get(getPostOfUser);
router.route('/getPostByAudience').get(getPostByAudience);
router.route('/likePost').post(likePost);
router.route('/unlikePost').post(unlikePost);
router.route('/addComment').post(addComment);
router.route('/removeComment').post(removeComment);
router.route('/reShare').post(reShare);
module.exports = router;