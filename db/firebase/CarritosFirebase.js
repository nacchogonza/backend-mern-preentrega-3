import { firebaseAdmin } from "./FirebaseAdmin";

const db = firebaseAdmin.firestore();
const carritos = db.collection("carritos");

const getProductos = async () => {
  try {
    let doc = carritos.doc(`1`);
    const cart = await doc.get();
    const response = cart.data();
    if (response) {
      return response;
    }
    return null;
  } catch (error) {
    console.log("error: ", error);
  }
};

const getProducto = async (id) => {
  try {
    let doc = carritos.doc(`1`);
    const cart = await doc.get();
    const response = cart.data();
    if (response) {
      const product = response.productos.find(
        (product) => parseInt(product.id) === parseInt(id)
      );
      return product;
    }
    return null;
  } catch (error) {
    console.log("error obtener producto por id: ", error);
  }
};

const postProducto = async (newProduct) => {
  try {
    const carritosSnapshot = await carritos.get();
    let docs = carritosSnapshot.docs;
    if (!docs || !docs.length) {
      let doc = carritos.doc(`1`);
      await doc.create({
        id: 1,
        timestamp: Date.now(),
        productos: [newProduct],
      });

      doc = carritos.doc(`1`);
      const item = await doc.get();
      const response = item.data();
      return response;
    } else {
      let doc = carritos.doc(`1`);
      const cart = await doc.get();
      const response = cart.data();
      if (response) {
        console.log("responsee: ", response);
        const auxProducts = response.productos;
        auxProducts.push(newProduct);
        await doc.update({
          id: response.id,
          timestamp: response.timestamp,
          productos: auxProducts,
        });
        return newProduct;
      }
      return null;
    }
  } catch (error) {
    console.log("error al insertar producto en el carrito: ", error);
  }
};

const deleteProducto = async (id) => {
  try {
    let doc = carritos.doc(`1`);
    const cart = await doc.get();
    const response = cart.data();
    console.log(response)
    if (response) {
      const deletedProduct = response.productos.find(
        (product) => parseInt(product.id) === parseInt(id)
      );
      const filterArray = response.productos.filter(
        (product) => parseInt(product.id) !== parseInt(id)
      );

      await doc.update({
        id: response.id,
        timestamp: response.timestamp,
        productos: filterArray,
      });
      return deletedProduct;
    }
    return null;
  } catch (error) {
    console.log("error obtener producto por id: ", error);
  }
};

const CarritosFirebase = {
  getProductos,
  getProducto,
  postProducto,
  deleteProducto,
};

export { CarritosFirebase };
