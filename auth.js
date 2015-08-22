var crypto = require('crypto')
module.exports = {
    encodePassword: function(password) {
        return crypto.createHash('md5').update(
            crypto.createHash('sha1').update(
                crypto.createHash('md5').update(
                    password
                ).digest('hex')
            ).digest('hex')
        ).digest('hex')
    }
}
