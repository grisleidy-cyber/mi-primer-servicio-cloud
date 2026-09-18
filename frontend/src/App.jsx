import { useEffect, useState } from "react";

function App() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    fetch("https://mi-primer-servicio-cloud-7q3r.onrender.com/api/productos")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error en el servidor");
        }
        return response.json();
      })
      .then((data) => {
        setProductos(data);
        setCargando(false);
      })
      .catch((error) => {
        console.error(error);
        setError(true);
        setCargando(false);
      });
  }, []);

  // Filtrado dinámico por nombre o categoría
  const productosFiltrados = productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    producto.categoria.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div
      style={{
        padding: "40px",
        fontFamily: "Arial",
        maxWidth: "600px",
        margin: "0 auto"
      }}
    >
      <h1>Mi Primer Servicio Cloud</h1>
      <p>Aplicación React consumiendo una API desarrollada con Node.js</p>

      {/* Barra de búsqueda */}
      <input
        type="text"
        placeholder="Buscar por nombre o categoría..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "20px",
          boxSizing: "border-box",
          borderRadius: "6px",
          border: "1px solid gray"
        }}
      />

      {cargando && <p>Cargando información...</p>}

      {error && <p>No fue posible conectar con el servicio.</p>}

      {!cargando && !error && (
        productosFiltrados.length === 0 ? (
          <p>No se encontraron productos coincidentes.</p>
        ) : (
          productosFiltrados.map((producto) => (
            <div
              key={producto.id}
              style={{
                border: "1px solid gray",
                padding: "15px",
                marginTop: "10px",
                borderRadius: "8px"
              }}
            >
              <h3>{producto.nombre}</h3>
              <p>Precio: ${producto.precio}</p>
              <p>Categoría: {producto.categoria}</p>
            </div>
          ))
        )
      )}
    </div>
  );
}

export default App;