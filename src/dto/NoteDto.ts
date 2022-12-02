class NoteDto {
    title: string
    content: string

    constructor(title: string, content: string){
        this.title = title
        this.content = content
    }

    getTitle(){
        return this.title
    }

    getContent(){
        return this.content
    }
}

export default NoteDto
