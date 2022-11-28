const express = require('express');
const handlebars = require('express-handlebars')
const path = require('path');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({extended: false}))

app.use(bodyParser.json())

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

// app.get('/',(req,res)=> {
//     res.send('Hello world 2');
// });

//TODO add back in user routes
app.use(require('./routes/user'));


app.use((req,res)=>{
    res.render('404',{
        alert: {
            type: 'warning',
            title: '404 Page not found',
            message: 'Error'
        }
    })

})



// app.use((req,res)=>{
//     res.render('401',{
//         alert: {
//             type: 'warning',
//             title: 'Account details donot match',
//             message: 'Error'
//         }
//     })

// })

// app.use('/auth', require('./routes/auth'));

app.listen(3500,() =>{
    console.log('port working');
})