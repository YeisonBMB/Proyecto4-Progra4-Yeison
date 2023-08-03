var express = require('express');
var router = express.Router();


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
  
});
// Importa el modelo User
const User = require('../models/user'); // Asegúrate de que la ruta al modelo sea correcta

// Maneja la solicitud POST del formulario de registro
router.post('/registro', async function(req, res, next) {
  const { cedula, password } = req.body;

  try {
    // Verifica si el usuario ya existe en la base de datos
    const existingUser = await User.findOne({ cedula });

    if (existingUser) {
      // El usuario ya existe
      res.send('El usuario ya está registrado');
    } else {
      // Crea un nuevo usuario en la base de datos
      const newUser = new User({
        cedula,
        password,
        // Otros campos que desees guardar
      });

      // Guarda el nuevo usuario en la base de datos
      await newUser.save();

      // Redirige a una página de éxito o a otra parte de tu aplicación
      res.redirect('/login'); // Cambia '/exito' a la ruta que deseas redirigir
    }
  } catch (error) {
    console.error(error);
    res.send('Error en el registro');
  }
});

// routes/users.js
const bcrypt = require('bcryptjs');

// ...

router.post('/login', async function(req, res, next) {
  const { cedula } = req.body;

  try {
    const user = await User.findOne({ cedula });

    if (user) {
      // Usuario encontrado, redirige a la página de compras
      res.redirect('/compras'); // Cambia '/compras' a la ruta que deseas redirigir
    } else {
      // Usuario no encontrado
      res.send('Usuario no encontrado');
    }
  } catch (error) {
    console.error(error);
    res.send('Error en el inicio de sesión');
  }
});

//COMPRAS
const Compra = require('../models/compra'); // Asegúrate de importar tu modelo de Compra aquí
const listaDeProductos = [/* ... */]; // Asegúrate de tener esta lista
router.post('/compras', async function(req, res, next) {
  const { cedula, producto, detalle, cantidad } = req.body;

  try {
    // Guardar la compra en la colección "compras"
    const nuevaCompra = new Compra({
      cedula,
      producto,
      detalle,
      cantidad,
    });
    await nuevaCompra.save();

    // Mostrar el mensaje de éxito en la página
    res.render('compras', { cedula: '', productos: listaDeProductos, compraExitosa: true });
  } catch (error) {
    console.error(error);
    res.send('Error al realizar la compra');
  }
});

module.exports = router;

