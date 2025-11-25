import React, { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import es from "date-fns/locale/es";
import axios from "axios";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./calendario.css";

const locales = { es };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

const Calendario = () => {
  const [eventos, setEventos] = useState([]);
  const [nuevoEvento, setNuevoEvento] = useState({
    titulo: "",
    descripcion: "",
    fecha_inicio: "",
    fecha_fin: "",
  });

  // 🔹 Cargar eventos desde el backend
  const cargarEventos = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/calendario");
      const eventosAdaptados = res.data.map((ev) => ({
        id: ev.id,
        title: ev.titulo,
        desc: ev.descripcion,
        start: new Date(ev.fecha_inicio),
        end: new Date(ev.fecha_fin),
      }));
      setEventos(eventosAdaptados);
    } catch (error) {
      console.error("Error al cargar eventos:", error);
    }
  };

  useEffect(() => {
    cargarEventos();
  }, []);

  // 🔹 Crear nuevo evento
  const agregarEvento = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:4000/api/calendario", nuevoEvento);
      alert("Evento agregado correctamente");
      setNuevoEvento({
        titulo: "",
        descripcion: "",
        fecha_inicio: "",
        fecha_fin: "",
      });
      cargarEventos();
    } catch (error) {
      alert("Error al agregar evento");
    }
  };

  return (
    <div className="calendario-container">
      <h2 className="titulo-calendario">🌸 Calendario de Riego de Orquídeas</h2>

      <form className="form-calendario" onSubmit={agregarEvento}>
        <input
          type="text"
          placeholder="Título"
          value={nuevoEvento.titulo}
          onChange={(e) =>
            setNuevoEvento({ ...nuevoEvento, titulo: e.target.value })
          }
          required
        />
        <input
          type="text"
          placeholder="Descripción"
          value={nuevoEvento.descripcion}
          onChange={(e) =>
            setNuevoEvento({ ...nuevoEvento, descripcion: e.target.value })
          }
        />
        <input
          type="datetime-local"
          value={nuevoEvento.fecha_inicio}
          onChange={(e) =>
            setNuevoEvento({ ...nuevoEvento, fecha_inicio: e.target.value })
          }
          required
        />
        <input
          type="datetime-local"
          value={nuevoEvento.fecha_fin}
          onChange={(e) =>
            setNuevoEvento({ ...nuevoEvento, fecha_fin: e.target.value })
          }
          required
        />
        <button type="submit">Agregar Evento</button>
      </form>

      <div className="calendario-wrapper">
        <Calendar
          localizer={localizer}
          events={eventos}
          startAccessor="start"
          endAccessor="end"
          messages={{
            next: "Sig",
            previous: "Ant",
            today: "Hoy",
            month: "Mes",
            week: "Semana",
            day: "Día",
          }}
          style={{ height: 500 }}
        />
      </div>
    </div>
  );
};

export default Calendario;

