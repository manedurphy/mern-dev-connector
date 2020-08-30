const express = require('express');
const app = express();

// connectDB();
require('./config/db')();

//Middleware

//Body Parser
app.use(express.json({ extended: false }));

app.get('/', (req, res) => {
  res.send('all is working');
});

//Define routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
