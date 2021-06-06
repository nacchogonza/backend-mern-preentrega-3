class ProductosMemory {
  constructor() {
    this.productos = [];
  }

  getProductos () {
    return this.productos;
  }

  getProducto(id) {
    const product = this.productos.find((producto) => producto.id === parseInt(id))
    return product;
  }

  postProducto (producto) {
    producto.id = this.productos.length + 1;
    this.productos.push(producto);
    return producto;
  }

  putProducto (productUpdate, id) {
    const product = this.getProducto(id);
    if (product) {
      product.title = productUpdate.title;
      product.description = productUpdate.description;
      product.price = productUpdate.price;
      product.thumbnail = productUpdate.thumbnail;
      product.code = productUpdate.code;
      product.stock = productUpdate.stock;
      return product;
    }
    return null;
  }

  deleteProducto (id) {
    const product = this.getProducto(id);
    if (product) {
      const filterArray = this.productos.filter(producto => producto.id != id);
      this.productos = filterArray;
    }
    return product;
  }
}

export { ProductosMemory }