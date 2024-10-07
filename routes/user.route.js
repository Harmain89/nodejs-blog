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

        const user = await User.matchPassword(email, password);

        // console.log(user);
        
        // Successfully matched, handle login success (e.g., create session, etc.)
        res.redirect('/');

    } catch (error) {
        console.error(error.message); // Log the error for debugging
        // Send a user-friendly message back to the client
        if (error.message === 'User Not Found!') {
            return res.status(404).send('User not found.'); // Not found response
        } else if (error.message === 'Incorrect Password') {
            return res.status(401).send('Incorrect password.'); // Unauthorized response
        }
        // Handle other unexpected errors
        return res.status(500).send('An error occurred.'); // Internal server error
    }
})

module.exports = router;