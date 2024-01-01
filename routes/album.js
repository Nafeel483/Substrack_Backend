const express = require("express");
const {
  createAlbum,
  getAlbumOfUser,
  addPicturesToAlbum,
} = require("../controllers/albumController");

const router = express.Router({ mergeParams: true });

router.route("/createAlbum").post(createAlbum);
router.route("/getAllbumOfUser").get(getAlbumOfUser);
router.route("/addPicturesToAlbum").post(addPicturesToAlbum);
module.exports = router;
