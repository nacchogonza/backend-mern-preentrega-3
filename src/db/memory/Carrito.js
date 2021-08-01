class CarritosMemory {
  constructor() {
    this.carritos = [];
  }

  getProductos() {
    if (this.carritos.length) {
      return this.carritos[0]
    }
    return null;
  }

  getProducto(id) {

    if (this.carritos.length) {
      const product = this.carritos[0].productos.find(
        (producto) => producto.id === parseInt(id)
      );
      return product;
    }
    return null;
  }

  postProducto(newProduct) {
    if (!this.carritos.length) {
      const newCart = {
        id: 1,
        timestamp: Date.now(),
        productos: [newProduct],
      };
      this.carritos.push(newCart);
      return this.carritos[0];
    } else {
      const auxProducts = this.carritos[0].productos;
      auxProducts.push(newProduct);
      this.carritos[0].productos = auxProducts;
      return this.carritos[0].productos;
    }
  }

  deleteProducto(id) {
    const product = this.getProducto(id);
    if (product) {
      const filterArray = this.carritos[0].productos.filter(
        (producto) => producto.id != id
      );
      this.carritos[0].productos = filterArray;
    }
    return product;
  }
}

export { CarritosMemory };
