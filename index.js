const express = require('express');
const handlebars = require('express-handlebars')
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const session = require('express-session')
const flush = require('connect-flash')

app.use(bodyParser.urlencoded({extended: false}))

app.use(bodyParser.json())
app.use(session({
    secret: 'secret',
    cookie: {maxAge : 6000},
    resave: false,
    saveUninitialized: false
}))

app.use(flush());

const hb_inst = handlebars.create({
    extname: '.handlebars',
    compilerOptions: {
        preventIndent: true
    },
    layoutsDir: path.join(__dirname, './views/layouts'),
    partialsDir: path.join(__dirname, './views/partials')
});

app.engine('handlebars', hb_inst.engine );

app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, './views/user'));

app.use(require('./routes/user'));


app.use((req,res)=>{
    res.status(404);
    res.render('404',{
        alert: {
            type: 'warning',
            title: '404 Page not found',
            message: 'Please Login to access your Account'
        }, notlogged: '1'
    })

})


app.listen(3500,() =>{
    console.log('port working');
})