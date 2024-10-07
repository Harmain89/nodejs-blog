const { Schema, model } = require('mongoose')
const { createHmac, randomBytes } = require('crypto');

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    salt: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    profileImageURL: {
        type: String,
        default: '/images/default.png'
    },
    role: {
        type: String,
        enum: ['USER', 'ADMIN'],
        default: 'USER'
    }
}, { timeseries: true })


userSchema.pre("save", function (next) {

    if(!this.isModified("password")) return;

    const salt = randomBytes(16).toString();
    const hashedPassword = createHmac('sha256', salt).update(this.password).digest("hex");

    this.salt = salt;
    this.password = hashedPassword;

    next();
})

userSchema.static('matchPassword', async function (email, password) {
    const user = await this.findOne({ email });

    if(!user) {
        throw new Error('User Not Found!');
    }

    const salt = user.salt;
    const hashedPassword = user.password;

    const userProvidedPassword = createHmac('sha256', salt).update(password).digest('hex');

    if(userProvidedPassword !== hashedPassword) {
        throw new Error('Incorrect Password');
    }

    return { ...user.toObject(), password: undefined, salt: undefined };
})

const User = model('User', userSchema);

module.exports = User;