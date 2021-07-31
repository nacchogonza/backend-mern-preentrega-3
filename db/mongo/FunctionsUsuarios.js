
import { DaoUsuarios } from './Schema'

/* CARRITOS FUNCTIONS */

const getUsuarios = async  () => {
  try {
    const data = await DaoUsuarios.find({});
    return data
  } catch (error) {
    console.log('Error al obtener usuarios de la base de datos: ', error); 
  }
}

const postUsuario = async (newUser) => {
  try {
    const user = await DaoUsuarios.create(newUser);
    return user
  } catch (error) {
    console.log('Error al insertar nuevo usuario en la base de datos: ', error); 
  }
}

const UsuariosMongoCloud = {
  getUsuarios,
  postUsuario
}

export { UsuariosMongoCloud }