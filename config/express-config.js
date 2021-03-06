const express = require('express');
const consign = require('consign');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const morgan = require('morgan');
const dotenv = require('dotenv').config();
const cors = require('cors')
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const Logger = require('../services/Logger');
const swaggerDocument = require('../swagger.json');

module.exports = () => {
  const app = express();

  app.disable('x-powered-by');

  app.use(cors());

  app.use(morgan('common', {
    stream: {
      write: (message) => Logger.info(message)
    }
  }));
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(expressValidator());


  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.use('/static', express.static('public/dist-storybook/static/'));
  app.use('/static', express.static('public'));
  consign({
    verbose: false,
  })
    .include('services')
    .then('controller')
    .then('routes')
    .into(app);

  return app;
}
