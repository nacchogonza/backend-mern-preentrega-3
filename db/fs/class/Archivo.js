class Archivo {
  constructor(nombre) {
    this.nombre = nombre
  }

  async leer () {
    try {
      const data = await fs.promises.readFile(`./${this.nombre}`, 'utf-8')
      console.log(data)
      return data;
    } catch (error) {
      if (error.code == 'ENOENT') {
        console.log([]);
        return [];
      }
      console.log('Error en la funcion leer: ', error);
    }
  }

  async guardar (title, price, thumbnail) {
    const producto = {
      title,
      price,
      thumbnail
    }
    try {
      const data = await this.leer();
      if (data && !data.length){
        producto.id = 1;
        await fs.promises.writeFile(`./${this.nombre}`, JSON.stringify([producto]))
      } else {
        const dataJson = JSON.parse(data);
        producto.id = dataJson.length + 1;
        dataJson.push(producto);
        await fs.promises.writeFile(`./${this.nombre}`, JSON.stringify(dataJson))
      }
    } catch (error) {
      console.log('Error en la funcion guardar: ', error);
    }
  }

  async borrar () {
    try {
      await fs.promises.unlink(`./${this.nombre}`)
      console.log(`Archivo ${this.nombre} borrado`)
    } catch (error) {
      console.log('Error en la funcion borrar: ', error)
    }
  }
}