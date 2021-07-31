import { ProductosMemory } from "./memory/Productos";
import { CarritosMemory } from "./memory/Carrito";

import { ProductosFS } from "./fs/class/ProductosFS";
import { CarritoFS } from "./fs/class/CarritoFS";

import { ProductosMYSQL } from "./mysql/local/ProductosMYSQL";
import { CarritoMYSQL } from "./mysql/local/CarritoMYSQL";

import { ProductosSQLITE } from "./sqlite/ProductosSQLITE";
import { CarritoSQLITE } from "./sqlite/CarritoSQLITE";

import { connectCloudDB } from "./mongo/cloud/Connection";
/* import { connectLocalDB } from "./mongo/local/Connection"; */
import { ProductosMongoCloud } from "./mongo/FunctionsProductos";
import { CarritosMongoCloud } from "./mongo/FunctionsCarritos";
import { UsuariosMongoCloud } from "./mongo/FunctionsUsuarios";

import { ProductosFirebase } from "./firebase/ProductosFirebase";
import { CarritosFirebase } from "./firebase/CarritosFirebase";

export class DbPersistence {
  constructor() {}

  getPersistence(persistenceId) {
    switch (persistenceId) {
      case 0: // MEMORY
        const productosMemory = new ProductosMemory();
        const carritoMemory = new CarritosMemory();
        return {
          carrito: carritoMemory,
          productos: productosMemory,
        };

      case 1: // FILE SYSTEM
        const productosFS = new ProductosFS();
        const carritoFS = new CarritoFS();
        return {
          carrito: carritoFS,
          productos: productosFS,
        };

      case 2: // MYSQL LOCAL
        const productosMYSQL = new ProductosMYSQL({
          client: "mysql",
          connection: {
            host: "localhost",
            port: 3307,
            user: "root",
            password: "",
            database: "ecommerce",
          },
        });

        const carritoMYSQL = new CarritoMYSQL({
          client: "mysql",
          connection: {
            host: "localhost",
            port: 3307,
            user: "root",
            password: "",
            database: "ecommerce",
          },
        });

        productosMYSQL.crearTabla();
        carritoMYSQL.crearTabla();

        return {
          carrito: carritoMYSQL,
          productos: productosMYSQL,
        };

      case 3: // MYSQL CLOUD
        const productosMYSQLCloud = new ProductosMYSQL({
          client: "mysql",
          connection: {
            host: "url:toCloud",
            port: 3306,
            user: "root",
            password: "",
            database: "ecommerce",
          },
        });

        const carritoMYSQLCloud = new CarritoMYSQL({
          client: "mysql",
          connection: {
            host: "url:toCloud",
            port: 3306,
            user: "root",
            password: "",
            database: "ecommerce",
          },
        });

        productosMYSQL.crearTabla();
        carritoMYSQL.crearTabla();

        return {
          carrito: carritoMYSQLCloud,
          productos: productosMYSQLCloud,
        };

      case 4: // SQLITE
        const carritoSQLITE = new CarritoSQLITE({
          client: "sqlite3",
          connection: {
            filename: "./db/sqlite/mydb.sqlite",
          },
          useNullAsDefault: true,
        });

        const productosSQLITE = new ProductosSQLITE({
          client: "sqlite3",
          connection: {
            filename: "./db/sqlite/mydb.sqlite",
          },
          useNullAsDefault: true,
        });

        productosSQLITE.crearTabla();
        carritoSQLITE.crearTabla();

        return {
          carrito: carritoSQLITE,
          productos: productosSQLITE,
        };

      case 5: // MONGO LOCAL
        /* connectLocalDB();

        return {
          carrito: CarritosMongoCloud,
          productos: ProductosMongoCloud,
        }; */

      case 6: // MONGO CLOUD
        connectCloudDB();

        return {
          carrito: CarritosMongoCloud,
          productos: ProductosMongoCloud,
          usuarios: UsuariosMongoCloud
        };

      case 7: // FIREBASE
        return {
          carrito: CarritosFirebase,
          productos: ProductosFirebase,
        };
    }
  }
}
