export const JwtConfig = {
    secret: process.env.TOKEN_KEY || 'SomeSuperSecretRandomToken'
}

export const NoteConfig = {
    validation: {
        title: {
            length: {
                min: 3,
                max: 60
            }
        },
        content: {
            length: {
                min: 3,
                max: 4096
            }
        }
    }
}
