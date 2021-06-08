import fs from "fs";

class ProductosFS {
  constructor() {}

  async getProductos(filterParams) {
    try {
      const data = await fs.promises.readFile(
        "./db/fs/fs/productos.txt",
        "utf-8"
      );
      let filterArray = JSON.parse(data);
      if (filterParams.name) {
        const filterArrayName = filterArray.filter(product => filterParams.name === product.title)
        filterArray = filterArrayName
      }
      if (filterParams.code) {
        const filterArrayCode = filterArray.filter(product => filterParams.code == product.code)
        filterArray = filterArrayCode
      }
      if (filterParams.price_min && filterParams.price_max) {
        const filterArrayPrice = filterArray.filter(product => product.price >= filterParams.price_min && product.price <= filterParams.price_max)
        filterArray = filterArrayPrice
      }
      if (filterParams.stock_min && filterParams.stock_max) {
        const filterArrayStock = filterArray.filter(product => product.stock >= filterParams.stock_min && product.stock <= filterParams.stock_max)
        filterArray = filterArrayStock
      }
      return filterArray;
    } catch (error) {
      if (error.code == "ENOENT") {
        console.log([]);
        return [];
      }
      console.log("Error getProductos: ", error);
    }
  }

  async getProducto(id) {
    try {
      const data = await fs.promises.readFile(
        "./db/fs/fs/productos.txt",
        "utf-8"
      );
      const dataJson = JSON.parse(data);
      const product = dataJson.find((producto) => producto.id === parseInt(id));
      return product;
    } catch (error) {
      if (error.code == "ENOENT") {
        console.log([]);
        return [];
      }
      console.log("Error getProducto(id): ", error);
    }
  }

  async postProducto(producto) {
    try {
      const data = await this.getProductos();
      if (data && !data.length) {
        producto.id = 1;
        await fs.promises.writeFile(
          './db/fs/fs/productos.txt',
          JSON.stringify([producto])
        );
        return producto
      } else {
        producto.id = data.length + 1;
        data.push(producto);
        await fs.promises.writeFile(
          './db/fs/fs/productos.txt',
          JSON.stringify(data)
        );
        return producto;
      }
    } catch (error) {
      console.log("Error postProducto: ", error);
    }
  }

  async putProducto(productUpdate, id) {
    try {
      const data = await this.getProductos();
      if (data && !data.length) {
        return null
      } else {
        const product = data.find((producto) => producto.id === parseInt(id))
        if (product) {
          if (productUpdate.title) product.title = productUpdate.title;
          if (productUpdate.price) product.price = productUpdate.price;
          if (productUpdate.thumbnail) product.thumbnail = productUpdate.thumbnail;
          if (productUpdate.description)
            product.description = productUpdate.description;
          if (productUpdate.code) product.code = productUpdate.code;
          if (productUpdate.stock) product.stock = productUpdate.stock;
        }
        await fs.promises.writeFile(
          './db/fs/fs/productos.txt',
          JSON.stringify(data)
        );
        return product;
      }
    } catch (error) {
      console.log("Error putProducto: ", error);
    }
  }

  async deleteProducto(id) {
    try {
      const data = await this.getProductos();
      if (data && !data.length) {
        return null
      } else {
        const product = data.find((producto) => producto.id === parseInt(id))
        if (product) {
          const filterArray = data.filter(
            (producto) => producto.id != id
          );
          await fs.promises.writeFile(
            './db/fs/fs/productos.txt',
            JSON.stringify(filterArray)
          );
          return product;
        }
      }
    } catch (error) {
      console.log("Error deleteProducto: ", error);
    }
  }
}

export { ProductosFS};
