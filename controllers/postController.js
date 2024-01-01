const Post = require("../models/Post");
const User = require("../models/User");
const nodemailer = require("nodemailer");

// Requiring ObjectId from mongoose npm package
const ObjectId = require("mongoose").Types.ObjectId;

// Validator function
function isValidObjectId(id) {
  if (ObjectId.isValid(id)) {
    if (String(new ObjectId(id)) === id) return true;
    return false;
  }
  return false;
}

exports.createPost = async (req, res) => {
  try {
    const {
      postDescription,
      postUser,
      postTitle,
      postType,
      nsfw,
      postAudienceType,
    } = req.body;
    let errors = [];
    if (!postUser) {
      errors.push("user of post is requied");
    }
    if (!postTitle) {
      errors.push("post title is requied");
    }
    if (errors.length > 0) {
      errors = errors.join(",");
      return res.json({
        message: `These are required fields: ${errors}.`,
        status: false,
      });
    }

    const user = await User.findById(postUser);
    if (user) {
      let post = await new Post(req.body);

      await post.save();
      return res.status(200).json({
        status: "Your post is created",
      });
    } else {
      return res.status(400).json({
        status: "Fail",
        message: "User with given id not found",
      });
    }
  } catch (error) {
    return res.status(400).json({
      status: "Fail",
      message: error,
    });
  }
};
exports.editPost = async (req, res) => {
  try {
    // let errors = [];
    // if (!postDescription) {
    //     errors.push('postDescription is requied');
    // }
    // if (!postUser) {
    //     errors.push('user of post is requied');
    // }
    // if (errors.length > 0) {
    //     errors = errors.join(',');
    //     return res.json({
    //         message: `These are required fields: ${errors}.`,
    //         status: false,
    //     });
    // }

    const { postId } = req.query;
    const post = Post.findByIdAndUpdate(postId, req.body, function (err, docs) {
      if (err) {
        console.log(err);
      } else {
        return res.status(200).json({
          status: "Changes are saved",
        });
      }
    });
    // let post = await new Post(req.body);

    // await post.save();
  } catch (error) {
    return res.status(400).json({
      status: "Fail",
      message: error,
    });
  }
};

exports.delPost = async (req, res) => {
  try {
    const { postId } = req.query;
    const post = Post.findByIdAndDelete(postId, function (err, docs) {
      if (err) {
        console.log(err);
      } else {
        return res.status(200).json({
          status: "Post is deleted",
        });
      }
    });
    // let post = await new Post(req.body);

    // await post.save();
  } catch (error) {
    return res.status(400).json({
      status: "Fail",
      message: error,
    });
  }
};

