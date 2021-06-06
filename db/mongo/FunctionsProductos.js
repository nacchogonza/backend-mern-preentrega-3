
import { DaoProductos } from './Schema'

/* PRODUCTS FUNCTIONS */

const getProductos = async  () => {
  try {
    const products =  await DaoProductos.find({})
    return products;
  } catch (error) {
    console.log('Error al obtener productos: ', error); 
  }
}

const getProducto = async  (id) => {
  try {
    const product = await DaoProductos.findOne({id: id})
    return product;
  } catch (error) {
    console.log('Error al obtener producto por id: ', error); 
  }
}

const postProducto = async (newProduct) => {
  try {
    const dataDB = await getProductos();
    const product = await DaoProductos.create({
      id: dataDB.length + 1, 
      title: newProduct.title, 
      description: newProduct.description, 
      price: newProduct.price, 
      thumbnail: newProduct.thumbnail,
      code: newProduct.code,
      stock: newProduct.stock,
      timestamp: newProduct.timestamp
    });
    return product
  } catch (error) {
    console.log('Error al insertar producto: ', error); 
  }
}

const putProducto = async  (updateProduct, id) => {
  try {
    const updateStatus =  await DaoProductos.updateOne({id: id}, {$set: {
      title: updateProduct.title, 
      description: updateProduct.description, 
      price: updateProduct.price, 
      thumbnail: updateProduct.thumbnail, 
      code: updateProduct.code, 
      stock: updateProduct.stock
    }})
    if (updateStatus?.ok === 1) {
      const product = await DaoProductos.findOne({id: id});
      return product;
    }
    return null;
  } catch (error) {
    console.log('Error al modificar producto: ', error); 
  }
}

const deleteProducto = async (id) => {
  try {
    const removeStatus = await DaoProductos.deleteOne({id: id})
    return removeStatus;
  } catch (error) {
    console.log('Error al eliminar producto: ', error); 
  }
}

const ProductosMongoCloud = {
  getProductos,
  getProducto,
  postProducto,
  putProducto,
  deleteProducto
}

export { ProductosMongoCloud }