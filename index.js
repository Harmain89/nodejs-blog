const express = require('express');
const app = express();
const path = require('path');
const userRoute = require('./routes/user.route.js');
const blogRoute = require('./routes/blog.route.js');
const { connectToMongoose } = require('./connect.js');
const cookieParser = require('cookie-parser');
const { checkForAuthenticationCookie } = require('./middlewares/auth.middleware.js');
const Blog = require('./models/blog.model.js');

connectToMongoose('mongodb://localhost:27017/blogify')
    .then(() => console.log('MongoDB Connected'))

const PORT = 8000;

app.set('view engine', 'ejs')
app.set('views', path.resolve('./views'))

app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())
app.use(checkForAuthenticationCookie('token'))
app.use(express.static(path.resolve('./public')))

app.get("/", async (req, res) => {
    const allBlogs = await Blog.find({});
    res.render("home", {
      user: req.user,
      blogs: allBlogs,
    });
  });

app.use('/user', userRoute)
app.use('/blog', blogRoute)

app.listen(PORT, () => console.log(`Example app listening on PORT ${PORT}!`))