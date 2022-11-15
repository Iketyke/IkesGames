const { selectComments } = require("../models/commentsModel")

exports.getComments = (req, res, next) => {
    selectComments(req.params.review_id).then(comments => {
        res.status(200).send(comments);
    }).catch(err => next(err));
} 