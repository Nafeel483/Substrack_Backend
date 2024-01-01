const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
    },
    fullName: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Pending", "Active"],
      default: "Pending",
    },
    otp: {
      type: String,
      // unique: true
    },
    profileImage: {
      type: String,
    },
    gender: {
      type: String,
      enum: ["Female", "Male", "Other"],
      default: "Female",
    },
    planet: {
      type: String,
      enum: ["Earth", "Mars"],
      default: "Earth",
    },
    country: {
      type: String,
    },
    postalCode: {
      type: String,
    },
    savedPosts: {
      type: Array,
    },
    friendRequests: {
      type: Array,
    },
    sentRequests: {
      type: Array,
    },
    friends: {
      type: Array,
    },
    forgetPasswordCode: {
      type: String,
    },
    dob: {
      type: String,
    },
    language: {
      type: String,
    },
    headline: {
      type: String,
    },
    domain: {
      type: String,
    },
    relation: {
      type: String,
    },
    orientation: {
      type: String,
    },
    herefor: {
      type: String,
      enum: ["Friends", "Dating", "Notworking", "Business"],
      default: "Friends",
    },
    education: {
      type: String,
    },
    schoolName: {
      type: String,
    },
    fieldName: {
      type: String,
    },
    ethnicity: {
      type: String,
    },
    peopleYouAdmire: {
      type: String,
    },
    favBandsGroups: {
      type: String,
    },
    favBooks: {
      type: String,
    },
    favShows: {
      type: String,
    },
    favMovies: {
      type: String,
    },
    bodyType: {
      type: String,
    },
    hairColor: {
      type: String,
    },
    hairLength: {
      type: String,
    },
    hairType: {
      type: String,
    },
    eyeColor: {
      type: String,
    },
    faceHair: {
      type: String,
    },
    bodyTattoos: {
      type: String,
    },
    faceTats: {
      type: String,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
