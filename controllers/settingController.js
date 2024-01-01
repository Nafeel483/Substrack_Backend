const User = require('../models/User');

exports.editPost = async (req, res) => {
    try {
        const { userId } = req.query;
        const user = User.findByIdAndUpdate(userId, req.body,
            function (err, docs) {
                if (err) {
                    return res.status(400).json({
                        status: 'Fail',
                        message: err,
                    });
                }
                else {
                    return res.status(200).json({
                        status: 'Changes are saved',
                    });
                }
            });
        // let post = await new Post(req.body);

        // await post.save();
       

    } catch (error) {
        return res.status(400).json({
            status: 'Fail',
            message: error,
        });
    }
};
