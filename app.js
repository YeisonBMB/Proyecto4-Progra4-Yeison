var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'mi-secreto',
  resave: false,
  saveUninitialized: true
}));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// Ruta para la página de inicio de sesión
app.get('/login', (req, res) => {
  res.render('login');
});

// Ruta para el manejo del inicio de sesión
app.post('/login', async (req, res) => {
  const { cedula, password } = req.body;

  try {
    // Busca el usuario en la base de datos por cédula y contraseña
    const user = await User.findOne({ cedula, password });

    if (user) {
      // Inicia sesión y redirige al usuario a la página de compras
      req.session.user = user;
      res.redirect('/compras');
    } else {
      // No se encontró el usuario, muestra un mensaje de error
      res.render('login', { error: 'Cédula o contraseña incorrecta' });
    }
  } catch (error) {
    console.error(error);
    res.render('login', { error: 'Error en el inicio de sesión' });
  }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
