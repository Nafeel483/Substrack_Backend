const express = require("express");
const router = express.Router();
const users = require("./users");
// const post = require("./posts");
// const messages = require("./messages");
// const allbums = require("./album");

router.use("/user", users);
// router.use("/post", post);
// router.use("/messages", messages);
// router.use("/allbums", allbums);

module.exports = router;
