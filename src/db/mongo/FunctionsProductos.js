import { DaoProductos } from "./Schema";
import { logger } from "../../logger";

/* PRODUCTS FUNCTIONS */

const getProductos = async (filterParams) => {
  try {
    const products = await DaoProductos.find({});
    let filterArray = products;
    if (filterParams && filterParams.name) {
      const filterArrayName = filterArray.filter(
        (product) => filterParams.name === product.title
      );
      filterArray = filterArrayName;
    }
    if (filterParams && filterParams.code) {
      const filterArrayCode = filterArray.filter(
        (product) => filterParams.code == product.code
      );
      filterArray = filterArrayCode;
    }
    if (filterParams && filterParams.price_min && filterParams.price_max) {
      const filterArrayPrice = filterArray.filter(
        (product) =>
          product.price >= filterParams.price_min &&
          product.price <= filterParams.price_max
      );
      filterArray = filterArrayPrice;
    }
    if (filterParams && filterParams.stock_min && filterParams.stock_max) {
      const filterArrayStock = filterArray.filter(
        (product) =>
          product.stock >= filterParams.stock_min &&
          product.stock <= filterParams.stock_max
      );
      filterArray = filterArrayStock;
    }
    return filterArray;
  } catch (error) {
    logger.log("error", "Error al obtener productos: ", error);
  }
};

const getProducto = async (id) => {
  try {
    const product = await DaoProductos.findOne({ id: id });
    return product;
  } catch (error) {
    logger.log("error", "Error al obtener producto por id: ", error);
  }
};

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
      timestamp: newProduct.timestamp,
    });
    return product;
  } catch (error) {
    logger.log("error", "Error al insertar producto: ", error);
  }
};

const putProducto = async (updateProduct, id) => {
  try {
    const updateStatus = await DaoProductos.updateOne(
      { id: id },
      {
        $set: {
          title: updateProduct.title,
          description: updateProduct.description,
          price: updateProduct.price,
          thumbnail: updateProduct.thumbnail,
          code: updateProduct.code,
          stock: updateProduct.stock,
        },
      }
    );
    if (updateStatus?.ok === 1) {
      const product = await DaoProductos.findOne({ id: id });
      return product;
    }
    return null;
  } catch (error) {
    logger.log("error", "Error al modificar producto: ", error);
  }
};

const deleteProducto = async (id) => {
  try {
    const removeStatus = await DaoProductos.deleteOne({ id: id });
    return removeStatus;
  } catch (error) {
    logger.log("error", "Error al eliminar producto: ", error);
  }
};

const ProductosMongoCloud = {
  getProductos,
  getProducto,
  postProducto,
  putProducto,
  deleteProducto,
};

export { ProductosMongoCloud };
