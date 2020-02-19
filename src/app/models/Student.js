const { age, graduation, date, schoolLevel } = require("../../lib/utils");
const db = require("../../config/db");

module.exports = {

  all(callback) {
    db.query('SELECT * FROM students ORDER BY name ASC', function(err, results) {
      if (err) throw `Database error! ==> ${err}`
      const newList = [];
      for (student of results.rows) {
        student = {
          ...student,
          school_year: schoolLevel(student.school_year)
        }
        newList.push(student);
      }
      callback(newList);
    });
  },
  create(data, callback) {
    const query = `
      INSERT INTO students (
        avatar_url,
        name,
        birth,
        email,
        school_year,
        week
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `
    const values = [
      data.avatar_url,
      data.name,
      date(data.birth).iso,
      data.email,
      data.school_year,
      data.week
    ]

    db.query(query, values, function(err, results) {
      if (err) throw `Database error! ==> ${err}`

      callback(results.rows[0]);
    });
  },
  find(id, callback) {
    db.query('SELECT * FROM students WHERE id = $1', [id], function(err, results) {
      if (err) throw `Database error! ==> ${err}`

      callback(results.rows[0]);
    });
  },
  update(data, callback) {
    const query = `
      UPDATE students SET
        avatar_url=($1),
        name=($2),
        birth=($3),
        email=($4),
        school_year=($5),
        week=($6)
        WHERE id = $7
    `

    const values = [
      data.avatar_url,
      data.name,
      date(data.birth).iso,
      data.email,
      data.school_year,
      data.week,
      data.id
    ]

    db.query(query, values, function(err, results) {
      if (err) throw `Database error! ==> ${err}`

      callback();
    });
  },
  delete(id, callback) {
    db.query('DELETE FROM students WHERE id = $1', [id], function(err, results) {
      if (err) throw `Database error! ==> ${err}`

      return callback();
    });
  },
  teachersSelectOptions(callback) {
    db.query(`SELECT name, id FROM teachers`, function(err, results) {
      if (err) throw `Database error! ==> ${err}`

      callback(results.rows);
    })
  }

}