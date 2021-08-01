class ProductosMemory {
  constructor() {
    this.productos = [];
  }

  getProductos (filterParams) {
    let filterArray = this.productos
    if (filterParams.name) {
      const filterArrayName = filterArray.filter(product => filterParams.name === product.title)
      filterArray = filterArrayName
    }
    if (filterParams.code) {
      const filterArrayCode = filterArray.filter(product => filterParams.code == product.code)
      filterArray = filterArrayCode
    }
    if (filterParams.price_min && filterParams.price_max) {
      const filterArrayPrice = filterArray.filter(product => product.price >= filterParams.price_min && product.price <= filterParams.price_max)
      filterArray = filterArrayPrice
    }
    if (filterParams.stock_min && filterParams.stock_max) {
      const filterArrayStock = filterArray.filter(product => product.stock >= filterParams.stock_min && product.stock <= filterParams.stock_max)
      filterArray = filterArrayStock
    }
    return filterArray;
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