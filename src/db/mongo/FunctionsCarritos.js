import { DaoCarritos } from "./Schema";
import { sendGmailEmail } from "../../senderGmail";
import { logger } from "../../logger";
import { sendWpp } from "../../senderWpp";
import { sendSms } from "../../senderSms";

const MAIL_ADMIN = "nachomgonzalez93@gmail.com";
const WPP_ADMIN = "whatsapp:+5492945404287";

/* CARRITOS FUNCTIONS */

const getProductos = async (user) => {
  try {
    const data = await DaoCarritos.findOne({ id: user }, { productos: 1 });
    return data;
  } catch (error) {
    logger.log("error", "Error al obtener productos del carrito: ", error);
  }
};

const getProducto = async (user, id) => {
  try {
    const data = await DaoCarritos.findOne({ id: user }, { productos: 1 });
    if (data && data.productos) {
      const producto = data.productos.find(
        (product) => product.product.id === parseInt(id)
      );
      return producto;
    }
    return null;
  } catch (error) {
    logger.log("error", "Error al obtener productos del carrito: ", error);
  }
};

const postProducto = async (user, newProduct) => {
  const dataDB = await DaoCarritos.findOne({ id: user });
  if (!dataDB) {
    const newCart = await DaoCarritos.create({
      id: user,
      timestamp: Date.now(),
      productos: [{ quantity: 1, product: newProduct }],
    });
    return newCart;
  } else {
    const userCart = await DaoCarritos.findOne({ id: user });
    if (!userCart) return null;
    const auxProducts = userCart.productos;
    const productExists = auxProducts.find(
      (product) => product.product.id === newProduct.id
    );
    if (!productExists) {
      auxProducts.push({ quantity: 1, product: newProduct });
    } else {
      productExists.quantity++;
    }
    const updateCartStatus = await DaoCarritos.updateOne(
      { id: user },
      {
        $set: {
          productos: auxProducts,
        },
      }
    );
    if (updateCartStatus?.ok === 1) {
      const data = await DaoCarritos.findOne({ id: user }, { productos: 1 });
      return data;
    }
    return null;
  }
};

const deleteProducto = async (user, id) => {
  const data = await DaoCarritos.findOne({ id: user }, { productos: 1 });
  if (data && data.productos) {
    const auxProducts = data.productos.filter(
      (product) => product.product.id !== parseInt(id)
    );
    const updateCartStatus = await DaoCarritos.updateOne(
      { id: user },
      {
        $set: {
          productos: auxProducts,
        },
      }
    );
    if (updateCartStatus?.ok === 1) {
      const data = await DaoCarritos.find({ id: user }, { productos: 1 });
      return data;
    }
    return null;
  }
};

const confirmCart = async (user) => {
  const userCart = await DaoCarritos.findOne(
    { id: user.username },
    { productos: 1 }
  );

  if (userCart) {
    const productsList = userCart.productos
      .map(
        (product) =>
          `
      <li>${product.quantity} X ${product.product.title}</li>
      `
      )
      .join("\n");

    const mailOptionsGmail = {
      from: "Servidor Eccomerce",
      to: MAIL_ADMIN,
      subject: `Nuevo pedido de ${user.nombre} (${user.username})`,
      html: `
        <h2>Nuevo Pedido confirmado de ${user.nombre} (${user.username})</h2>
        <h3>Lista de Productos:</h3>
        <ul>
          ${productsList}
        </ul>
      `,
    };

    sendGmailEmail(mailOptionsGmail);

    sendWpp({
      body: `Nuevo pedido de ${user.nombre} (${user.username})`,
      userPhone: WPP_ADMIN,
    });

    sendSms({
      body: `Su pedido a nombre de ${user.username} ha sido recibido correctamente y está siendo procesado`,
      userPhone: user.telefono,
    });

    try {
      const deleteduserCart = await DaoCarritos.findOneAndDelete({
        id: user.username,
      });
      return deleteduserCart;
    } catch (error) {
      logger.log("error", error);
    }
  }
  logger.log("warn", "carrito no encontrado");
  return null;
};

const CarritosMongoCloud = {
  getProductos,
  getProducto,
  postProducto,
  deleteProducto,
  confirmCart,
};

export { CarritosMongoCloud };
