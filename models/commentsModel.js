const db = require("../db/connection.js");

exports.selectComments = (review_id) => {
  return db
    .query("SELECT * FROM reviews WHERE review_id = $1", [review_id])
    .then((reviewres) => {
      if (reviewres.rows.length > 0) {
        const commentQuery = {
          text: "SELECT * FROM comments WHERE review_id = $1 ORDER BY created_at DESC;",
          values: [review_id],
        };
        return db.query(commentQuery).then((res) => res.rows);
      } else {
        return Promise.reject({ status: 404, msg: "Review Not Found" });
      }
    });
};

exports.insertComment = (review_id, { body, username }) => {
  if (typeof body === "string" && body.length > 0) {
    const commentQuery = {
      text: "INSERT INTO comments (body, votes, author, review_id, created_at) VALUES ($1, $2, $3, $4, current_timestamp) RETURNING *;",
      values: [body, 0, username, review_id],
    };
    return db.query(commentQuery).then((res) => res.rows[0]);
  }
  else  return Promise.reject({status: 400, msg: "Invalid Format" })
};
