import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
var UserService = /** @class */ (function () {
    function UserService(jwtToken) {
        this.jwtToken = jwtToken;
    }
    UserService.prototype.generateJwtTokenFromUser = function (user) {
        var token = jwt.sign({
            id: user.id
        }, this.jwtToken, {
            expiresIn: '24h',
        });
        return token;
    };
    return UserService;
}());
export default UserService;
