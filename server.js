const http = require("http");
const fs = require("fs");
const mysql = require("mysql2");

const conexion = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "clase_node"
});

const servidor = http.createServer((req, res) => {

  if (req.url === "/" && req.method === "GET") {
    fs.readFile("index.html", (error, contenido) => {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(contenido);
    });
  }

  else if (req.url === "/script.js" && req.method === "GET") {
    fs.readFile("script.js", (error, contenido) => {
      res.writeHead(200, { "Content-Type": "application/javascript" });
      res.end(contenido);
    });
  }

  else if (req.url === "/guardar" && req.method === "POST") {
    let cuerpo = "";

    req.on("data", parte => {
      cuerpo += parte;
    });

    req.on("end", () => {
      const datos = JSON.parse(cuerpo);
      const sql = "INSERT INTO solicitudes (nombre, correo, mensaje) VALUES (?, ?, ?)";

      conexion.query(sql, [datos.nombre, datos.correo, datos.mensaje], (error) => {
        if (error) {
          res.writeHead(500);
          res.end("Error al guardar");
        } else {
          res.writeHead(200);
          res.end("Guardado correctamente");
        }
      });
    });
  }

  else if (req.url === "/listar" && req.method === "GET") {
    const sql = "SELECT * FROM solicitudes ORDER BY id DESC";

    conexion.query(sql, (error, resultados) => {
      if (error) {
        res.writeHead(500);
        res.end("Error al listar datos");
      } else {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(resultados));
      }
    });
  }

  else {
    res.writeHead(404);
    res.end("Pagina no encontrada");
  }

});

servidor.listen(3000, () => {
  console.log("Servidor funcionando en http://localhost:3000");
});
