# API de productos de práctica

API de práctica con Node.js y Express que expone 10 productos ficticios desde `data/products.json`. La consume un plugin de WordPress para importar y actualizar productos en WooCommerce.

## Requisitos

- Node.js 24 (LTS) o superior
- npm

## Instalación y uso

```bash
npm install      # instala las dependencias
npm run dev      # desarrollo: reinicia al guardar cambios en el código
npm start        # producción
```

Por defecto escucha en `http://localhost:3000`. El puerto se puede cambiar con la variable de entorno `PORT`.

## Formato de un producto

| Campo         | Tipo    | Descripción                                                        |
|---------------|---------|--------------------------------------------------------------------|
| `id`          | string  | Identificador estable. No cambia nunca. Lo usa el plugin para vincular. |
| `sku`         | string  | Código comercial. Debe ser único.                                  |
| `name`        | string  | Nombre del producto.                                               |
| `description` | string  | Descripción en texto plano.                                        |
| `price`       | string  | Precio con punto decimal y dos decimales, sin separador de miles. Ej: `"12500.00"`. |
| `currency`    | string  | Código ISO 4217. Siempre `"ARS"` en esta práctica.                 |
| `stock`       | integer | Unidades disponibles. `0` significa sin stock.                     |
| `image_url`   | string  | URL pública de la imagen, con extensión (`.jpg`, `.png`, `.webp`). |

## Rutas

### `GET /health`

Comprueba que la API responde.

```json
{ "status": "ok" }
```

### `GET /products`

Lista todos los productos.

```json
{
  "count": 10,
  "data": [
    {
      "id": "prod-001",
      "sku": "PRAC-001",
      "name": "Taza de cerámica artesanal",
      "description": "Taza de 350 ml esmaltada a mano. Producto ficticio para pruebas.",
      "price": "12500.00",
      "currency": "ARS",
      "stock": 15,
      "image_url": "https://picsum.photos/seed/prac-001/800/800.jpg"
    }
  ]
}
```

### `GET /products/:id`

Devuelve un producto por su `id`.

```json
{ "data": { "id": "prod-010", "sku": "PRAC-010", "...": "..." } }
```

## Errores

| Código | `error`             | Cuándo ocurre                                          |
|--------|---------------------|--------------------------------------------------------|
| 404    | `product_not_found` | El `id` pedido no existe.                              |
| 500    | `data_unavailable`  | `products.json` no se pudo leer o no es una lista válida. |

Formato de error:

```json
{ "error": "product_not_found", "message": "No existe un producto con id \"prod-099\"." }
```

## Cómo actualizar los productos

1. Editar `data/products.json`. No cambiar nunca el `id` de un producto existente.
2. En local, los cambios se ven en el siguiente pedido, sin reiniciar.
3. En producción: hacer commit y push; el despliegue se documenta al publicar la API.

Para validar el JSON antes de guardar el commit:

```bash
python3 -m json.tool data/products.json > /dev/null && echo "JSON válido"
```
