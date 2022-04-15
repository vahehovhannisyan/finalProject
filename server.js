
require('dotenv').config();

const express = require ('express');
const app = express();

const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
    swaggerDefinition: {
      info: {
        version: "1.0.0",
        title: "Customer API",
        description: "Customer API Information",
        contact: {
          name: "Amazing Developer"
        },
        servers: ["http://localhost:5000"]
      }
    },
    // ['.routes/*.js']
    apis: ["app.js"]
  };

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
/**
 * @swagger
 * /customers:
 *  get:
 *    description: Use to request all customers
 *    responses:
 *      '200':
 *        description: A successful response
 */

   




const bodyParser = require('body-parser');
const routes = require('./routes/index.route');

const errorHandlerMiddleware = require('./middleware/errorHandler.middleware');
const notFoundMiddleware = require('./middleware/notFound.middleware');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(routes);


app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = 4000
app.listen(port, () => {
    console.log(`Server up on http://localhost:${port}`)
})