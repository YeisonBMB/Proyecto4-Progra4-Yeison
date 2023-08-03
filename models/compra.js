const mongoose = require('mongoose');

const compraSchema = new mongoose.Schema({
  cedula: String,
  producto: String,
  detalle: String,
  cantidad: Number,
});

module.exports = mongoose.model('Compra', compraSchema);
