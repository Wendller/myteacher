// Importa o express
const express = require("express");
// Importa nunjucks
const nunjucks = require("nunjucks");
// Importa rotas
const routes= require("./routes");

const methodOverride = require("method-override");

// Cria o servidor
const server = express();


// Config do express para usar arquivos estaticos e rotas da pasta
server.use(express.urlencoded({ extended: true }))
server.use(express.static("public"));
server.use(methodOverride('_method'));
server.use(routes);
// Configurando nunjucks - seta o motor de view a ser renderizado
server.set("view engine", "njk");
// Caminho a percorrer, usando o express na variavel servers
nunjucks.configure("src/app/views", {
  express: server,
  autoescape: false,
  noCache: true
});


// Inicia servidor
server.listen(3333, function() {
  console.log("server is running");
});