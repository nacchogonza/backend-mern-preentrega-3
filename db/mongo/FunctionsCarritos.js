
import { DaoCarritos } from './Schema'

/* CARRITOS FUNCTIONS */

const getProductos = async (user) => {
  try {
    const data = await DaoCarritos.findOne({id: user}, {productos: 1});
    return data
  } catch (error) {
    console.log('Error al obtener productos del carrito: ', error); 
  }
}

const getProducto = async (user, id) => {
  try {
    const data = await DaoCarritos.findOne({id: user}, {productos: 1});
    if (data && data.productos) {
      const producto = data.productos.find(product => product.product.id === parseInt(id))
      return producto
    }
    return null
  } catch (error) {
    console.log('Error al obtener productos del carrito: ', error); 
  }
}

const postProducto = async (user, newProduct) => {
  const dataDB = await DaoCarritos.findOne({id: user});
  if (!dataDB) {
    const newCart = await DaoCarritos.create({
      id: user, 
      timestamp: Date.now(), 
      productos: [{quantity: 1, product: newProduct}], 
    });
    return newCart
  } else {
    const userCart = await DaoCarritos.findOne({id: user});
    if (!userCart) return null;
    const auxProducts = userCart.productos;
    const productExists = auxProducts.find(product => product.product.id === newProduct.id)
    if (!productExists) {
      auxProducts.push({quantity: 1, product: newProduct});
    } else {
      productExists.quantity++;
    }
    const updateCartStatus = await DaoCarritos.updateOne({id: user}, {$set: {
      productos: auxProducts, 
    }})
    if (updateCartStatus?.ok === 1) {
      const data = await DaoCarritos.findOne({id: user}, {productos: 1});
      return data
    }
    return null
  }
}

const deleteProducto = async (user, id) => {
  const data = await DaoCarritos.findOne({id: user}, {productos: 1});
  if (data && data.productos) {
    const auxProducts = data.productos.filter(product => product.product.id !== parseInt(id))
    const updateCartStatus = await DaoCarritos.updateOne({id: user}, {$set: {
      productos: auxProducts, 
    }})
    if (updateCartStatus?.ok === 1) {
      const data = await DaoCarritos.find({id: user}, {productos: 1});
      return data
    }
    return null
  }
}

const CarritosMongoCloud = {
  getProductos,
  getProducto,
  postProducto,
  deleteProducto
}

export { CarritosMongoCloud }