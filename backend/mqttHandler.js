import mqtt from "mqtt";
import {db} from "./db.js";

export function iniciarMQTT(){
const client = mqtt.connect("mqtt://test.mosquitto.org");
client.on("connect", () => {
    console.log("Conectado al broker MQTT");
    client.subscribe("sensor/datos", (err) => {
        if (err) console.error("Error al suscribirse al topic MQTT", err);
        else console.log("Suscrito a sensor/datos");
    });
});

client.on("message", (topic, message) => {
    let data;
    try {
        data = JSON.parse(message.toString());
    } catch (err) {
        console.error("Payload no es JSON válido:", err);
        return; 
    }

    const { humedad, temperatura } = data;
    console.log(`Dato recibido → H:${humedad}%  T:${temperatura}°C`);

    
    db.query(
        "INSERT INTO lecturas (humedad, temperatura, fecha) VALUES (?, ?, NOW())",
        [humedad, temperatura],
        (err) => {
            if (err) console.error("Error al insertar datos en MySQL", err);
            else console.log("Datos insertados en MySQL");
        }
    );
 });
}