const express = require('express');
const app = express();
const uuid = require('uuid');


const { default: Conf } = require('conf');

const store = new Conf();


store.clear();

const router = new express.Router();
//const loggedInStatus = True;



router.route('/login')
    .get((req, res) => {
        var data = JSON.parse(store.get('userArray') || '[]');
        console.log(' inside login \n' + data);
        var ind = store.get('index');
        console.log(ind)

        if (data == '' && ind == undefined) {

            console.log("inside if stare..")
            res.render('login', {
                notlogged: '1', message: {
                    type: 'warning',
                    title: 'No users in the system! Sign up first'
                }
            });
            // res.redirect()
        }
        else {

            console.log("inside else");
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

        console.log("Before for loop");
        console.log("The size of array is :" + data.length);

        for (let i = 0; i < data.length; i++) {
            console.log("loop  " + i)
            if ((Login_uname === data[i].username) && (Login_pswd === data[i].pswd1)) {
                console.log("success");
                store.set('index', i);
                console.log(store.get('index'));
                var flg = '1';
                break;
            }
            else {
                console.log("The else statement")
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
        // var data = JSON.parse(store.get('userArray') || '[]');
        // if(data === '[]'){
        //     res.redirect('login',{notlogged:'1'});
        // }
        // else{
        //     const ind = store.get('index');
        //     const username = data[ind].uname;

        // res.render('new',{logged:'1', userName: username});
        // }
        res.render('new', { notlogged: '1' });

    })
    .post((req, res) => {
        //console.log(req.body); 



        const uniqId = uuid.v1();
        const username = req.body.uname;
        const email = req.body.email;
        const pswd1 = req.body.psw1;
        const pswd2 = req.body.psw2;
        const phno = req.body.phoneno;

        console.log(email);


        var Signupdata = JSON.parse(store.get('userArray') || '[]');

        for (let i = 0; i < Signupdata.length; i++) {
            console.log("loop  " + i)
            if ((username === Signupdata[i].username)) {
                console.log("username taken");
                // store.set('index',i);
                // console.log(store.get('index'));
                var flgSign = '1';
                break;
            }
            else if ((email === Signupdata[i].email)) {
                console.log("email taken");
                var flgSign = '2';
                break;

            }
            else {
                console.log("The else statement")
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
                    title: 'Password donot match',
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
            //store.clear();
            console.log(allUser);
            console.log(allUser.length);
            const i = allUser.length - 1;
            store.set('index', i);
            console.log("we are here \n");
            console.log(allUser[0].email);

            res.redirect('login');

        }
    })


router.route('/:userID')
    .get((req, res) => {
        console.log(req.params.userID);

        const userids = req.params.userID;
        if (userids === '') {
        // console.log("User Doesn't exist");
            res.render('404', {
                alert: {
                    type: 'warning',
                    title: 'Page donot work',
                }, notlogged: '1'
            })


        }
        console.log(userids);

        var data = JSON.parse(store.get('userArray') || '[]');

        for (let i = 0; i < data.length; i++) {
            if (userids === data[i].uniqId) {
                store.set('index', i);
                console.log("success");
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

            console.log(DisEmail);
            const DisPhno = data[ind].phno;
            console.log(DisPhno);
            const DisPwd = data[ind].pswd1;
            const uName = data[ind].username;

            res.render('user', {
                logged: '1', userID: uniqid, userName: uName, email: DisEmail, phno: DisPhno, password: DisPwd, message: req.flash('message')
            });

        }
        else {
            console.log("User Doesn't exist");
            res.render('404', {
                alert: {
                    type: 'warning',
                    title: '404 Page doesnot exist!!',
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

        console.log("\n\n\n\n\n\n This is the update part")
        console.log(updUserName)
        console.log(updUserEmail)
        console.log(updUserPhone)


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

            console.log("hare ram hare ram\n");
            const indx = store.get('index');
            console.log(usrs[indx].username);
            var uidz = usrs[indx].uniqId;

            for (let j = 0; j < usrs.length; j++) {
                if ((usrs[j].username === updUserName ) && (upduuid !== usrs[j].uniqId)) {
                    console.log("username taken");
                    // store.set('index',i);
                    // console.log(store.get('index'));
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
                req.flash('message', 'Username is already taken')
                res.redirect(`/${uidz}`);
            }
            else if (updflag === '2') {
                req.flash('message', 'Email is already taken')
                res.redirect(`/${uidz}`);
            }
            else if(updflag === '0'){
                console.log("/n/n/n Updating........................")

            usrs[store.get('index')].username = updUserName;
            usrs[store.get('index')].email = updUserEmail;
            usrs[store.get('index')].phno = updUserPhone;
            console.log(usrs);
            store.set('userArray', JSON.stringify(usrs));
            console.log("\n\n This is the array after updating");
            console.log(JSON.parse(store.get('userArray' || '[]')))
            console.log("user before", updUserName);

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
