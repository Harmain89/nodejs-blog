const { Router } = require('express');
const User = require('../models/user.model.js');

const router = Router();

router.get('/signup', (req, res) => {
    return res.render('signup')
})

router.post('/signup', async (req, res) => {
    const { fullName, email, password } = req.body;

    // console.log(req.body);
    // return;

    if( ![fullName, email, password].every(Boolean) ) {
        // return res.status(400).json({
        //     status: 400,
        //     message: "All fields are required.",
        //     success: false
        // })
        return redirect('/user/singup')
    }

    await User.create({
        fullName,
        email,
        password
    }).then(() => {
        
        return res.redirect('/')
    }).catch((err) => {
        if(err?.code == 11000) {
            console.error('Email Already Exists.')
            return res.status(400).send('Email Already Exists.'); // Send a response back
        }else {
            console.error(err?.errmsg);
            return res.status(500).send('An error occurred.'); // Handle other errors
        }
    })

})

router.get('/signin', (req, res) => {
    return res.render('signin')
})

router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    
    try {
        
        if( ![email, password].every(Boolean) ) {
            return redirect('/user/signin')
        }

        const token = await User.matchPasswordAndGenerateToken(email, password);

        // console.log(token);
        
        return res.cookie('token', token).redirect('/');

    } catch (error) {
        console.error(error.message);
        
        if (error.message === 'User Not Found!') {
            
            return res.render('signin', {
                error: "User not found."
            })
            
        } else if (error.message === 'Incorrect Password') {
            return res.render('signin', {
                error: "Incorrect password."
            })
        }
        
        return res.status(500).send('An error occurred.');
    }
})

router.get('/logout', (req, res) => {
    res.clearCookie('token').redirect('/')
})

module.exports = router;