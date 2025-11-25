import express from "express";
import cors from "cors";
import mqtt from "mqtt";
import mysql from "mysql2";


import proximoriegoRoutes from "./routes/proximoriego.routes.js";
import sensoresRoutes from "./routes/sensores.routes.js";
import calendarioRoutes from "./routes/calendario.routes.js";
import riegoRoutes from "./routes/riego.routes.js";
import {iniciarMQTT} from "./mqttHandler.js";

const app = express();
app.use(cors());
app.use(express.json());

const broker = "mqtt://test.mosquitto.org";
const client = mqtt.connect(broker);

client.on("connect", () => {
    console.log("Conectado al broker MQTT");
    client.subscribe("sensor/datos", (err) => {
        if (err) console.error("Error al suscribirse al topic MQTT", err);
        else console.log("Suscrito a sensor/datos");
    });
});
client.on("message", (topic, message) => {
    console.log("mensaje MQTT recibido:", message.toString());
});

app.use("/api/sensores", sensoresRoutes);
app.use("/api/calendario", calendarioRoutes);
app.use("/api/riego", riegoRoutes);
app.use("/api/proximoriego", proximoriegoRoutes);



app.listen(4000, () => console.log("Servidor escuchando en el puerto 4000"));





