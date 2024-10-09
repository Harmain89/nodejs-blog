const express = require('express');
const app = express();
const path = require('path');
const userRoute = require('./routes/user.route.js');
const { connectToMongoose } = require('./connect.js');
const cookieParser = require('cookie-parser');
const { checkForAuthenticationCookie } = require('./middlewares/auth.middleware.js');

connectToMongoose('mongodb://localhost:27017/blogify')
    .then(() => console.log('MongoDB Connected'))

const PORT = 8000;

app.set('view engine', 'ejs')
app.set('views', path.resolve('./views'))

app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())
app.use(checkForAuthenticationCookie('token'))

app.get('/', (req, res) => {
    return res.render('home', {
        user: req?.user?.email
    })
})

app.use('/user', userRoute)

app.listen(PORT, () => console.log(`Example app listening on PORT ${PORT}!`))