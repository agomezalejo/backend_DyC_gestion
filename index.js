const express = require('express');
const { sequelize } = require('./models/index');
const apiRoutes = require('./routes/api');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const fileUpload = require('express-fileupload');
const app = express();


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


app.use(cors());
app.options('*', cors());

app.use(fileUpload({
    useTempFiles:true,
    tempFileDir:'/tmp/'
  }));
  
app.use(helmet());

sequelize.sync({ force: false })
  .then(() => {
    console.log('Base de datos sincronizada');
  })
  .catch(err => {
    console.error('Error al sincronizar la base de datos:', err);
  });

app.use(express.static(path.join(__dirname, 'public')));


app.use('/api',apiRoutes);;


// Welcome
app.use('/',function(err, req, res, next) {
    res.render('index', {

    });
  });

// 404 Error
app.use((req, res, next) => {
    res.status(404).send("Sorry can't find that!");
  });


// Error 500 para desarrollo
if (process.env.state === 'dev') {
  app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
          message: err.message,
          error: err
      });
  });
}

// Error 505 para produccion
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  console.log(err.message);
  res.render('error', {
      message:'Ops hubo un error',
      error: {}
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor en ejecución en el puerto ${PORT}`);
});
