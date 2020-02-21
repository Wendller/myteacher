const { age, graduation, date, schoolLevel } = require("../../lib/utils");
const db = require("../../config/db");

module.exports = {

  all(callback) {
    db.query('SELECT teachers.*, count(students) AS total_students FROM teachers LEFT JOIN students ON (students.teacher_id = teachers.id) GROUP BY teachers.id ORDER BY total_students', function(err, results) {
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
      RETURNING id
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
  findBy(filter, callback) {
    db.query(`SELECT teachers.*, count(students) AS total_students FROM teachers LEFT JOIN students ON (students.teacher_id = teachers.id) WHERE teachers.name ILIKE '%${filter}%'  OR teachers.subjects ILIKE '%${filter}%' GROUP BY teachers.id ORDER BY total_students`, function(err, results) {
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
  },
  paginate(params, callback) {
    const { filter, limit, offset } = params;

    //? Pegando numero total de teachers
    let query = "",
        filterQuery = "",
        totalQuery = ` (
          SELECT count(*) FROM teachers
        ) AS total`

    if(filter) {
      filterQuery = `
        WHERE teachers.name ILIKE '%${filter}%'
        OR WHERE teachers.subjects ILIKE '%${filter}%'
      `
      totalQuery = `(
        SELECT count(*) FROM teachers
        ${filterQuery}
      ) AS total`
    }

    query = `
      SELECT teachers.*, ${totalQuery}, count(students) AS total_students
      FROM teachers
      LEFT JOIN students ON (teachers.id = students.teacher_id)
      ${filterQuery}
      GROUP BY teachers.id LIMIT ${limit} OFFSET ${offset}
    `

    db.query(query, function(err, results) {
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
  }

}