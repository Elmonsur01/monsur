const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User'); // Create a new file called 'User.js' in a 'models' folder and define the User schema and model in it
const crypto = require('crypto');

const app = express();
const port = 3000;

mongoose
  .connect(
    'mongodb+srv://ajayimonsuru1:C86sVM3lTJGE5ZtJ@cluster0.ggc9guv.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((err) => {
    console.error(err);
  });

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('login');
});

app.post('/login', async (req, res) => {
  const { name, age, result } = req.body;
  const algorithm = 'aes-256-cbc'; // We'll use AES encryption with a 256-bit key and CBC mode
  const key = crypto.randomBytes(32); // Generate a random encryption key
  const iv = crypto.randomBytes(16); // Generate a random initialization vector

  // Encrypt the input from the request body using the key and IV
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let medical_history = cipher.update(req.body.medical_history, 'utf8', 'hex');
  medical_history += cipher.final('hex');

  const user = new User({ name, age, medical_history, result });
  try {
    await user.save();

    // Decrypt the encrypted input using the key and IV
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(medical_history, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    res.send(
      `Welcome ${name}!  Your encrypted medical history is "${medical_history}" dnd the decrypted version is "${decrypted}"`
    );
  } catch (err) {
    console.error(err);
    res.status(500).send('Error saving user');
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
