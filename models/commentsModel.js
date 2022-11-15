const db = require("../db/connection.js");

exports.selectComments = (review_id) => {
  if (/[1-9]+/.test(review_id)) {
    return db.query("SELECT * FROM reviews WHERE review_id = $1", [review_id]).then(
      (reviewres) => {
        if (reviewres.rows.length > 0) {
          const commentQuery = {
            text: "SELECT * FROM comments WHERE review_id = $1 ORDER BY created_at DESC;",
            values: [review_id],
          };
          return db.query(commentQuery).then((res) => res.rows);
        } else {
          return Promise.reject({ status: 404, msg: "Review Not Found" });
        }
      }
    );
  }
  return Promise.reject({ status: 400, msg: "Bad Request" });
};
