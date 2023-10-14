// import express from 'express';
import { dbConnection, closeConnection} from "./config/mongoConnection.js";

// const app = express();
// // import configRoutes from './routes/index.js';
// import { fileURLToPath } from 'url';
// import { dirname } from 'path';
// import exphbs from 'express-handlebars';
// import session from 'express-session';
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// const staticDir = express.static(__dirname + '/public');

// const rewriteUnsupportedBrowserMethods = (req, res, next) => {
//   if (req.body && req.body._method) {
//     req.method = req.body._method;
//     delete req.body._method;
//   }

//   next();
// };

// app.use('/public', staticDir);
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(rewriteUnsupportedBrowserMethods);

// app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }));
// app.set('view engine', 'handlebars');

// configRoutes(app);
const database = await dbConnection();
await database.dropDatabase();
await closeConnection();

// app.listen(3000, () => {
//   console.log("We've now got a server!");
//   console.log('Your routes will be running on http://localhost:3000');
// });
