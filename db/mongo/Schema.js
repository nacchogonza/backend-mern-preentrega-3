import mongoose from "mongoose";

/* SCHEMAS */

const carritosSchema = new mongoose.Schema({
  id: {
    type: String,
    max: 100,
    unique: true,
    require: true,
  },
  timestamp: {
    type: Number,
    require: true,
  },
  productos: {
    type: Array,
    require: true,
  },
});

const productosSchema = new mongoose.Schema({
  id: {
    type: Number,
    require: true,
  },
  title: {
    type: String,
    require: true,
    max: 100,
  },
  description: {
    type: String,
    require: true,
    max: 100,
  },
  price: {
    type: Number,
    require: true,
  },
  thumbnail: {
    type: String,
    require: true,
    max: 255,
  },
  code: {
    type: Number,
    require: true,
  },
  stock: {
    type: Number,
    require: true,
  },
  timestamp: {
    type: Date,
    require: true,
  },
});

const usuariosSchema = new mongoose.Schema({
  username: {
    type: String,
    require: true,
    max: 100,
    unique: true,
  },
  password: {
    type: String,
    require: true,
    max: 200,
  },
  nombre: {
    type: String,
    require: true,
    max: 100,
  },
  direccion: {
    type: String,
    require: true,
    max: 100,
  },
  edad: {
    type: Number,
    require: true,
  },
  telefono: {
    type: String,
    require: true,
    max: 50,
  },
  avatar: {
    type: String,
    require: true,
    max: 100,
  },
});

/* MODELS */

const DaoCarritos = mongoose.model("carritos", carritosSchema);
const DaoProductos = mongoose.model("productos", productosSchema);
const DaoUsuarios = mongoose.model("usuarios", usuariosSchema);

export { DaoCarritos, DaoProductos, DaoUsuarios };
