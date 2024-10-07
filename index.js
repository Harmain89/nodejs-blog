const express = require('express');
const app = express();
const path = require('path');
const userRoute = require('./routes/user.route.js');
const { connectToMongoose } = require('./connect.js');

connectToMongoose('mongodb://localhost:27017/blogify')
    .then(() => console.log('MongoDB Connected'))

const PORT = 8000;

app.set('view engine', 'ejs')
app.set('views', path.resolve('./views'))

// app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.get('/', (req, res) => {
    return res.render('home')
})

app.use('/user', userRoute)

app.listen(PORT, () => console.log(`Example app listening on PORT ${PORT}!`))