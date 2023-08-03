
var express = require('express');
var router = express.Router();

/* GET login page. */
router.get('/', function(req, res, next) {
  res.render('login');
});

/* GET register page. */
router.get('/registro', function(req, res, next) {
  res.render('registro');
});

/* POST login data. */
router.post('/login', function(req, res, next) {
  // Procesar inicio de sesión (no implementado en este ejemplo)
  res.send('Inicio de sesión exitoso');
});

/* POST register data. */
router.post('/registro', function(req, res, next) {
  // Procesar registro de usuario (no implementado en este ejemplo)
  res.send('Registro exitoso');
});

router.get('/compras', function(req, res, next) {
  // Renderizar la vista de compras (aún no implementado)
  res.render('compras');
});


const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/miappdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error de conexión a MongoDB:'));
db.once('open', () => {
  console.log('Conexión exitosa a MongoDB');
});

const User = require('../models/user'); // Asegúrate de que la ruta sea correcta

// ...

router.post('/registro', async function(req, res, next) {
  const { cedula, password } = req.body;

  try {
    const newUser = new User({ cedula, password });
    await newUser.save();
    res.send('Registro exitoso');
  } catch (error) {
    console.error(error);
    res.send('Error en el registro');
  }
});

// ...

router.post('/login', async function(req, res, next) {
  const { cedula, password } = req.body;

  try {
    const user = await User.findOne({ cedula });
    if (user && user.password === password) {
      // Inicio de sesión exitoso
      res.redirect('/compras'); // Redirigir a la página de compras
    } else {
      res.send('Credenciales incorrectas');
    }
  } catch (error) {
    console.error(error);
    res.send('Error en el inicio de sesión');
  }
});

// ...
const Compra = require('../models/compra'); // Asegúrate de que la ruta sea correcta

// ...

router.get('/compras', async function(req, res, next) {
  try {
    // Obtener todas las compras de la base de datos
    const compras = await Compra.find();

    res.render('compras', { cedula: '', productos: listaDeProductos, compras });
  } catch (error) {
    console.error(error);
    res.send('Error al obtener las compras');
  }
});

router.post('/compras', async function(req, res, next) {
  const { cedula, producto, detalle, cantidad } = req.body;

  // Buscar el precio del producto seleccionado
  const productoInfo = listaDeProductos.find(p => p.value === producto);
  const precioUnitario = productoInfo ? productoInfo.precio : 0;

  // Calcular el precio total
  const precioTotal = precioUnitario * cantidad;

  try {
    // Guardar la compra en la colección "compras"
    const nuevaCompra = new Compra({
      cedula,
      producto,
      detalle,
      cantidad,
      precioTotal,
    });
    await nuevaCompra.save();

    // Redirigir a la página de compras con los datos actualizados
    res.redirect('/compras');
  } catch (error) {
    console.error(error);
    res.send('Error al realizar la compra');
  }
});


module.exports = router;
