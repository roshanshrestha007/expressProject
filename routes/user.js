const express = require('express');
const app = express();


const { default: Conf } = require('conf');

const store = new Conf();

// const allUser = ({
//     userName: "",
//     userEmail: "",
//     userPassword: "",
//     userPassword2: "",
//     userPhone: ""
// })

const router = new express.Router();
const loggedInStatus = True;

// app.use(require('./models/User'));


router.route('/login')
    .get((req,res)=>{
        res.render('login',{});
    })
    .post((req,res)=> {
        // console.log(req.body);
        const Login_uname = req.body.uname;
        const Login_pswd = req.body.pswd;
        // console.log(Login_uname);
        // console.log(Login_pswd);


        var data = JSON.parse(store.get('userArray') || '[]');
        console.log(data);
        //console.log(data.length);

        console.log("wwwwwwwwww")

        console.log(data[1].username , "\n here we go\n");
       
        console.log(data[3]);
        console.log("Before for loop");

        console.log(Login_uname);
        console.log(Login_pswd);

        // if(Login_uname === data[3].username){
        //     console.log("the comparision works")
        // }else{
        //     console.log("logic has issue")
        // }
        console.log("The size of array is :" + data.length);

        for(let i = 0;i < data.length;i++){
            console.log("loop  " + i)
            if((Login_uname === data[i].username) && (Login_pswd === data[i].pswd1)){
                console.log("success");
                store.set('index',i);
                console.log(store.get('index'));
                var flg = '1';
                break;
            }
            else{
                console.log("The else statement")
                var flg = '0';
                //break;
            }
        }

        if(flg == '1'){
            res.redirect(`/${Login_uname}`);
        }
        else if(flg == '0'){
            res.render('login',{
                message: {
                    type: 'warning',
                    title: 'Account details donot match',
                }
            })
            // res.redirect('/login')
        }


})

router.route('/new')
    .get((req,res)=>{
        res.render('new',{});
    })
    .post((req,res)=> {
        //console.log(req.body);    
        
        const username = req.body.uname;
        const email = req.body.email;
        const pswd1 = req.body.psw1;
        const pswd2 = req.body.psw2;
        const phno = req.body.phoneno;

        console.log(email);


        var Signupdata = JSON.parse(store.get('userArray') || '[]');

        for(let i = 0;i < Signupdata.length;i++){
            console.log("loop  " + i)
            if((username === Signupdata[i].username)){
                console.log("username taken");
                // store.set('index',i);
                // console.log(store.get('index'));
                var flgSign = '1';
                break;
            }
            else if((email === Signupdata[i].email)){
                console.log("email taken");
                var flgSign = '2';
                break;

            }
            else{
                console.log("The else statement")
                var flgSign = '0';
                //break;
            }
        }

        if(flgSign == '1'){
            console.log("Username already in system");
            res.render('new',{
                message: {
                    type: 'warning',
                    title: 'Username is taken',
                }
            })
        }
        else if(flgSign == '2')
        {
            console.log("Email already in system");
            res.render('new',{
                message: {
                    type: 'warning',
                    title: 'User with this Email already exist',
                }
            })
        }
        else if (!username || !email || !pswd1 || !phno || pswd1 !== pswd2) {
            console.log("Password Doesnot match");
            res.render('new',{
                message: {
                    type: 'warning',
                    title: 'Password donot match',
                }
            })
                    
                     
                            
        }
        else
        {
        var newUser = JSON.parse(store.get('userArray') || '[]');
        newUser.push({
            username,
            email,
            pswd1,
            pswd2,
            phno
        })
        
        store.set('userArray', JSON.stringify(newUser));

        const allUser = JSON.parse(store.get('userArray'|| '[]'));
        //store.clear();
        console.log(allUser);
        console.log(allUser.length);
        const i = allUser.length - 1;
        store.set('index',i);
        console.log("we are here \n");
        console.log(allUser[0].email);
        
         res.redirect(`/login`);

        }
    })


router.route('/:userID')
    .get((req,res)=>{
        console.log(req.params.userID);
        // res.send({userName: req.params.userID});
        const userName = req.params.userID;
        console.log(userName);

        var data = JSON.parse(store.get('userArray') || '[]');

        for(let i =0;i<data.length;i++){
            if(userName === data[i].username){
                store.set('index',i);
                console.log("success");
                var UseFlg = '1';
                break;
    
            }
            else{
                var UseFlg = '0';
            //     res.render('new',{
            //         message: {
            //             type: 'warning',
            //             title: 'Password donot match',
            //         }
                
            // }
            }

        }
        if(UseFlg == '1'){
            const ind = store.get('index');
            const DisEmail = data[ind].email;
            console.log(DisEmail);
            const DisPhno = data[ind].phno;
            console.log(DisPhno);
            const DisPwd = data[ind].pswd1;


            res.render('user',{userName: req.params.userID, email: DisEmail, phno: DisPhno, password: DisPwd, message: req.flash('message')});

        }
        else{
            console.log("User Doesn't exist");
            res.render('404',{
                alert: {
                    type: 'warning',
                    title: 'Page donot exist',
                }
            })
                

        }
            



        // res.send(`${req.params.uname}`);
    })
    .post((req,res)=> {
        console.log(req.body);
        const updUserName = req.body.upduname;
        const updUserEmail = req.body.updemail;
        const updUserPhone = req.body.updphno;

        console.log("\n\n\n\n\n\n This is the update part")
        //console.log(req.body.upduname)
        console.log(updUserName)
        console.log(updUserEmail)
        console.log(updUserPhone)


        var usrs = JSON.parse(store.get('userArray')|| '[]')
        for(let i =0;i<usrs.length;i++){
            if(updUserName === usrs[i].username){
                store.set('index',i);
                var userFlg = '1';
                break;
                //console.log("success");
            }
            else{
                var userFlg = '0';
            }
        }

        console.log("\nthe users index is:" + store.get('index'));
        usrs[store.get('index')].username = updUserName;
        usrs[store.get('index')].email = updUserEmail;
        usrs[store.get('index')].phno = updUserPhone;

       //req.params.userID = updUserName;
        console.log(usrs);
        store.set('userArray', JSON.stringify(usrs));
        console.log("\n\n This is the array after updating");
        console.log(JSON.parse(store.get('userArray'|| '[]')))
        console.log("user before",updUserName);
        
        req.flash('message', 'Success!')
        
        

        //res.redirect(`/${updUserName}`);
        console.log("user after",updUserName);

        //res.render('user',{userName: updUserName, email: updUserEmail, psw1 : usrs[store.get('index')].psw1, phno: updUserPhone, message : req.flash('message')})
        //     alert: {
        //         type: 'warning',
        //         title: 'User Updated',
        //     }
        // });
        res.redirect(`/${updUserName}`);


})

module.exports = router;
