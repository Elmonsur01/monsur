const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  age: String,
  medical_history: String,
  result: String,
});

module.exports = mongoose.model('User', userSchema);
