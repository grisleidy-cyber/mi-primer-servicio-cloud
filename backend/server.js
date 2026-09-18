const express = require('express');
const cors = require('cors');
const axios = require('axios');
const csv = require('csv-parser');
const { Readable } = require('stream');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// PEGA AQUÍ EL ENLACE CSV QUE COPIASTE DE GOOGLE SHEETS
const GOOGLE_SHEETS_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQDlHD2bqsl6d2H4sTvTsTk5iVmU1eMUh5Twmnbn83y_HetEtwiA16dJ-bhd1B_o74M17Na16GGF4H8/pub?output=csv";

app.get('/api/productos', async (req, res) => {
  try {
    const response = await axios.get(GOOGLE_SHEETS_CSV_URL);
    const productos = [];
    const stream = Readable.from(response.data);

    stream
      .pipe(csv())
      .on('data', (row) => {
        productos.push({
          id: Number(row.id) || row.id,
          nombre: row.nombre,
          precio: Number(row.precio) || 0,
          categoria: row.categoria
        });
      })
      .on('end', () => {
        res.json(productos);
      })
      .on('error', (err) => {
        res.status(500).json({ error: 'Error al procesar la hoja de cálculo' });
      });
  } catch (error) {
    res.status(500).json({ error: 'Error al conectar con Google Sheets' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor activo en el puerto ${PORT}`);
});