import mysql from "mysql2";

export const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "orquideas_db",
});

db.connect((err) => {
  if (err) {
    console.error(" Error en la conexión a MySQL:", err);
  } else {
    console.log(" Conectado a la base de datos MySQL");
  }
});
