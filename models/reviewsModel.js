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
  const reviewQuery = {
    text: "SELECT reviews.* , COUNT(comments) AS comment_count from reviews LEFT JOIN comments ON reviews.review_id = comments.review_id WHERE reviews.review_id = $1 GROUP BY reviews.review_id;",
    values: [review_id],
  };
  return db.query(reviewQuery).then((res) => {
    if (res.rows[0]) {
      return { review: res.rows[0] };
    } else {
      return Promise.reject({ status: 404, msg: "Review Not Found" });
    }
  });
};

exports.updateReview = (review_id, { inc_votes }) => {
  if (typeof inc_votes === "number") {
    const reviewQuery = {
      text: "UPDATE reviews SET votes = votes + $1 WHERE review_id = $2 RETURNING *;",
      values: [inc_votes, review_id],
    };
    return db.query(reviewQuery).then((res) => {
      if (res.rows[0]) {
        return { review: res.rows[0] };
      } else {
        return Promise.reject({ status: 404, msg: "Review Not Found" });
      }
    });
  } else return Promise.reject({ status: 400, msg: "Invalid Format" });
};