exports.getPost = async (req, res) => {
  try {
    const { postId } = req.query;
    const post = await Post.findById(postId);
    let likesDataPass = [];
    let commentsDataPass = [];
    let commentsDataIds = [];
    //    await post?.map(async(pd)=>{

    const likesData = await User.find({ _id: { $in: post.likes } });
    likesData.map(async (item) => {
      item.password = undefined;
      likesDataPass.push(item);
    });
    for (let index = 0; index < post.comments.length; index++) {
      const element = post.comments[index];
      const userL = await User.findById(element?.userId);
      const param = {
        commentId: element?._id,
        comment: element?.comment,
        user: userL,
      };
      // commentsDataPass = [...commentsDataPass,param]
      await commentsDataPass.push(param);
    }
    // const commentsData = await User.find({ _id: { $in: post.comments } })
    // commentsData.map(async (item) => {
    //     item.password = undefined;
    //     commentsDataPass.push(item);
    // })
    post.comments = commentsDataPass;
    post.likes = likesDataPass;
    const user = await User.findById(post?.postUser);
    if (user) {
      // const { password, ...userRest } = user;
      user.password = undefined;
      return res.status(200).json({
        status: true,
        message: "Post data",
        data: {
          postData: post,
          userData: user,
        },
      });
    } else {
      return res.status(200).json({
        status: true,
        message: "User Of Post is not found",
        data: docs,
      });
    }

    // let post = await new Post(req.body);

    // await post.save();
  } catch (error) {
    return res.status(400).json({
      status: false,
      message: error,
    });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const { postId } = req.query;
    const post = await Post.find({});
    let respData = [];
    let commentsData = [];
    //     postlikes?.map((item,index)=>{
    //     //    item.password = undefined
    //       respData?.push(item);
    //   });
    let user;
    const postWithUser = [];
    if (post) {
      for (let index = 0; index < post.length; index++) {
        const element = post[index];
        respData = [];
        commentsData = [];
        element.likes.map(async (item) => {
          const userData = await User.findById(item);
          await respData.push(userData);
        });
        for (let index = 0; index < element.comments.length; index++) {
          const pComment = element.comments[index];
          const userL = await User.findById(pComment?.userId);
          const param = {
            commentId: pComment?._id,
            comment: pComment?.comment,
            user: userL,
          };
          // commentsDataPass = [...commentsDataPass,param]
          await commentsData.push(param);
        }
        // const postlikes = await User.find({ _id: { $in: element.likes } });
        element.comments = commentsData;
        element.likes = respData;
        const idCheck = await isValidObjectId(element?.postUser);
        if (idCheck) {
          user = await User.findById(element?.postUser);
          user.password = undefined;
          postWithUser.push({
            postData: element,
            userData: user,
          });
        } else {
          postWithUser.push({
            postData: element,
            userData: {},
          });
        }
      }
    }
    return res.status(200).json({
      status: true,
      message: "Post data",
      data: postWithUser,
    });

    // let post = await new Post(req.body);

    // await post.save();
  } catch (error) {
    return res.status(400).json({
      status: "Fail",
      message: error,
    });
  }
};
exports.getPostByType = async (req, res) => {
  try {
    const { postType } = req.query;
    const post = await Post.find({ postType: postType });
    let likesDataPass = [];
    let commentsDataPass = [];
    let allPosts = [];
    //    await post?.map(async(pd)=>{
    for (let index = 0; index < post.length; index++) {
      const pd = post[index];

      //    }
      const likesData = await User.find({ _id: { $in: pd.likes } });
      likesData.map(async (item) => {
        item.password = undefined;
        likesDataPass.push(item);
      });
      for (let index = 0; index < pd.comments.length; index++) {
        const pComment = pd.comments[index];
        const userL = await User.findById(pComment?.userId);
        const param = {
          commentId: pComment?._id,
          comment: pComment?.comment,
          user: userL,
        };
        // commentsDataPass = [...commentsDataPass,param]
        await commentsDataPass.push(param);
      }
      const postUser = await User.find({ _id: pd.postUser });
      pd.postUser = postUser[0];
      pd.comments = commentsDataPass;
      pd.likes = likesDataPass;
      allPosts.push(pd);
    }
    return res.status(200).json({
      status: true,
      message: "Post data",
      data: {
        postData: allPosts,
      },
    });
    // let post = await new Post(req.body);

    // await post.save();
  } catch (error) {
    return res.status(400).json({
      status: "Fail",
      message: error,
    });
  }
};
exports.getPostOfUser = async (req, res) => {
  try {
    const { userId } = req.query;
    const post = await Post.find({ postUser: userId });
    let likesDataPass = [];
    let commentsDataPass = [];
    let allPosts = [];
    //    await post?.map(async(pd)=>{
    for (let index = 0; index < post.length; index++) {
      const pd = post[index];

      //    }
      const likesData = await User.find({ _id: { $in: pd.likes } });
      likesData.map(async (item) => {
        item.password = undefined;
        likesDataPass.push(item);
      });
      for (let index = 0; index < pd.comments.length; index++) {
        const pComment = pd.comments[index];
        const userL = await User.findById(pComment?.userId);
        const param = {
          commentId: pComment?._id,
          comment: pComment?.comment,
          user: userL,
        };
        // commentsDataPass = [...commentsDataPass,param]
        await commentsDataPass.push(param);
      }
      const postUser = await User.find({ _id: pd.postUser });
      pd.postUser = postUser[0];
      pd.comments = commentsDataPass;
      pd.likes = likesDataPass;
      allPosts.push(pd);
    }
    return res.status(200).json({
      status: true,
      message: "Post data",
      data: {
        postData: allPosts,
      },
    });
    // let post = await new Post(req.body);

    // await post.save();
  } catch (error) {
    return res.status(400).json({
      status: "Fail",
      message: error,
    });
  }
};
exports.getPostByAudience = async (req, res) => {
  try {
    const { type } = req.query;
    const post = await Post.find({ postAudienceType: type });
    let likesDataPass = [];
    let commentsDataPass = [];
    let allPosts = [];
    //    await post?.map(async(pd)=>{
    for (let index = 0; index < post.length; index++) {
      const pd = post[index];

      //    }
      const likesData = await User.find({ _id: { $in: pd.likes } });
      likesData.map(async (item) => {
        item.password = undefined;
        likesDataPass.push(item);
      });
      for (let index = 0; index < pd.comments.length; index++) {
        const pComment = pd.comments[index];
        const userL = await User.findById(pComment?.userId);
        const param = {
          commentId: pComment?._id,
          comment: pComment?.comment,
          user: userL,
        };
        // commentsDataPass = [...commentsDataPass,param]
        await commentsDataPass.push(param);
      }
      const postUser = await User.find({ _id: pd.postUser });
      pd.postUser = postUser[0];
      pd.comments = commentsDataPass;
      pd.likes = likesDataPass;
      allPosts.push(pd);
    }
    return res.status(200).json({
      status: true,
      message: "Post data",
      data: {
        postData: allPosts,
      },
    });
    // let post = await new Post(req.body);

    // await post.save();
  } catch (error) {
    return res.status(400).json({
      status: "Fail",
      message: error,
    });
  }
};

