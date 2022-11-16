const { selectComments, insertComment } = require("../models/commentsModel")

exports.getComments = (req, res, next) => {
    selectComments(req.params.review_id).then(comments => {
        res.status(200).send(comments);
    }).catch(err => next(err));
} 

exports.postComment = (req, res, next) => {
    insertComment(req.params.review_id, req.body).then(comment => {
        res.status(201).send({comment});
    }).catch(err => next(err));
}