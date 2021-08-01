import express from "express";
import { DbPersistence } from "./db/DbPersistence";
import { routerApi } from "./router/RouterApi";
import { routerCarrito } from "./router/RouterCarrito";

/* PASSPORT */
import bCrypt from "bcrypt";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import { sendGmailEmail } from "./senderGmail";

import { logger } from "./logger";

const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true };
const URL =
  "mongodb+srv://root:root@cluster0.j4zse.mongodb.net/ecommerce?retryWrites=true&w=majority";

/* DEFINICION DEL TIPO DE PERSISTENCIA POR CONSTANTE */
const persistenceType = 2;

const persistence = new DbPersistence();
const { productos, carrito, usuarios } =
  persistence.getPersistence(persistenceType);
export { productos, carrito, usuarios };

const createHash = (password) => {
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};

const isValidPassword = (user, password) => {
  return bCrypt.compareSync(password, user.password);
};

const MAIL_ADMIN = "nachomgonzalez93@gmail.com";
const SMS_ADMIN = "+542945404287";

/* LOGIN Y REGISTRO */

passport.use(
  "register",
  new LocalStrategy(
    { passReqToCallback: true },
    async (req, username, password, done) => {
      const { nombre, direccion, edad, telefono, avatar } = req.body;

      const usersDb = await usuarios.getUsuarios();

      const usuario = usersDb.find((usuario) => usuario.username == username);
      if (usuario) {
        // return done('Usuario ya registrado')
        return done(null, false, { message: "Usuario ya registrado" });
      }

      const hashPassword = createHash(password);

      const user = {
        username,
        password: hashPassword,
        nombre,
        direccion,
        edad,
        telefono,
        avatar,
      };
      await usuarios.postUsuario(user);

      const mailOptionsGmail = {
        from: "Servidor Eccomerce",
        to: MAIL_ADMIN,
        subject: "Nuevo Registro de Usuario",
        html: `
      <h2>Nuevo Usuario Registrado!</h2>
      <p>Usuario: ${user.username}</p>
      <p>Nombre Completo: ${user.nombre}</p>
      <p>Direccion: ${user.direccion}</p>
      <p>Edad: ${user.edad}</p>
      <p>Telefono: ${user.telefono}</p>
      <p>Avatar:</p>
      <img style="width: 5rem; height: 5rem;" src="${user.avatar}" />
    `,
      };

      sendGmailEmail(mailOptionsGmail);

      return done(null, user);
    }
  )
);

passport.use(
  "login",
  new LocalStrategy(async (username, password, done) => {
    const usersDb = await usuarios.getUsuarios();

    const user = usersDb.find((usuario) => usuario.username == username);

    if (!user) {
      return done(null, false);
    }

    if (!isValidPassword(user, password)) {
      return done(null, false);
    }

    return done(null, user);
  })
);

passport.serializeUser(function (user, done) {
  done(null, user.username);
});

passport.deserializeUser(async function (username, done) {
  const usersDb = await usuarios.getUsuarios();
  const usuario = usersDb.find((usuario) => usuario.username == username);
  done(null, usuario);
});

/* LOGIN Y REGISTRO */
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  session({
    store: MongoStore.create({
      mongoUrl: URL,
      mongoOptions: advancedOptions,
    }),
    secret: "shhhhhhhhhhhhhhhhhhhhh",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 /* TIEMPO DE SESION: 10 MINUTOS */,
    },
  })
);

app.use("/api", routerApi);
app.use("/api", routerCarrito);

app.use(passport.initialize());
app.use(passport.session());

app.use("/", express.static("public"));

function isAuth(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/loginPage");
  }
}

app.get("/", isAuth, async (req, res) => {
  res.redirect("/home.html");
});

/* LOGIN, LOGOUT & REGISTER ROUTES */
app.post(
  "/login",
  passport.authenticate("login", {
    failureRedirect: "/faillogin",
    successRedirect: "/home",
  })
);

app.get("/loginPage", (req, res) => {
  res.redirect("/login.html");
});

app.get("/faillogin", (req, res) => {
  res.redirect("/login-error.html");
});

app.get("/logout", async (req, res) => {
  req.logout();
  req.session.destroy((err) => {
    res.redirect("/");
  });
});

app.get("/user-info", isAuth, async (req, res) => {
  const user = req.session.passport.user;
  const usersDb = await usuarios.getUsuarios();

  const usuario = usersDb.find((usuario) => usuario.username == user);
  if (usuario) {
    res.send(usuario);
  } else {
    res.send({ error: "usuario no logueado" });
  }
});

app.get("/register", (req, res) => {
  res.render("pages/register");
});

app.post(
  "/register",
  passport.authenticate("register", {
    failureRedirect: "/failregister",
    successRedirect: "/home",
  })
);

app.get("/failregister", (req, res) => {
  res.redirect("/register-error.html");
});

/* LOGIN, LOGOUT & REGISTER */

app.get("/home", isAuth, async (req, res) => {
  res.redirect("/home.html");
});

// Handle error para rutas invalidas
app.get("/*", function (req, res) {
  res.json({
    error: -2,
    descripcion: `ruta '${req.url}' método '${req.method}' no implementada`,
  });
});

const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => {
  logger.log('info', `servidor inicializado en ${server.address().port}`);
});

server.on("error", (error) =>
  logger.log('error', `error en el servidor: ${error.message}`)
);
