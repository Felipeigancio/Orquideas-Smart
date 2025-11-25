
import React, { useEffect, useState } from "react";
import axios from "axios";

function ProximoRiego() {
  const [proximoRiego, setProximoRiego] = useState(null);

  useEffect(() => {
    const obtenerRiego = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/riego");
        setProximoRiego(res.data?.fecha_inicio || null);
      } catch (err) {
        console.error("Error al obtener el próximo riego:", err);
      }
    };

    obtenerRiego();
  }, []);

  return (
    <div className="card metric-card">
      <div className="metric-head">Próximo riego</div>
      <div className="metric-body">
        <div className="metric-icon">🗓️</div>
        <div className="metric-value">
          {proximoRiego
            ? new Date(proximoRiego).toLocaleString("es-CL", {
                dateStyle: "full",
                timeStyle: "short",
              })
            : "—"}
        </div>
      </div>
    </div>
  );
}

export default ProximoRiego;
