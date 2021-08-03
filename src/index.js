import express from "express";
import cluster from "cluster";
import os from "os";
import { DbPersistence } from "./db/DbPersistence";
import { routerApi } from "./router/RouterApi";
import { routerCarrito } from "./router/RouterCarrito";
import { routerOnboarding } from "./router/RouterOnboarding";

import dotenv from "dotenv";

/* PASSPORT */

import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";

import { logger } from "./logger";

dotenv.config()
const persistence = new DbPersistence();
const { productos, carrito, usuarios } = persistence.getPersistence();

export { productos, carrito, usuarios };

const numCPUs = os.cpus().length;

/* CLUSTER MODE CONST */
const MODE_CLUSTER = false;

if (MODE_CLUSTER && cluster.isMaster) {
  logger.log("info", `Numero de CPUs: ${numCPUs}`);
  logger.log("info", `PID MASTER ${process.pid}`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker) => {
    console.log(
      "Worker",
      worker.process.pid,
      "died",
      new Date().toLocaleString()
    );
    cluster.fork();
  });
} else {
  const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true };
  const URL = process.env.MONGO_URL;

  

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

  app.use(passport.initialize());
  app.use(passport.session());

  app.use("/api", routerApi);
  app.use("/api", routerCarrito);
  app.use("/", routerOnboarding);


  app.use("/", express.static("public"));

  // Handle error para rutas invalidas
  app.get("/*", function (req, res) {
    res.json({
      error: -2,
      descripcion: `ruta '${req.url}' método '${req.method}' no implementada`,
    });
  });

  const PORT = process.env.PORT || 8080;

  const server = app.listen(PORT, () => {
    logger.log("info", `servidor inicializado en ${server.address().port}`);
  });

  server.on("error", (error) =>
    logger.log("error", `error en el servidor: ${error.message}`)
  );
}
