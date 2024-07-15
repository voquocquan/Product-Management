const express = require('express');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('express-flash');

require("dotenv").config();

const database = require("./config/database");

const systemConfix = require("./config/system");

//import
const routeAdmin = require("./routers/admin/index.route");
const route = require("./routers/client/index.route");

database.connect();

const app = express();
const port = process.env.PORT;

app.use(methodOverride('_method'))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

app.set('views', './views');
app.set('view engine', 'pug');

//Flash
app.use(cookieParser('mykeyhihi'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());


//App Locals Variable
app.locals.preFixAdmin = systemConfix.preFixAdmin;


app.use(express.static('public'));

//Router
routeAdmin(app);
route(app);


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

