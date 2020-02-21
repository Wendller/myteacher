const { age, graduation, date, schoolLevel } = require("../../lib/utils");
const Teacher = require("../models/Teacher");

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

    Teacher.paginate(params, function(teachers) {
      const pagination = {
        total: Math.ceil(teachers[0].total / limit),
        page
      }

      return res.render("teachers/index", { teachers, pagination, filter })
    });

    
  },
  create(req, res) {
    return res.render("teachers/create")
  },
  post(req, res) {
    const keys = Object.keys(req.body);

    // Verificando o conteudo
    for (key of keys) {
      if (req.body.key == "") {
        return res.send("Preencha todos os dados!")
      }
    }

    Teacher.create(req.body, function(teacher) {
      return res.redirect(`/teachers/${teacher.id}`)
    });
  },
  show(req,res) {
    Teacher.find(req.params.id, function(teacher) {
      if (!teacher) return res.send("Professor não encontrado!")

      teacher.birth = age(teacher.birth),
      teacher.schooling = graduation(teacher.schooling)
      teacher.created_at = date(teacher.created_at).format
      teacher.subjects = teacher.subjects.split(",")

      return res.render("teachers/show", { teacher })
    });
  },
  edit(req, res) {
    Teacher.find(req.params.id, function(teacher) {
      if (!teacher) return res.send("Professor não encontrado!")

      teacher.birth = date(teacher.birth).iso;
      teacher.schooling = graduation(teacher.schooling);

      return res.render("teachers/edit", { teacher })
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

    Teacher.update(req.body, function() {
      return res.redirect(`/teachers/${req.body.id}`)
    });
  },
  delete(req, res) {
    Teacher.delete(req.body.id, function() {
      return res.redirect(`/teachers`)
    });
  }

}
