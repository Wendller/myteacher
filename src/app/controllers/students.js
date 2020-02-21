
const { age, graduation, date, schoolLevel } = require("../../lib/utils");
const Student = require("../models/Student");

module.exports = {

  index(req, res) {
    let { filter, page, limit } = req.query;

    page = page || 1;
    limit = limit || 3;
    let offset = limit * (page - 1);

    const params = {
      filter,
      page,
      limit,
      offset
    }

    Student.paginate(params, function(students) {
      const pagination = {
        total: Math.ceil(students[0].total / limit),
        page
      }

      for(student of students) {
        student.school_year = schoolLevel(student.school_year)
      }

      return res.render("students/index", { students, pagination, filter })
    });

  },
  create(req, res) {

    Student.teachersSelectOptions(function(options) {
      return res.render("students/create", { teacherOption: options })
    });
  },
  post(req, res) {
    const keys = Object.keys(req.body);

    // Verificando o conteudo
    for (key of keys) {
      if (req.body.key == "") {
        return res.send("Preencha todos os dados!")
      }
    }

    Student.create(req.body, function(student) {
      return res.redirect(`/students/${student.id}`)
    });
  },
  show(req,res) {
    Student.find(req.params.id, function(student) {
      if (!student) return res.send("Professor não encontrado!")

      student.birth = age(student.birth),
      student.school_year = schoolLevel(student.school_year)

      return res.render("students/show", { student })
    });
  },
  edit(req, res) {
    Student.find(req.params.id, function(student) {
      if (!student) return res.send("Professor não encontrado!")

      student.birth = date(student.birth).iso;

      Student.teachersSelectOptions(function(options) {
        return res.render("students/edit", { student, teacherOption: options })
      });

    });
  },
  put(req, res) {
    const keys = Object.keys(req.body);

    // Verificando o conteudo
    for (key of keys) {
      if (req.body.key == "") {
        return res.send("Preencha todos os dados!")
      }
    }

    Student.update(req.body, function() {
      return res.redirect(`/students/${req.body.id}`)
    });
  },
  delete(req, res) {
    Student.delete(req.body.id, function() {
      return res.redirect(`/students`)
    });
  }

}




