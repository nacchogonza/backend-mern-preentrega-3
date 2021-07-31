import express from 'express';
import { DbPersistence } from '../db/DbPersistence';
import { routerApi } from './router/RouterApi';
import { routerCarrito } from './router/RouterCarrito';
import fetch from 'node-fetch';

/* PASSPORT */
import bCrypt from 'bcrypt';
import passport from "passport";
import {Strategy as LocalStrategy} from 'passport-local';

import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from 'connect-mongo';

const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true };
const URL = 'mongodb+srv://root:root@cluster0.j4zse.mongodb.net/ecommerce?retryWrites=true&w=majority';

/* DEFINICION DEL TIPO DE PERSISTENCIA POR CONSTANTE */
const persistenceType = 6;

const persistence = new DbPersistence();
const { productos, carrito, usuarios } = persistence.getPersistence(persistenceType);
export { productos, carrito };

const createHash = (password) => {
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null)
}

const isValidPassword = (user, password) => {
  return bCrypt.compareSync(password, user.password)
}

/* LOGIN Y REGISTRO */

passport.use('register', new LocalStrategy({ passReqToCallback: true }, async (req, username, password, done) => {

  const { nombre, direccion, edad, telefono, avatar } = req.body

  const usersDb = await usuarios.getUsuarios();

  const usuario = usersDb.find(usuario => usuario.username == username)
  if (usuario) {
    return done('Usuario ya registrado')
  }

  const hashPassword = createHash(password);

  const user = {
    username,
    password: hashPassword,
    nombre,
    direccion,
    edad,
    telefono,
    avatar
  }
  await usuarios.postUsuario(user)

  return done(null, user)
}));

passport.use('login', new LocalStrategy(async (username, password, done) => {

  const usersDb = await usuarios.getUsuarios();

  const user = usersDb.find(usuario => usuario.username == username)

  console.log(user)

  if (!user) {
    return done(null, false)
  }

  if (!isValidPassword(user, password)) {
    return done(null, false)
  }

  return done(null, user);
}));

passport.serializeUser(function (user, done) {
  done(null, user.username);
});

passport.deserializeUser(async function (username, done) {
  const usersDb = await usuarios.getUsuarios();
  const usuario = usersDb.find(usuario => usuario.username == username)
  done(null, usuario);
});

/* LOGIN Y REGISTRO */
const app = express();
app.use('/api', routerApi);
app.use('/api', routerCarrito);

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser())

app.use(session({
  store: MongoStore.create({
    mongoUrl: URL,
    mongoOptions: advancedOptions,
  }),
  secret: 'shhhhhhhhhhhhhhhhhhhhh',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 10, /* TIEMPO DE SESION: 10 MINUTOS */
  }
}))

app.use(passport.initialize());
app.use(passport.session());

app.use('/', express.static('public'))

function isAuth(req, res, next) {
  if (req.isAuthenticated()) {
    next()
  } else {
    res.redirect('/loginPage')
  }
}

app.get("/", isAuth, async (req, res) => {
  res.redirect('/home.html')
});

/* LOGIN, LOGOUT & REGISTER ROUTES */
app.post('/login', passport.authenticate('login', { failureRedirect: '/faillogin', successRedirect: '/home' }))

app.get('/loginPage', (req, res) => {
  res.redirect('/login.html')
})

app.get('/faillogin', (req, res) => {
  res.redirect('/login-error.html')
})

app.get("/logout", async (req, res) => {
  req.logout();
  req.session.destroy(err => {
    res.redirect("/")
  });
});

app.get('/register', (req, res) => {
  res.render("pages/register");
})

app.post('/register', passport.authenticate('register', { failureRedirect: '/failregister', successRedirect: '/home' }))

app.get('/failregister', (req, res) => {
  res.redirect("/register-error.html")
})

/* LOGIN, LOGOUT & REGISTER */

app.get("/home", isAuth, async (req, res) => {
  res.redirect('/home.html')
});

// Handle error para rutas invalidas
app.get('/*', function(req, res) {
  res.json({error: -2, descripcion: `ruta '${req.url}' método '${req.method}' no implementada` })
});

const PORT = 8080;

const server = app.listen(PORT, () => {
  console.log(`servidor inicializado en ${server.address().port}`)
})

server.on("error", error => console.log(`error en el servidor: ${error.message}`))
