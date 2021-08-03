import { connectCloudDB } from "./mongo/cloud/Connection";
/* import { connectLocalDB } from "./mongo/local/Connection"; */
import { ProductosMongoCloud } from "./mongo/FunctionsProductos";
import { CarritosMongoCloud } from "./mongo/FunctionsCarritos";
import { UsuariosMongoCloud } from "./mongo/FunctionsUsuarios";

export class DbPersistence {
  constructor() {}

  getPersistence() {
    connectCloudDB();

    return {
      carrito: CarritosMongoCloud,
      productos: ProductosMongoCloud,
      usuarios: UsuariosMongoCloud,
    };
  }
}
