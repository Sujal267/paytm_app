const jwt = require("jsonwebtoken")
const JWT_SECRET = require("./config")

function authMiddleware(req,res,next){
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({
            msg:"invalid Authorization provided"
        });
    }
    const split = authHeader.split(" ")
    const token = split[1]
    try{
        const decoded = jwt.verify(token,JWT_SECRET)
        req.userId = decoded.userId
        next()
    }catch(e){
        return res.status(403).json({
            msg:"invalid Authorization",
            error:e
        });
    }
}
module.exports = {
    authMiddleware
}