import express from 'express';
import { Carrito } from '../api/Carrito.js';
import { productos } from './RouterApi.js';

let carrito = new Carrito();

const routerCarrito = express.Router();
routerCarrito.use(express.json())
routerCarrito.use(express.urlencoded({extended: true}));

routerCarrito.get('/carrito', async (req, res) => {
  const productosCarrito = await carrito.getProductos()

  if (productosCarrito === undefined || productosCarrito === null || !productosCarrito.productos) {
    res.json({error: 'todavia no hay productos en el carrito'});
    return;
  }
  res.json(productosCarrito.productos)
})

routerCarrito.get('/carrito/:id', async (req, res) => {
  const data = req.params.id;
  const productoCarrito = await carrito.getProducto(data)
  if (productoCarrito === undefined || !productoCarrito.productos) {
    res.json({error: 'no existe producto con el id ingresado'})
    return;
  };
  res.json(productoCarrito)
})

routerCarrito.post('/carrito/:id', async (req, res) => {
  const data = req.params.id;
  const productList = await productos.getProductos()
  const product = productList.find((producto) => producto.id === parseInt(data))
  if (product === undefined) {
    res.json({error: 'no existe producto con el id ingresado'})
    return;
  };
  const newProduct = await carrito.postProducto(product);
  if (newProduct === undefined || newProduct === null) {
    res.json({error: 'error al agregar el producto al carrito'});
    return;
  }
  res.json(newProduct.productos);
})

routerCarrito.delete('/carrito/:id', async (req, res) => {

  const deleteProduct = await carrito.deleteProducto(req.params.id);
  if (deleteProduct === null || deleteProduct === undefined) res.json({error: 'producto no encontrado'})
  res.json(deleteProduct);
})

export { routerCarrito };