exports.likePost = async (req, res) => {
  try {
    const { userId, postId } = req.body;
    let errors = [];
    if (!userId) {
      errors.push("userId is requied");
    }
    if (!postId) {
      errors.push("postId of post is requied");
    }
    if (errors.length > 0) {
      errors = errors.join(",");
      return res.json({
        message: `These are required fields: ${errors}.`,
        status: false,
      });
    }
    const post = await Post.findOne({
      _id: postId,
    });
    const likes = post?.likes;
    likes.push(userId);
    const newPost = Post.findByIdAndUpdate(
      postId,
      { likes: likes },
      function (err, docs) {
        if (err) {
          console.log(err);
        } else {
          return res.status(200).json({
            status: "Changes are saved",
          });
        }
      }
    );
    // let post = await new Post(req.body);

    // await post.save();
  } catch (error) {
    return res.status(400).json({
      status: "Fail",
      message: error,
    });
  }
};

exports.unlikePost = async (req, res) => {
  try {
    const { userId, postId } = req.body;
    let errors = [];
    if (!userId) {
      errors.push("userId is requied");
    }
    if (!postId) {
      errors.push("postId of post is requied");
    }
    if (errors.length > 0) {
      errors = errors.join(",");
      return res.json({
        message: `These are required fields: ${errors}.`,
        status: false,
      });
    }
    const post = await Post.findOne({
      _id: postId,
    });
    let likes = post?.likes;
    likes = likes.filter((item) => item !== userId);
    const newPost = Post.findByIdAndUpdate(
      postId,
      { likes: likes },
      function (err, docs) {
        if (err) {
          console.log(err);
        } else {
          return res.status(200).json({
            status: "You have disliked a post",
          });
        }
      }
    );
    // let post = await new Post(req.body);

    // await post.save();
  } catch (error) {
    return res.status(400).json({
      status: "Fail",
      message: error,
    });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { userId, postId, comment } = req.body;
    let errors = [];
    if (!userId) {
      errors.push("userId is requied");
    }
    if (!postId) {
      errors.push("postId of post is requied");
    }
    if (!comment) {
      errors.push("comment of post is requied");
    }
    if (errors.length > 0) {
      errors = errors.join(",");
      return res.json({
        message: `These are required fields: ${errors}.`,
        status: false,
      });
    }
    const post = await Post.findOne({
      _id: postId,
    });
    const comments = post?.comments;
    comments.push(req.body);
    const newPost = Post.findByIdAndUpdate(
      postId,
      { comments: comments },
      function (err, docs) {
        if (err) {
          console.log(err);
        } else {
          return res.status(200).json({
            status: "your comment have added",
          });
        }
      }
    );
    // let post = await new Post(req.body);

    // await post.save();
  } catch (error) {
    return res.status(400).json({
      status: "Fail",
      message: error,
    });
  }
};

exports.removeComment = async (req, res) => {
  try {
    const { commentId, postId } = req.body;
    let errors = [];
    if (!commentId) {
      errors.push("commentId is requied");
    }
    if (!postId) {
      errors.push("postId of post is requied");
    }
    if (errors.length > 0) {
      errors = errors.join(",");
      return res.json({
        message: `These are required fields: ${errors}.`,
        status: false,
      });
    }
    const post = await Post.findOne({
      _id: postId,
    });
    let comments = post?.comments;
    comments = comments.filter((item) => item?._id != commentId);
    const newPost = Post.findByIdAndUpdate(
      postId,
      { comments: comments },
      function (err, docs) {
        if (err) {
          console.log(err);
        } else {
          return res.status(200).json({
            status: "Your comment have removed",
          });
        }
      }
    );
    // let post = await new Post(req.body);

    // await post.save();
  } catch (error) {
    return res.status(400).json({
      status: "Fail",
      message: error,
    });
  }
};

exports.reShare = async (req, res) => {
  try {
    const { userId, postId } = req.body;
    let errors = [];
    if (!userId) {
      errors.push("userId is requied");
    }
    if (!postId) {
      errors.push("postId of post is requied");
    }
    if (errors.length > 0) {
      errors = errors.join(",");
      return res.json({
        message: `These are required fields: ${errors}.`,
        status: false,
      });
    }
    const post = await Post.findOne({
      _id: postId,
    });
    const reShare = post?.reShare;
    reShare.push(userId);
    const newPost = Post.findByIdAndUpdate(
      postId,
      { reShare: reShare },
      function (err, docs) {
        if (err) {
          console.log(err);
        } else {
          return res.status(200).json({
            status: "Post have re shared",
          });
        }
      }
    );
    // let post = await new Post(req.body);

    // await post.save();
  } catch (error) {
    return res.status(400).json({
      status: "Fail",
      message: error,
    });
  }
};
