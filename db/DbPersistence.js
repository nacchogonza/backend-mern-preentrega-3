import { ProductosFS } from "./fs/class/ProductosFS";
import { CarritoFS } from "./fs/class/CarritoFS"

import { ProductosMYSQL } from './mysql/local/ProductosMYSQL'
import { CarritoMYSQL } from './mysql/local/CarritoMYSQL'

import { ProductosSQLITE } from './sqlite/ProductosSQLITE'
import { CarritoSQLITE } from './sqlite/CarritoSQLITE'


export class DbPersistence {
  constructor() {}

  getPersistence (persistenceId) {
    switch (persistenceId) {
      case 1:
        const productosFS = new ProductosFS();
        const carritoFS = new CarritoFS();
        return {
          carrito: carritoFS,
          productos: productosFS
        };

      case 2:
        const productosMYSQL = new ProductosMYSQL({
          client: 'mysql',
          connection: {
            host: 'localhost',
            port: 3307,
            user: 'root',
            password: '',
            database: 'ecommerce'
          }
        });

        const carritoMYSQL = new CarritoMYSQL({
          client: 'mysql',
          connection: {
            host: 'localhost',
            port: 3307,
            user: 'root',
            password: '',
            database: 'ecommerce'
          }
        });
        
        productosMYSQL.crearTabla()
        carritoMYSQL.crearTabla()

        return {
          carrito: carritoMYSQL,
          productos: productosMYSQL
        };
        
      case 4: // SQLITE
        //const carritoSQLITE = new CarritoSQLITE();
        const carritoSQLITE = new CarritoSQLITE({
          client: 'sqlite3',
          connection: {
            filename: "./db/sqlite/mydb.sqlite",
          },
          useNullAsDefault: true
        })

        const productosSQLITE = new ProductosSQLITE({
          client: 'sqlite3',
          connection: {
            filename: "./db/sqlite/mydb.sqlite",
          },
          useNullAsDefault: true
        })

        productosSQLITE.crearTabla()
        carritoSQLITE.crearTabla()

        return {
          carrito: carritoSQLITE,
          productos: productosSQLITE
        };
    }
  }
}