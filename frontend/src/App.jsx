import React, { useEffect, useState } from "react";
import Calendario from "./calendario"; 
import ProximoRiego from "./ProximoRiego";  
import axios from "axios";
import mqtt from "mqtt";
import "./App.css";

function App() {

  const [lecturas, setLecturas] = useState([]);
  const [datoVivo, setDatoVivo] = useState(null);

  // 🔔 PEDIR PERMISO UNA SOLA VEZ
  useEffect(() => {
    Notification.requestPermission().then((permiso) => {
      console.log("Permiso de notificación:", permiso);
    });
  }, []);

  // 🔔⏰ NOTIFICACIÓN SIMPLE CUANDO LLEGUE LA HORA EXACTA
  useEffect(() => {
    const revisarRiego = async () => {
      try {
        // ✔️ Ruta correcta a tu backend
        const res = await axios.get("http://localhost:4000/api/proximoriego");
        const fecha = res.data.fecha_inicio;

        if (!fecha) return;

        const fechaRiego = new Date(fecha).getTime();
        const ahora = Date.now();

        // ▶️ si estamos en la hora exacta (o pasados por 5 seg)
        if (ahora >= fechaRiego && ahora <= fechaRiego + 5000) {
          if (!window.__notificado) {
            window.__notificado = true;

            new Notification("🌱 ¡Hora de regar las orquídeas!", {
              body: "Es el momento exacto del riego.",
              icon: "/icon.png",
            });
          }
        }

      } catch (error) {
        console.error("Error verificando notificación:", error);
      }
    };

    // revisar cada 5 segundos
    const interval = setInterval(revisarRiego, 5000);
    return () => clearInterval(interval);

  }, []);

  // 🔵 MQTT + última lectura
  useEffect(() => {
    let mounted = true;

    const obtenerLecturas = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/sensores");
        if (mounted) setLecturas(res.data || []);
      } catch (err) {
        console.error("Error al obtener lecturas:", err);
      }
    };
    obtenerLecturas();

    const client = mqtt.connect("wss://test.mosquitto.org:8081", { reconnectPeriod: 5000 });

    client.on("connect", () => {
      console.log("MQTT conectado (frontend)");
      client.subscribe("sensor/datos", (err) => {
        if (err) console.error("Error suscripción MQTT:", err);
      });
    });

    client.on("message", (topic, message) => {
      try {
        const data = JSON.parse(message.toString());
        if (mounted) setDatoVivo(data);
      } catch (err) {
        console.error("Error parseando mensaje MQTT:", err);
      }
    });

    return () => {
      mounted = false;
      try { client.end(); } catch (_) {}
    };
  }, []);

  const fuente = datoVivo || (lecturas.length ? lecturas[0] : null);

  // UI
  return (
    <div className="app">
      <header className="header">
        <div className="brand">
          <h1>Orquídeas</h1>
          <div className="tag">Informacion Orquideas</div>
        </div>
      </header>

      <main className="content">
        <section className="metrics-grid">
          <div className="card metric-card">
            <div className="metric-head">Humedad</div>
            <div className="metric-body">
              <div className="metric-icon">💧</div>
              <div className="metric-value">
                {fuente ? `${Math.round(fuente.humedad)}%` : "—"}
              </div>
            </div>
          </div>

          <div className="card metric-card">
            <div className="metric-head">Temperatura</div>
            <div className="metric-body">
              <div className="metric-icon">🌡️</div>
              <div className="metric-value">
                {fuente ? `${Math.round(fuente.temperatura)}°C` : "—"}
              </div>
            </div>
          </div>

          <ProximoRiego />
        </section>

        <section className="right-column">
          <div className="card calendar-card">
            <div className="card-head">
              <h4>Calendario de Riegos</h4>
            </div>
            <div className="card-body">
              <Calendario />
            </div>
          </div>
        </section>

        <section className="table-section">
          <div className="card table-card">
            <div className="card-head">
              <h4>Registro Historico</h4>
            </div>
            <div className="card-body">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Temp (°C)</th>
                    <th>Humedad (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {lecturas.map((r, i) => (
                    <tr key={i}>
                      <td>{new Date(r.fecha).toLocaleString()}</td>
                      <td>{r.temperatura}</td>
                      <td>{r.humedad}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
