const jsonwebtoken = require('jsonwebtoken');
const secret = "MicroPass@45!";

function createTokenForUser(user) {
    const payload = {
        _id: user?._id,
        email: user?.email,
        profileImageURL: user?.profileImageURL,
        role: user?.role
    }

    const token = jsonwebtoken.sign(payload, secret)
    return token;
}

function validateToken(token) {
    const payload = jsonwebtoken.verify(token, secret)
    return payload
}

module.exports = {
    createTokenForUser,
    validateToken
};