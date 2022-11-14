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
    )
    .then((res) => res.rows);
};

exports.selectReview = (review_id) => {
  if (/[1-9]+/.test(review_id)) {
    const reviewQuery = {
      text: "SELECT * FROM reviews WHERE review_id = $1",
      values: [review_id],
    };
    return db.query(reviewQuery).then((res) => {
      if (res.rows[0]) {
        return res.rows[0];
      } else {
        return Promise.reject({ status: 404, msg: "Review Not Found" });
      }
    });
  }

  return Promise.reject({ status: 400, msg: "Bad Request" });
};
