const Room = require('../models/Rooms');

// Requiring ObjectId from mongoose npm package
const ObjectId = require('mongoose').Types.ObjectId;

// Validator function
// function isValidObjectId(id) {

//     if (ObjectId.isValid(id)) {
//         if ((String)(new ObjectId(id)) === id)
//             return true;
//         return false;
//     }
//     return false;
// }

exports.getRoom = async (req, res) => {
    try {
        const { roomId } = req.query;
        const room = await Room.find({
            roomId : roomId
        });
        console.log("rooms",room)
    } catch (error) {
        return res.status(400).json({
            status: false,
            message: error,
        });
    }
}