import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

// Por ahora el producto vive en el código. En el próximo hito pasa a un JSON.
const products = [
  {
    id: 'prod-001',
    sku: 'PRAC-001',
    name: 'Taza de cerámica artesanal',
    description: 'Taza de 350 ml esmaltada a mano. Producto ficticio para pruebas.',
    price: '12500.00',
    currency: 'ARS',
    stock: 15,
    image_url: 'https://picsum.photos/seed/prac-001/800/800.jpg'
  }
];

// Ruta de salud: sirve para comprobar rápido que la API responde.
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Listar todos los productos.
app.get('/products', (req, res) => {
  res.json({ count: products.length, data: products });
});

// Obtener un producto por su id.
app.get('/products/:id', (req, res) => {
  const product = products.find((p) => p.id === req.params.id);

  if (!product) {
    return res.status(404).json({
      error: 'product_not_found',
      message: `No existe un producto con id "${req.params.id}".`
    });
  }

  res.json({ data: product });
});

app.listen(PORT, () => {
  console.log(`API escuchando en http://localhost:${PORT}`);
});
