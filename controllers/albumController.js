const Post = require("../models/Post");
const User = require("../models/User");
const Album = require("../models/Albums");
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

exports.createAlbum = async (req, res) => {
  try {
    // console.log("albId is:", req.body);
    const { userId, albumName } = req.body;
    let errors = [];

    // if (!postDescription) {
    //     errors.push('postDescription is requied');
    // }
    if (!userId) {
      errors.push("user of post is requied");
    }
    if (!albumName) {
      errors.push("post title is requied");
    }
    // if (!postType) {
    //     errors.push('post type is requied');
    // }
    // if (!nsfw) {
    //     errors.push('nsfw is requied');
    // }
    // if (!postAudienceType) {
    //     errors.push('post audienceType is requied');
    // }

    if (errors.length > 0) {
      errors = errors.join(",");
      return res.json({
        message: `These are required fields: ${errors}.`,
        status: false,
      });
    }

    const user = await User.findById(userId);
    if (user) {
      let album = await new Album(req.body);

      await album.save();
      return res.status(200).json({
        status: "Your album is created",
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

exports.getAlbum = async (req, res) => {
  try {
    const { albumId } = req.query;
    const album = await Album.findById(albumId);
    const user = await User.findById(album?.userId);
    if (user) {
      // const { password, ...userRest } = user;
      user.password = undefined;
      return res.status(200).json({
        status: true,
        message: "album data",
        data: {
          albumData: album,
          userData: user,
        },
      });
    } else {
      return res.status(200).json({
        status: true,
        message: "album is not found",
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

exports.getAllAllbums = async (req, res) => {
  try {
    const album = await Album.find({});
    let user;
    let postWithUser = [];
    if (album) {
      for (let index = 0; index < album.length; index++) {
        const element = album[index];

        const idCheck = await isValidObjectId(element?.userId);
        if (idCheck) {
          user = await User.findById(element?.userId);
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
      message: "album data",
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

exports.getAlbumOfUser = async (req, res) => {
  try {
    const { userId } = req.query;
    const album = await Album.find({ userId: userId });
    let allPosts = [];
    // console.log("getAllbumOfUser", album);
    //    await post?.map(async(pd)=>{
    for (let index = 0; index < album.length; index++) {
      const pd = album[index];
      const postUser = await User.find({ _id: pd.userId });
      allPosts.push({ album: pd, user: postUser });
    }
    return res.status(200).json({
      status: true,
      message: "Post data",
      data: allPosts,
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

exports.addPicturesToAlbum = async (req, res) => {
  try {
    const { albumId, photo } = req.body;
    let objC = [];
    let album1 = await Album.find({ _id: albumId });
    objC = album1[0];
    // let aP = album1?.photo;
    // aP?.push(...photo);
    // Array.prototype.push.apply(album1?.photo, photo);
    // console.log("62e0d260f36a7800161cf860", album1?.photo);
    objC?.photo.push(...photo);
    // const album = await album1.updateOne({_id:})
    const al = await Album.findOneAndUpdate({ _id: albumId }, objC);
    return res.status(200).json({
      status: true,
      message: "Changes saved",
      data: objC,
    });
  } catch (error) {
    return res.status(400).json({
      status: "Fail",
      message: error,
    });
  }
};
