export default class TextFileModel {
    constructor(fileId, fileName, fileInitialContent) {
      this.fileId = fileId;
      this.fileName = fileName;
      this.fileInitialContent = fileInitialContent
      this.fileContent = fileInitialContent;
    }

    isModified() {
        return this.fileContent !== this.fileInitialContent;
    }
  }
  