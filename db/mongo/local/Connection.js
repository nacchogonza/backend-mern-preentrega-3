import mongoose from 'mongoose';

const URL = 'mongodb://localhost:27017/ecommerce';

export const connectLocalDB = () => {
  try {
    mongoose.connect(URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Base de datos conectada!')
  } catch (error) {
    console.log('Error al conectar a DB: ', error); 
  }
}