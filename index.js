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
  let medical_history = crypto
    .createHash('sha256')
    .update(req.body.medical_history)
    .digest('hex');

  const user = new User({ name, age, medical_history, result });
  try {
    await user.save();
    res.send(`Welcome ${name}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error saving user');
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
