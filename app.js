const express = require("express");
const handlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const session = require("express-session");
const fileUpload = require("express-fileupload");

const dotenv = require("dotenv");
dotenv.config();

const app = express();

app.use(session({
    secret: "This is a secret!",
    cookie: {
        maxAge: 3600000
    },
    resave: false,
    saveUninitialized: false
}));

app.use('/form', express.static(__dirname + '/index.html'));
// default options
app.use(fileUpload());

app.use(bodyParser.urlencoded({ extended: false }));

//turn on serving static files (required for delivering images to client)
app.use(express.static("public"));

app.engine('.hbs', handlebars.engine({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.set('views', './views');

const routes = require("./routes");
app.use("/", routes);

app.listen(process.env.PORT, () => {
    console.log(`Web App OTHer listening on ${process.env.PORT}`);
});

module.exports = app;
