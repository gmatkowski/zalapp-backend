var UserDto = /** @class */ (function () {
    function UserDto(email) {
        this.email = email;
    }
    UserDto.prototype.getEmail = function () {
        return this.email;
    };
    UserDto.prototype.getFirstName = function () {
        return this.first_name;
    };
    UserDto.prototype.setFirstName = function (first_name) {
        this.first_name = first_name;
    };
    UserDto.prototype.getLastName = function () {
        return this.first_name;
    };
    UserDto.prototype.setLastName = function (last_name) {
        this.last_name = last_name;
    };
    return UserDto;
}());
export default UserDto;
