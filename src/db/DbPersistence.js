import { ProductosMemory } from "./memory/Productos";
import { CarritosMemory } from "./memory/Carrito";

import { connectCloudDB } from "./mongo/cloud/Connection";
/* import { connectLocalDB } from "./mongo/local/Connection"; */
import { ProductosMongoCloud } from "./mongo/FunctionsProductos";
import { CarritosMongoCloud } from "./mongo/FunctionsCarritos";
import { UsuariosMongoCloud } from "./mongo/FunctionsUsuarios";


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

      case 2: // MONGO CLOUD
        connectCloudDB();

        return {
          carrito: CarritosMongoCloud,
          productos: ProductosMongoCloud,
          usuarios: UsuariosMongoCloud
        };
    }
  }
}
