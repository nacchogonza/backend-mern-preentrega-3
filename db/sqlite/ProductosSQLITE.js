import knexFun from 'knex';

class ProductosSQLITE {
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
    return await this.knex('productos').select();
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

export {ProductosSQLITE};