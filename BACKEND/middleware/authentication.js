const jwt = require('jsonwebtoken')

const auth = (req,res,next)=>{
    try{

        const token = req.headers.authorization?.split(' ')[1]
        if(!token){
            return res.status(401).json({message:'No token provided'})
        }
        const decoded = jwt.verify(token,process.env.JWT_KEY)
        req.user = decoded
        next()
    }

    catch(err){
        console.error(err.message)
        res.status(401).json({message:'UnAuthorized or Invalid token'})
    }
}

module.exports = auth