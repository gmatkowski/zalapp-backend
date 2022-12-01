class UserDto {
    email: string
    first_name: string | undefined
    last_name: string | undefined

    constructor(email: string) {
        this.email = email
    }

    getEmail() {
        return this.email
    }

    getFirstName() {
        return this.first_name
    }

    setFirstName(first_name: string) {
        this.first_name = first_name
    }

    getLastName() {
        return this.first_name
    }

    setLastName(last_name: string) {
        this.last_name = last_name
    }

}

export default UserDto
