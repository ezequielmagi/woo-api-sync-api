import express from 'express';
import { readFile } from 'node:fs/promises';

const app = express();
const PORT = process.env.PORT || 3000;

// Ruta al archivo de datos, relativa a este archivo (no a la carpeta desde donde se ejecuta).
const DATA_FILE = new URL('./data/products.json', import.meta.url);

// Lee y valida el archivo en cada pedido, así los cambios se ven sin reiniciar.
async function loadProducts() {
  const raw = await readFile(DATA_FILE, 'utf8');
  const parsed = JSON.parse(raw);

  if (!Array.isArray(parsed)) {
    throw new Error('products.json debe contener una lista de productos.');
  }

  return parsed;
}

// Respuesta única para cuando no se pueden leer los datos.
function sendDataError(res, error) {
  console.error('Error leyendo products.json:', error.message);
  res.status(500).json({
    error: 'data_unavailable',
    message: 'No se pudieron leer los productos. Revisá el archivo de datos.'
  });
}

// CORS: permite que páginas de cualquier origen lean las respuestas de esta API.
app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/products', async (req, res) => {
  try {
    const products = await loadProducts();
    res.json({ count: products.length, data: products });
  } catch (error) {
    sendDataError(res, error);
  }
});

app.get('/products/:id', async (req, res) => {
  try {
    const products = await loadProducts();
    const product = products.find((p) => p.id === req.params.id);

    if (!product) {
      return res.status(404).json({
        error: 'product_not_found',
        message: `No existe un producto con id "${req.params.id}".`
      });
    }

    res.json({ data: product });
  } catch (error) {
    sendDataError(res, error);
  }
});

// Cualquier ruta no definida responde JSON, no la página HTML por defecto de Express.
app.use((req, res) => {
  res.status(404).json({
    error: 'route_not_found',
    message: `La ruta ${req.method} ${req.path} no existe.`
  });
});

// Último recurso: cualquier error no atrapado responde JSON y queda en el log.
app.use((err, req, res, next) => {
  console.error('Error no controlado:', err);
  res.status(500).json({
    error: 'internal_error',
    message: 'Error interno de la API.'
  });
});

app.listen(PORT, () => {
  console.log(`API escuchando en http://localhost:${PORT}`);
});
