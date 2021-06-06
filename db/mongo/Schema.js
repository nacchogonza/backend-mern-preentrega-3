import mongoose from 'mongoose';

/* SCHEMAS */

const carritosSchema = new mongoose.Schema({
  id: {
      type: Number,
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
      max: 100
  },
  description: {
    type: String,
    require: true,
    max: 100
},
  price: {
      type: Number,
      require: true,
  },
  thumbnail: {
    type: String,
    require: true,
    max: 255
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

/* MODELS */

const DaoCarritos = mongoose.model('carritos', carritosSchema);
const DaoProductos = mongoose.model('productos', productosSchema);


export { DaoCarritos, DaoProductos }



