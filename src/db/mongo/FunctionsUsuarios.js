import { DaoUsuarios } from "./Schema";
import { logger } from "../../logger";

/* CARRITOS FUNCTIONS */

const getUsuarios = async () => {
  try {
    const data = await DaoUsuarios.find({});
    return data;
  } catch (error) {
    logger.log(
      "error",
      "Error al obtener usuarios de la base de datos: ",
      error
    );
  }
};

const postUsuario = async (newUser) => {
  try {
    const user = await DaoUsuarios.create(newUser);
    return user;
  } catch (error) {
    logger.log(
      "error",
      "Error al insertar nuevo usuario en la base de datos: ",
      error
    );
  }
};

const UsuariosMongoCloud = {
  getUsuarios,
  postUsuario,
};

export { UsuariosMongoCloud };
