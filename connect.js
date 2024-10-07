const mongoose = require('mongoose');

const connectToMongoose = async url => {
    return await mongoose.connect(url)
}

module.exports = {
    connectToMongoose
}