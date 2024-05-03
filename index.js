// index.js
// where your node app starts

// init project
var express = require('express');
const moment = require('moment');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get('/api', (req, res) => {
  // Obtener la fecha y hora actuales
  const currentDate = new Date();
  
  // Crear el objeto de respuesta
  const resultado = {
    unix: currentDate.getTime(),
    utc: currentDate.toUTCString()
  };

  // Devolver el objeto de respuesta como JSON
  res.json(resultado);
});

// your first API endpoint... 
app.get('/api/:date', (req, res) => {
  let dateParam = req.params.date;

  // Si el parámetro está vacío, obtener la hora actual
  if (!dateParam) {
    dateParam = new Date();
  }

  let unixTime, utcTime, isValid;

  // Verificar si el parámetro es un timestamp UNIX o una fecha en formato YYYY-MM-DD
  if (!isNaN(dateParam)) { // Si es un número, asumimos que es un timestamp UNIX
    unixTime = parseInt(dateParam);
    utcTime = moment(unixTime).utc().format('ddd, DD MMM YYYY HH:mm:ss [GMT]');
    isValid = true;
  } else { // Si no es un número, intentamos parsearlo como fecha
    const parsedDate = new Date(dateParam);
    if (parsedDate.toString() === 'Invalid Date') {
      isValid = false;
    } else {
      unixTime = parsedDate.getTime();
      utcTime = moment(parsedDate).utc().format('ddd, DD MMM YYYY HH:mm:ss [GMT]');
      isValid = true;
    }
  }

  // Crear el objeto de respuesta
  let resultado;
  if (isValid) {
    resultado = {
      unix: unixTime,
      utc: utcTime
    };
  } else {
    resultado = {
      error: "Invalid Date"
    };
  }

  res.json(resultado);
});



// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
