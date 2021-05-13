import express from 'express';
import { routerApi } from './router/RouterApi';
import { routerCarrito } from './router/RouterCarrito';

const app = express();
app.use('/api', routerApi);
app.use('/api', routerCarrito);

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/', express.static('public'))

// Handle error para rutas invalidas
app.get('/*', function(req, res) {
  res.json({error: -2, descripcion: `ruta '${req.url}' método '${req.method}' no implementada` })
});

const PORT = 8080;

const server = app.listen(PORT, () => {
  console.log(`servidor inicializado en ${server.address().port}`)
})

server.on("error", error => console.log(`error en el servidor: ${error.message}`))