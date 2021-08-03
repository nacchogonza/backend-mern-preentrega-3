import express from 'express';
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bCrypt from "bcrypt";

import { usuarios } from '../index'
import { sendGmailEmail } from "../senderGmail";

const createHash = (password) => {
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};

const isValidPassword = (user, password) => {
  return bCrypt.compareSync(password, user.password);
};

const MAIL_ADMIN = "nachomgonzalez93@gmail.com";

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

const routerOnboarding = express.Router();
routerOnboarding.use(express.json())
routerOnboarding.use(express.urlencoded({extended: true}));

function isAuth(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/loginPage");
  }
}

routerOnboarding.get("/", isAuth, async (req, res) => {
  res.redirect("/home.html");
});

/* LOGIN, LOGOUT & REGISTER ROUTES */
routerOnboarding.post(
  "/login",
  passport.authenticate("login", {
    failureRedirect: "/faillogin",
    successRedirect: "/home",
  })
);

routerOnboarding.get("/loginPage", (req, res) => {
  res.redirect("/login.html");
});

routerOnboarding.get("/faillogin", (req, res) => {
  res.redirect("/login-error.html");
});

routerOnboarding.get("/logout", async (req, res) => {
  req.logout();
  req.session.destroy((err) => {
    res.redirect("/");
  });
});

routerOnboarding.get("/user-info", isAuth, async (req, res) => {
  const user = req.session.passport.user;
  if (!user) {
    res.json({ error: "usuario no logueado" });
  }
  const usersDb = await usuarios.getUsuarios();

  const usuario = usersDb.find((usuario) => usuario.username == user);
  if (usuario) {
    res.send(usuario);
  } else {
    res.send({ error: "usuario no logueado" });
  }
});

routerOnboarding.get("/register", (req, res) => {
  res.render("pages/register");
});

routerOnboarding.post(
  "/register",
  passport.authenticate("register", {
    failureRedirect: "/failregister",
    successRedirect: "/home",
  })
);

routerOnboarding.get("/failregister", (req, res) => {
  res.redirect("/register-error.html");
});

/* LOGIN, LOGOUT & REGISTER */

routerOnboarding.get("/home", isAuth, async (req, res) => {
  res.redirect("/home.html");
});

export { routerOnboarding };