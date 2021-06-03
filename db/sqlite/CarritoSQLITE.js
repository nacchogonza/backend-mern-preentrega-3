import knexFun from 'knex';

class CarritoSQLITE {
  constructor(config){

    this.knex = knexFun(config);
  }

  crearTabla() {
    return this.knex.schema.dropTableIfExists('carritos')
    .then(() => {
      return this.knex.schema.createTable('carritos', table => {
        table.increments('id').primary();
        table.bigInteger('timestamp').notNullable();
        table.json('productos').notNullable();
      })
    })
  }

  async getProductos () {
    const dataDB = await this.knex('carritos').where('id', 1).select();
    if (!dataDB.length) {
      return null;
    } else {
      const carrito = {
        id: dataDB[0].id,
        timestamp: dataDB[0].timestamp,
        productos: JSON.parse(dataDB[0].productos)
      }
      return(carrito)
    }
  }

  async getProducto (id) {
    const dataDB = await this.knex('carritos').where('id', 1).select();
    if (!dataDB.length) return null;

    const auxProducts = JSON.parse(dataDB[0].productos);
    console.log(auxProducts)
    const product = auxProducts.find((producto) => producto.id === parseInt(id))
    console.log(product)

    if (!product) return null

    return product
    
  }

  async postProducto(newProduct) {
    const dataDB = await this.knex('carritos').where('id', 1).select();
    if (!dataDB.length) {
      const newCart = await this.knex('carritos').insert({id: 1, timestamp: Date.now(), productos: `[${JSON.stringify(newProduct)}]`});
      const cart = await this.knex('carritos').where('id', 1).select();
      return newCart
    } else {
      const auxProducts = JSON.parse(dataDB[0].productos);
      auxProducts.push(newProduct);
      const updateCart = await this.knex('carritos').where('id', 1).update({id: 1, timestamp: Date.now(), productos: `${JSON.stringify(auxProducts)}`});
      return updateCart;
    }
  }

  async deleteProducto(id) {
    const dataDB = await this.knex('carritos').where('id', 1).select();
    if (!dataDB.length) {
      return null;
    }

    const auxProducts = JSON.parse(dataDB[0].productos);
    const product = auxProducts.find((producto) => producto.id === parseInt(id))

    if (!product) return null;


    const filterArray = auxProducts.filter(
      (producto) => producto.id != id
    );
    const updateCart = await this.knex('carritos').where('id', 1).update({id: 1, timestamp: Date.now(), productos: `${JSON.stringify(filterArray)}`});
    return updateCart;
  }

  cerrar() {
    return this.knex.destroy()
  }

}

export {CarritoSQLITE};