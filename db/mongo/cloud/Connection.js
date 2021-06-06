import mongoose from 'mongoose';

const URL = 'mongodb+srv://root:root@cluster0.j4zse.mongodb.net/ecommerce?retryWrites=true&w=majority';

export const connectCloudDB = () => {
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