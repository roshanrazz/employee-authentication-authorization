const jwt = require('jsonwebtoken')
const jwtSecret = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

function verifyToken(req, res) {
    const token = req.headers.authorization.split(" ")[1]
    const verifiedUser = jwt.verify(token, jwtSecret)
    req.user = verifiedUser
    return verifiedUser
}

const checkAdmin = ((req, res, next) => {
    try {
        const verifiedUser = verifyToken(req, res)
        if (verifiedUser.userType.toUpperCase() === "ADMIN") {
            next()
        } else {
            res.status(401).json({ Error: "Access Denied...Admin privilege is required" })
        }
    } catch (error) {
        res.status(401).json({ Error: "Invalid token" })
    }
})


const checkAnyRole = ((req, res, next) => {
    try {
        verifyToken(req, res)
        next()
    } catch (error) {
        res.status(401).json({ Error: "Invalid token" })
    }
})
// const checkAdmin = (verifyToken().then)

module.exports.checkAdmin = checkAdmin
module.exports.checkAnyRole = checkAnyRole