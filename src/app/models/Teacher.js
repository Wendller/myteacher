const { age, graduation, date, schoolLevel } = require("../../lib/utils");
const db = require("../../config/db");

module.exports = {

  all(callback) {
    db.query('SELECT * FROM teachers ORDER BY name ASC', function(err, results) {
      if (err) throw `Database error! ==> ${err}`
      const newList = [];
      for (teacher of results.rows) {
        teacher = {
          ...teacher,
          subjects: teacher.subjects.split(",")
        }
        newList.push(teacher);
      }
      callback(newList);
    });
  },
  create(data, callback) {
    const query = `
      INSERT INTO teachers (
        name,
        birth,
        schooling,
        class_type,
        subjects,
        created_at,
        avatar_url
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING name
    `
    const values = [
      data.name,
      date(data.birth).iso,
      data.schooling,
      data.class_type,
      data.subjects,
      date(Date.now()).iso,
      data.avatar_url
    ]

    db.query(query, values, function(err, results) {
      if (err) throw `Database error! ==> ${err}`

      callback(results.rows[0]);
    });
  },
  find(id, callback) {
    db.query('SELECT * FROM teachers WHERE id = $1', [id], function(err, results) {
      if (err) throw `Database error! ==> ${err}`

      callback(results.rows[0]);
    });
  },
  update(data, callback) {
    const query = `
      UPDATE teachers SET
        name=($1),
        birth=($2),
        schooling=($3),
        class_type=($4),
        subjects=($5),
        avatar_url=($6)
        WHERE id = $7
    `

    const values = [
      data.name,
      date(data.birth).iso,
      data.schooling,
      data.class_type,
      data.subjects,
      data.avatar_url,
      data.id
    ]

    db.query(query, values, function(err, results) {
      if (err) throw `Database error! ==> ${err}`

      callback();
    });
  },
  delete(id, callback) {
    db.query('DELETE FROM teachers WHERE id = $1', [id], function(err, results) {
      if (err) throw `Database error! ==> ${err}`

      return callback();
    });
  }

}