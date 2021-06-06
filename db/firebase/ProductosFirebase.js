import { firebaseAdmin } from './FirebaseAdmin'

const db = firebaseAdmin.firestore();
const productos = db.collection('productos');

const getId = async () => {
    const productosSnapshot = await productos.get()
    let docs = productosSnapshot.docs
    return docs.length + 1;
}

const getProductos = async () => {
    try {
        const productosSnapshot = await productos.get()
        let docs = productosSnapshot.docs

        const response = docs.map((doc) => ({
            id: doc.id,
            title: doc.data().title,
            description: doc.data().description,
            thumbnail: doc.data().thumbnail,
            price: doc.data().price,
            stock: doc.data().stock,
            code: doc.data().code,
        }))

        return response
    } catch (error) {
        console.log('error al obtener productos: ', error)
    }
}

const getProducto = async (id) => {
    try {
        let doc = productos.doc(`${parseInt(id)}`)
        const item = await doc.get()
        const response = item.data
        return response
    } catch (error) {
        console.log('error obtener producto por id: ', error)
    }
}

const postProducto = async (newProduct) => {
    try {
        let id = await getId()
        let doc = productos.doc(`${id}`)
        await doc.create({
            id,
            title: newProduct.title, 
            description: newProduct.description, 
            price: newProduct.price, 
            thumbnail: newProduct.thumbnail,
            code: newProduct.code,
            stock: newProduct.stock,
            timestamp: newProduct.timestamp
        })

        doc = productos.doc(`${id}`)
        const item = await doc.get()
        const response = item.data
        return response
    } catch (error) {
        console.log('error al insertar producto: ', error)
    }
}

const putProducto = async (updateProduct, id) => {
    try {
        const doc = productos.doc(`${parseInt(id)}`)
        const item = await doc.update({
            title: updateProduct.title, 
            description: updateProduct.description, 
            price: updateProduct.price, 
            thumbnail: updateProduct.thumbnail,
            code: updateProduct.code,
            stock: updateProduct.stock,
        })
        const response = item.data
        return response
    } catch (error) {
        console.log('error al modificar producto: ', error)
    }
}

const deleteProducto = async (id) => {
    try {
        let doc = productos.doc(`${parseInt(id)}`)
        const item = await doc.get()
        const response = item.data

        await doc.delete()
        return response
    } catch (error) {
      console.log('Error al eliminar producto: ', error); 
    }
  }

const ProductosFirebase = {
    getProductos,
    getProducto,
    postProducto,
    putProducto ,
    deleteProducto
}

export { ProductosFirebase };
