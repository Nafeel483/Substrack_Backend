// const Room = require('../models/Rooms');
const Message = require('../models/Message');

// const ObjectId = require('mongoose').Types.ObjectId;

exports.saveMessage = async (req) => {
    try {
        // const { message, senderId, recId, roomId } = req.body;
        let newMessage = await new Message(req);
            await newMessage.save();
        // const room = await Room.find({
        //     roomId : roomId
        // });

    } catch (error) {
        // return res.status(400).json({
        //     status: false,
        //     message: error,
        // });
    }
}