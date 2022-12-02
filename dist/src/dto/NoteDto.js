var NoteDto = /** @class */ (function () {
    function NoteDto(title, content) {
        this.title = title;
        this.content = content;
    }
    NoteDto.prototype.getTitle = function () {
        return this.title;
    };
    NoteDto.prototype.getContent = function () {
        return this.content;
    };
    return NoteDto;
}());
export default NoteDto;
