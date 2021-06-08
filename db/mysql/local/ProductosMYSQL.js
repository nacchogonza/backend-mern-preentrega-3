import knexFun from 'knex';

class ProductosMYSQL {
  constructor(config){

    this.knex = knexFun(config);
  }

  crearTabla() {
    return this.knex.schema.dropTableIfExists('productos')
    .then(() => {
      return this.knex.schema.createTable('productos', table => {
        table.increments('id').primary();
        table.string('title', 50).notNullable();
        table.string('description', 100).notNullable();
        table.float('price').notNullable();
        table.string('thumbnail', 250).notNullable();
        table.float('code').notNullable();
        table.float('stock').notNullable();
        table.bigInteger('timestamp').notNullable();
      })
    })
  }

  async postProducto(producto) {
    return await this.knex('productos').insert(producto);
  }

  async getProductos() {
    const productos = await this.knex('productos').select();
    let filterArray = productos
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

  async getProducto(id) {
    const producto = await this.knex('productos').where('id', id).select();
    if (producto.length) return producto[0]
    return null
  }

  putProducto(newProduct, id) {
    return this.knex('productos').where('id', id).update({ 
      title: newProduct.title,
      description: newProduct.description,
      price: newProduct.price,
      thumbnail: newProduct.thumbnail,
      code: newProduct.code,
      stock: newProduct.stock,
    });
  }

  deleteProducto(id) {
    return this.knex('productos').where('id', id).del()
  }

  cerrar() {
    return this.knex.destroy()
  }

}

export {ProductosMYSQL};