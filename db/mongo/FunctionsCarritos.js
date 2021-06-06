
import { DaoCarritos } from './Schema'

/* CARRITOS FUNCTIONS */

const getProductos = async  () => {
  try {
    const data = await DaoCarritos.findOne({id: 1}, {productos: 1});
    return data
  } catch (error) {
    console.log('Error al obtener productos del carrito: ', error); 
  }
}

const getProducto = async (id) => {
  try {
    const data = await DaoCarritos.findOne({id: 1}, {productos: 1});
    if (data && data.productos) {
      const producto = data.productos.find(product => product.id === parseInt(id))
      return producto
    }
    return null
  } catch (error) {
    console.log('Error al obtener productos del carrito: ', error); 
  }
}

const postProducto = async (newProduct) => {
  const dataDB = await DaoCarritos.find();
  if (!dataDB.length) {
    const newCart = await DaoCarritos.create({
      id: 1, 
      timestamp: Date.now(), 
      productos: [newProduct], 
    });
    return newCart
  } else {
    const auxProducts = dataDB[0].productos;
    auxProducts.push(newProduct);
    const updateCartStatus = await DaoCarritos.updateOne({id: 1}, {$set: {
      productos: auxProducts, 
    }})
    if (updateCartStatus?.ok === 1) {
      const data = await DaoCarritos.find({id: 1}, {productos: 1});
      return data[0]
    }
    return null
  }
}

const deleteProducto = async (id) => {
  const data = await DaoCarritos.findOne({id: 1}, {productos: 1});
  if (data && data.productos) {
    const auxProducts = data.productos.filter(product => product.id !== parseInt(id))
    const updateCartStatus = await DaoCarritos.updateOne({id: 1}, {$set: {
      productos: auxProducts, 
    }})
    if (updateCartStatus?.ok === 1) {
      const data = await DaoCarritos.find({id: 1}, {productos: 1});
      return data[0]
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