const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('express-flash');
const moment = require('moment');
const http = require('http');
const { Server } = require("socket.io");


require("dotenv").config();

const database = require("./config/database");

const systemConfix = require("./config/system");

//import
const routeAdmin = require("./routers/admin/index.route");
const route = require("./routers/client/index.route");

database.connect();

const app = express();
const port = process.env.PORT;

//Socket.io
const server = http.createServer(app);
const io = new Server(server);
io.on('connection', (socket) => {
    console.log('a user connected', socket.id);
});

app.use(methodOverride('_method'))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

app.set('views', `${__dirname}/views`);
app.set('view engine', 'pug');

//Flash
app.use(cookieParser('mykeyhihi'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());

//TinyMCE
app.use(
    '/tinymce', 
    express.static(path.join(__dirname, 'node_modules', 'tinymce'))
);
//End TinyMCE


//App Locals Variable
app.locals.preFixAdmin = systemConfix.preFixAdmin;
app.locals.moment = moment;


app.use(express.static(`${__dirname}/public`));

//Router
routeAdmin(app);
route(app);
app.get("*", (req, res) => {
    res.render("client/pages/errors/404", {
        pagesTitle: "404 Not Found"
    });
});


server.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

