const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  cedula: { type: String, required: true },
  password: { type: String, required: true },
  // Otros campos que desees almacenar
});

module.exports = mongoose.model('User', userSchema);













































