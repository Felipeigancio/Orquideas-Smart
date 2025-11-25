import axios from "axios";
import mysql from "mysql2/promise"; // usar promise para async/await

const BASE_URL = "http://backend-orquideas-27994.chilecentral.azurecontainer.io:4000";

// Función para probar endpoints REST
async function testEndpoint(path) {
  try {
    const res = await axios.get(`${BASE_URL}${path}`);
    console.log(`✅ ${path} -> OK`);
    console.log(res.data);
  } catch (err) {
    console.error(`❌ ${path} -> ERROR`, err.message);
  }
}

// Función para probar conexión a la DB
async function testDB() {
  try {
    const connection = await mysql.createConnection({
      host: "mysql-orquideas-6597.chilecentral.azurecontainer.io",
      user: "root",
      password: "123456",
      database: "orquideas_db"
    });
    console.log("✅ DB -> Conexión OK");
    await connection.end();
  } catch (err) {
    console.error("❌ DB -> ERROR", err.message);
  }
}

// Ejecutar tests
(async () => {
  console.log("--- Probando backend ---");
  await testEndpoint("/");
  await testEndpoint("/api/sensores");
  await testEndpoint("/api/calendario");
  await testEndpoint("/api/riego");
  await testEndpoint("/api/proximoriego");
  await testDB();
})();
