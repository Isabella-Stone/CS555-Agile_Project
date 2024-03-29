import express from 'express';
const app = express();
import session from 'express-session';
import configRoutes from './routes/index.js';
import {fileURLToPath} from 'url';
import {dirname} from 'path';
import exphbs from 'express-handlebars';
import Handlebars from 'handlebars';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.json());

app.use(session({
  name: 'AuthCookie',
  secret: 'some secret string!',
  resave: false,
  saveUninitialized: false
}));

const staticDir = express.static(__dirname + '/public');

const rewriteUnsupportedBrowserMethods = (req, res, next) => {
  // If the user posts to the server with a property called _method, rewrite the request's method
  // To be that method; so if they post _method=PUT you can now allow browsers to POST to a route that gets
  // rewritten in this middleware to a PUT route
  if (req.body && req.body._method) {
    req.method = req.body._method;
    delete req.body._method;
  }

  // let the next middleware run:
  next();
};

app.use('/public', staticDir);
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(rewriteUnsupportedBrowserMethods);
app.engine('handlebars', exphbs.engine({defaultLayout: 'main', 
  helpers:{
  // Function to do basic mathematical operation in handlebar
    math: function(lvalue, operator, rvalue) {lvalue = parseFloat(lvalue);
        rvalue = parseFloat(rvalue);
        return {
            "+": lvalue + rvalue,
            "-": lvalue - rvalue,
            "*": lvalue * rvalue,
            "/": lvalue / rvalue,
            "%": lvalue % rvalue
        }[operator];
    }
}}));
app.set('view engine', 'handlebars');
Handlebars.registerHelper('isPending', function(value){
  return value.status == 'pending'
})
Handlebars.registerHelper('eventDidntHappen', function(value){
  let date = new Date();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let year = date.getFullYear();
  let eventMonth = (value.date).substring(0, 2);
  let eventDay = (value.date).substring(3,5);
  let eventYear = (value.date).substring(6);

  if(parseInt(year) > parseInt(eventYear)){
    return false;
  }
  if(parseInt(year) == parseInt(eventYear) && parseInt(month) > parseInt(eventMonth)){
    return false;
  }
  if(parseInt(month) == parseInt(eventMonth) && parseInt(day) > parseInt(eventDay)){
    return false;
  }
  return true;
})
Handlebars.registerHelper('didEventStart', function(value){
  let date = new Date();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let year = date.getFullYear();
  let eventMonth = (value.date).substring(0, 2);
  let eventDay = (value.date).substring(3,5);
  let eventYear = (value.date).substring(6);

  if(parseInt(year) == parseInt(eventYear) && parseInt(month) == parseInt(eventMonth) && parseInt(day) == parseInt(eventDay)){
    //if the date matches today, check to see if the time started
    let currHour = date.getHours();
    let currMin = date.getMinutes();

    let hour = (value.startTime).substring(0,2);
    let min = (value.startTime).substring(3);
    if(currHour > hour || (currHour == hour && currMin >= min)){
      return true
    }
  }
  return false;
})

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});
