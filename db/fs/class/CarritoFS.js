import fs from "fs";

class CarritoFS {
  constructor() {}

  async getProductos () {
    try {
      const data = await fs.promises.readFile(
        "./db/fs/fs/carrito.txt",
        "utf-8"
      );
      const dataJson = JSON.parse(data);
      if (data) {
        return dataJson;
      }
      return null;
    } catch (error) {
      if (error.code == "ENOENT") {
        return [];
      }
      console.log("Error getProductos: ", error);
    }
  }

  async getProducto(id) {
    try {
      const data = await fs.promises.readFile(
        "./db/fs/fs/carrito.txt",
        "utf-8"
      );
      const dataJson = JSON.parse(data);
      if (data) {
        const product = dataJson.productos.find((producto) => producto.id === parseInt(id))
        return product;
      }
      return null;
    } catch (error) {
      if (error.code == "ENOENT") {
        return [];
      }
      console.log("Error getProductos: ", error);
    }


    const product = this.productos.find((producto) => producto.id === parseInt(id))
    return product;
  }

  async postProducto (product) {
    try {
      const data = await this.getProductos();
      if (!data.length && !data.productos) {
        let carrito = {};
        carrito.id = 1;
        carrito.timestamp = Date.now()
        carrito.productos = []
        carrito.productos.push(product);
        await fs.promises.writeFile(
          './db/fs/fs/carrito.txt',
          JSON.stringify(carrito)
        );
        return carrito
      } else {
        data.productos.push(product);
        await fs.promises.writeFile(
          './db/fs/fs/carrito.txt',
          JSON.stringify(data)
        );
        return data;
      }
    } catch (error) {
      console.log("Error postProducto: ", error);
    }


    this.productos.push(product);
    return product;
  }

  async deleteProducto (id) {
    try {
      const data = await this.getProductos();
      if (data && !data.productos) {
        return null
      } else {
        const product = data.productos.find((producto) => producto.id === parseInt(id))
        if (product) {
          const filterArray = data.productos.filter(
            (producto) => producto.id != id
          );
          data.productos = filterArray;
          await fs.promises.writeFile(
            './db/fs/fs/carrito.txt',
            JSON.stringify(data)
          );
          return product;
        }
      }
    } catch (error) {
      console.log("Error deleteProducto: ", error);
    }



    const product = this.getProducto(id);
    if (product) {
      const filterArray = this.productos.filter(producto => producto.id != id);
      this.productos = filterArray;
    }
    return product;
  }
}

export { CarritoFS };