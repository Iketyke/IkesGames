const db = require("../db/connection.js");

exports.selectReviews = (category, sort_by = "created_at", order = "DESC") => {
  const validSorts = [
    "review_id",
    "title",
    "comment_count",
    "designer",
    "review_img_url",
    "votes",
    "category",
    "owner",
    "created_at",
  ];
  const validOrders = ["ASC", "asc", "desc", "DESC"];
  return db
    .query("SELECT * FROM categories WHERE slug = $1", [category])
    .then((catExists) => {
      if (catExists.rows.length > 0 || !category) {
        if (validSorts.includes(sort_by) && validOrders.includes(order)) {
          const reviewQuery = {
            text: "SELECT reviews.owner, reviews.title, reviews.review_id, reviews.category, reviews.review_img_url, reviews.created_at, reviews.votes, reviews.designer, COUNT(comments) AS comment_count from reviews LEFT JOIN comments ON reviews.review_id = comments.review_id",
            values: [],
          };
          if (category) {
            reviewQuery.text +=
              " WHERE reviews.category = (SELECT slug from categories WHERE slug = $1)";
            reviewQuery.values.push(category);
          }
          reviewQuery.text += ` GROUP BY reviews.review_id ORDER BY ${
            sort_by + " " + order
          };`;
          return db.query(reviewQuery).then((res) => res.rows);
        }
      }
      return Promise.reject({ status: 400, msg: "Bad Request" });
    });
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
