const db = require("../db/connection.js");

exports.selectReviews = () => {
    return db
        .query(
        `
        SELECT reviews.owner, reviews.title, reviews.review_id, reviews.category, reviews.review_img_url , reviews.created_at, reviews.votes, reviews.designer, COUNT(comments) AS comment_count from reviews
        LEFT JOIN comments ON reviews.review_id = comments.review_id
        GROUP BY reviews.review_id
        ORDER BY reviews.created_at DESC;
        `
        ).then(res => res.rows)
}