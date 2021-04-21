import express from 'express';
import { routerApi } from './RouterApi.js';

const app = express();
app.use('/api', routerApi);

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/', express.static('public'))

const PORT = 8080;

const server = app.listen(PORT, () => {
  console.log(`servidor inicializado en ${server.address().port}`)
})

server.on("error", error => console.log(`error en el servidor: ${error.message}`))