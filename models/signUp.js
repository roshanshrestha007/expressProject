const { default: Conf } = require('conf');
const express = require('express');

const app = express();

const store = new Conf();

app.use((req,res)=>{

        const username = req.body.uname;
        const email = req.body.email;
        const pswd1 = req.body.psw1;
        const pswd2 = req.body.psw2;
        const phno = req.body.phoneno;

        console.log(email);


        var newUser = JSON.parse(store.get('userArray') || '[]');

        newUser.push({
            username,
            email,
            pswd1,
            pswd2,
            phno
        })
        // store.set ('userArray',[
        //     username,
        //     email,
        //     pswd1,
        //     pswd2,
        //     phno
        // ]);


        store.set('userArray', JSON.stringify(newUser));

        const allUser = JSON.parse(store.get('userArray'|| '[]'));
        // store.clear();
        console.log(allUser);
        console.log("we are here \n");
        console.log(allUser[0].email);


    })


// console.log(userArray);

module.exports= store;
