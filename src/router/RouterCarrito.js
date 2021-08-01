import express from 'express';
import { productos, carrito, usuarios } from '../index';


/* HAY QUE CAMBIAR CARRITO A FORMATO ARRAY PARA PODER UTILIZAR ID CARRITO O BIEN HARDCODEAR EL 1 */

const routerCarrito = express.Router();
routerCarrito.use(express.json())
routerCarrito.use(express.urlencoded({extended: true}));

routerCarrito.get('/carrito', async (req, res) => {
  const user = req.session.passport.user
  const productosCarrito = await carrito.getProductos(user)
  if (productosCarrito === undefined || productosCarrito === null || !productosCarrito.productos) {
    res.json({error: 'todavia no hay productos en el carrito'});
    return;
  }
  res.json(productosCarrito.productos)
})

routerCarrito.post('/carrito', async (req, res) => {
  const user = req.session.passport.user
  const usersDb = await usuarios.getUsuarios();

  const usuario = usersDb.find(usuario => usuario.username == user)
  if (usuario) {
    const userCart = await carrito.confirmCart(usuario)
    if (userCart) {
      res.json(userCart);
    } else {
      res.json({error: 'carrito no encontrado'})
    }
  } else {
    res.json({error: 'usuario no encontrado'})
  }
})

routerCarrito.get('/carrito/:id', async (req, res) => {
  const user = req.session.passport.user
  const data = req.params.id;
  const productoCarrito = await carrito.getProducto(user, data)
  if (productoCarrito === undefined || productoCarrito === null) { // || !productoCarrito.productos
    res.json({error: 'no existe producto con el id ingresado en el carrito'})
    return;
  };
  res.json(productoCarrito)
})

routerCarrito.post('/carrito/:id', async (req, res) => {
  const data = req.params.id;
  const user = req.session.passport.user
  const productList = await productos.getProductos()
  const product = productList.find((producto) => parseInt(producto.id) === parseInt(data))
  if (product === undefined) {
    res.json({error: 'no existe producto con el id ingresado'})
    return;
  };
  const newProduct = await carrito.postProducto(user, product);
  if (newProduct === undefined || newProduct === null) {
    res.json({error: 'error al agregar el producto al carrito'});
    return;
  }
  res.json(newProduct.productos);
})

routerCarrito.delete('/carrito/:id', async (req, res) => {
  const user = req.session.passport.user
  const deleteProduct = await carrito.deleteProducto(user, req.params.id);
  if (deleteProduct === null || deleteProduct === undefined) res.json({error: 'producto no encontrado'})
  res.json(deleteProduct);
})

export { routerCarrito };