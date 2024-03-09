import jwt from "jsonwebtoken";

const check_auth = (request, response, next) => {
    try {
        let token = request.headers['authorization'].split(' ')[2]; 
        const decoded = jwt.verify(token, process.env.APP_SECRET);
        request.userData = decoded;
        next();
    } catch(error) {
        console.error(error);
        if (error.name === 'TokenExpiredError') {
            return response.status(401).json({ "message": "Token has expired" });
        } else if (error.name === 'JsonWebTokenError') {
            return response.status(401).json({ "message": "Invalid token" });
        } else {
            return response.status(500).json({ "message": "Internal server error" });
        }
    }
}

export default check_auth;
