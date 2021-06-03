import express from 'express';
import { productos } from '../index';

const administrador = true;

const routerApi = express.Router();
routerApi.use(express.json())
routerApi.use(express.urlencoded({extended: true}));

routerApi.get('/productos', async (req, res) => {
  const data = await productos.getProductos()
  if (!data.length) {
    res.json({error: 'no hay productos cargados'})
    return;
  }
  res.json(data);
})

routerApi.post('/productos', async (req, res) => {
  if (!administrador) {
    res.json({ error : -1, descripcion: "ruta '/productos' método 'POST' no autorizada"})
    return
  }
  const data = req.body;
  if (data.form) {
    delete data.form;
    data.price = parseFloat(data.price);
    data.code = parseFloat(data.code);
    data.stock = parseFloat(data.stock);
  }
  data.timestamp = Date.now();
  const newProduct = await productos.postProducto(data)
  res.json(newProduct);
})

routerApi.get('/productos/:id', async (req, res) => {
  const filterProduct = await productos.getProducto(req.params.id);
  if (!filterProduct) res.json({error: 'producto no encontrado'})
  res.json(filterProduct);
})

routerApi.put('/productos/:id', async (req, res) => {
  if (!administrador) {
    res.json({ error : -1, descripcion: "ruta '/productos/:id' método 'PUT' no autorizada"})
    return
  }
  const updateProduct = await productos.putProducto(req.body, req.params.id);
  if (!updateProduct) {
    res.json({error: 'producto no encontrado'})
    return
  }
  res.json(updateProduct);
})

routerApi.delete('/productos/:id', async (req, res) => {
  if (!administrador) {
    res.json({ error : -1, descripcion: "ruta '/productos/:id' método 'DELETE' no autorizada"})
    return
  }
  const deleteProduct = await productos.deleteProducto(req.params.id);
  if (!deleteProduct) {
    res.json({error: 'producto no encontrado'})
    return
  }
  res.json(deleteProduct);
})

export { routerApi, productos };