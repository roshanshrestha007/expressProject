const express = require('express');
const app = express();
const uuid = require('uuid');



const { default: Conf } = require('conf');

const store = new Conf();


const router = new express.Router();




router.route('/login')
    .get((req, res) => {

        var data = JSON.parse(store.get('userArray') || '[]');
        var ind = store.get('index');


        if (data == '' && ind == undefined) {


            res.render('login', {
                notlogged: '1', message: {
                    type: 'warning',
                    title: 'No users in the system! Sign up first'
                }
            });
            
        }
        else {

            
            var data = JSON.parse(store.get('userArray') || '[]');
            var ind = store.get('index');

            const username = data[ind].uname;

            res.render('login', { logged: '1', userName: username });

        }

    })
    .post((req, res) => {

        const Login_uname = req.body.uname;
        const Login_pswd = req.body.pswd;


        var data = JSON.parse(store.get('userArray') || '[]');
        console.log(data);

        console.log("The size of array is :" + data.length);

        for (let i = 0; i < data.length; i++) {
            
            if ((Login_uname === data[i].username) && (Login_pswd === data[i].pswd1)) {
                store.set('index', i);
                var flg = '1';
                break;
            }
            else {
                var flg = '0';
            }
        }
        indy = store.get('index')
       
        if(indy == undefined && data == ''){
            res.render('login', {
                notlogged: '1', message: {
                    type: 'warning',
                    title: 'No users in the system! Sign up first'
                }
            });


        }
        else
        {
            var uids=data[indy].uniqId

        }

        if (flg == '1') {
            res.redirect(`/${uids}`);
        }
        else if (flg == '0') {
            res.render('login', {
                message: {
                    type: 'warning',
                    title: 'Account details donot match',
                }, notlogged: '1'
            })
        }


    })

router.route('/new')
    .get((req, res) => {
        
        res.render('new', { notlogged: '1' });

    })
    .post((req, res) => {
        
        const uniqId = uuid.v1();
        const username = req.body.uname;
        const email = req.body.email;
        const pswd1 = req.body.psw1;
        const pswd2 = req.body.psw2;
        const phno = req.body.phoneno;


        var Signupdata = JSON.parse(store.get('userArray') || '[]');

        for (let i = 0; i < Signupdata.length; i++) {
                if ((username === Signupdata[i].username)) {
                console.log("username taken");
                var flgSign = '1';
                break;
            }
            else if ((email === Signupdata[i].email)) {
                console.log("email taken");
                var flgSign = '2';
                break;

            }
            else {
                var flgSign = '0';
            }
        }

        if (flgSign == '1') {
            console.log("Username already in system");
            res.render('new', {
                message: {
                    type: 'warning',
                    title: 'Username is taken',
                }, notlogged: '1'
            })
        }
        else if (flgSign == '2') {
            console.log("Email already in system");
            res.render('new', {
                message: {
                    type: 'warning',
                    title: 'User with this Email already exist',
                }, notlogged: '1'
            })
        }
        else if (!username || !email || !pswd1 || !phno || pswd1 !== pswd2) {
            console.log("Password Doesnot match");
            res.render('new', {
                message: {
                    type: 'warning',
                    title: 'Password does not match',
                }, notlogged: '1'
            })



        }
        else {
            var newUser = JSON.parse(store.get('userArray') || '[]');
            newUser.push({
                uniqId,
                username,
                email,
                pswd1,
                pswd2,
                phno
            })

            store.set('userArray', JSON.stringify(newUser));

            const allUser = JSON.parse(store.get('userArray' || '[]'));
            
            console.log(allUser);
            console.log(allUser.length);
            const i = allUser.length - 1;
            store.set('index', i);
            
            console.log(allUser[0].email);

            res.redirect('login');

        }
    })


router.route('/:userID')
    .get((req, res) => {
        
        const userids = req.params.userID;
        if (userids === '') {
            res.status(404)
            res.render('404', {
                alert: {
                    type: 'warning',
                    title: 'Page does not work',
                }, notlogged: '1'
            })


        }


        var data = JSON.parse(store.get('userArray') || '[]');

        for (let i = 0; i < data.length; i++) {
            if (userids === data[i].uniqId) {
                store.set('index', i);
                var UseFlg = '1';
                break;

            }
            else {
                var UseFlg = '0';
            }

        }
        if (UseFlg == '1') {
            const ind = store.get('index');
            const uniqid = data[ind].uniqId;
            const DisEmail = data[ind].email;


            const DisPhno = data[ind].phno;
            const DisPwd = data[ind].pswd1;
            const uName = data[ind].username;

            res.render('user', {
                logged: '1', userID: uniqid, userName: uName, email: DisEmail, phno: DisPhno, password: DisPwd, message: req.flash('message'),  failumessage: req.flash('failumessage'), failemessage: req.flash('failemessage')
            });

        }
        else {
           
            res.status(404);
            res.render('404', {
                alert: {
                    type: 'warning',
                    title: '404 Page does not exist!!',
                }, notlogged: '1' 
            })


        }




    })
    .post((req, res) => {
    
        console.log(req.body);
        const upduuid = req.body.upduuid;
        const updUserName = req.body.upduname;
        const updUserEmail = req.body.updemail;
        const updUserPhone = req.body.updphno;
        const updUserPass = req.body.psw1;

        var usrs = JSON.parse(store.get('userArray') || '[]')

        for (let i = 0; i < usrs.length; i++) {
            if (upduuid === usrs[i].uniqId) {
                store.set('index', i);
                var userFlg = '1';
                break;
            }
            else {
                var userFlg = '0';
            }
        }


        if(userFlg ='1'){

            const indx = store.get('index');
            console.log(usrs[indx].username);
            var uidz = usrs[indx].uniqId;

            for (let j = 0; j < usrs.length; j++) {
                if ((usrs[j].username === updUserName ) && (upduuid !== usrs[j].uniqId)) {
                    console.log("username taken");
                    var updflag = '1';
                    break;
                }
                else if ((updUserEmail === usrs[j].email) && (upduuid !== usrs[j].uniqId)) {
                    console.log("email taken");
                    var updflag = '2';
                    break;
                }
                else{
                    var updflag = '0';
                }
    
            }

            if (updflag === '1') {
                req.flash('failumessage', 'Username is already taken')
                res.redirect(`/${uidz}`);
            }
            else if (updflag === '2') {
                req.flash('failemessage', 'Email is already taken')
                res.redirect(`/${uidz}`);
            }
            else if(updflag === '0'){
                console.log("/n/n/n Updating........................")

            usrs[store.get('index')].username = updUserName;
            usrs[store.get('index')].email = updUserEmail;
            usrs[store.get('index')].phno = updUserPhone;
            console.log(usrs);
            store.set('userArray', JSON.stringify(usrs));
            console.log(JSON.parse(store.get('userArray' || '[]')))
            req.flash('message', 'User Successfully updated!')


            res.redirect(`/${upduuid}`);
            console.log("user after", updUserName);

            }
            else{
                req.flash('message', 'Some error occured')
                res.redirect(`/${uidz}`);
            }

        }
        else{
            req.flash('message', 'Unique id doesnot match');
            res.redirect(`/${uidz}`);

        }
    })



module.exports = router;