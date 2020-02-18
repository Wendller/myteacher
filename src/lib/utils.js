module.exports = {
  age(timestamp) {

    const birthDate = new Date(timestamp);
    const today = new Date();

    // Calculando idade
    let age = today.getFullYear() - birthDate.getFullYear();
    // Meses para o aniversario
    const month = today.getMonth() - birthDate.getMonth();

    // Verificacao do ano
    if (month < 0 || month == 0 && today.getDate() <= birthDate.getDate()) {
      age = age - 1;
    }

    return age
  },
  graduation(class_type) {
    const schooling = [
       { type: "high_school", value: "Ensino médio completo" },
       { type: "college", value: "Ensino superior" },
       { type: "master", value: "Mestrado" },
       { type: "doctor", value: "Doutorado" } 
    ];

    for (level of schooling) {
      if (level.type == class_type) return `${level.value}`
    }
  },
  schoolLevel(school_year) {
    const schooling = [
       { type: "5f", value: "5 ano Ens. Fundamental" },
       { type: "6f", value: "6 ano Ens. Fundamental" },
       { type: "7f", value: "7 ano Ens. Fundamental" },
       { type: "8f", value: "8 ano Ens. Fundamental" },
       { type: "1m", value: "1 ano Ens. Médio" },
       { type: "2m", value: "6 ano Ens. Médio" },
       { type: "3m", value: "7 ano Ens. Médio" } 
    ];

    for (level of schooling) {
      if (level.type == school_year) return `${level.value}`
    }
  },
  date(timestamp) {
    const date = new Date(timestamp);

    // yyyy
    const year = date.getUTCFullYear();

    // mm
    const month = `0${date.getUTCMonth() + 1}`.slice(-2);

    // dd
    const day = `0${date.getUTCDate()}`.slice(-2);

    // return yyyy-mm-dd
    return {
      day,
      month,
      year,
      iso: `${year}-${month}-${day}`,
      birthDay: `${day}/${month}`,
      format: `${day}/${month}/${year}`
    }
  }
}