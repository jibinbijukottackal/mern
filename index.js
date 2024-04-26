const express = require('express');
const bodyParser = require('body-parser');
const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');
const HttpError = require('./models/http-error');
const fs = require('fs');
const path = require('path');
const app = express();
const mongoos = require("mongoose");
const cors = require('cors');

app.use('/uploads/images', express.static(path.join('uploads', 'images')));

app.use(bodyParser.json());

app.use(cors());
app.use(cors({
  origin: 'http://localhost:3000'
}));

app.use('/api/places', placesRoutes);
app.use('/api/users', usersRoutes);

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

  next();
});

app.use((req, res, next) => {
  const error = new HttpError('Could not find this route.', 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, err => {
      console.log(err);
    });
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || 'An unknown error occurred!' });
});


app.listen(5000,()=>{
    console.log('Server is running on port 5000');
})

const database = module.exports=()=>{
    const connectionParams = {
        useNewUrlParser : true,
        useUnifiedTopology : true,
    }
    try {
        mongoos.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.o9nsxpv.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`);
        console.log('Database connected successfully')
    } catch (error) {
        console.log(error);
        console.log("Database coonection failed");

    }
}
database();