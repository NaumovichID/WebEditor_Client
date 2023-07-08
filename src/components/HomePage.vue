<template>
<div class="home">

    <div v-if="file.fileName" class="col file-panel">
        <div class="row justify-content-between">
            <input class="text-primary font-italic" type="text" v-model="file.fileName" placeholder="{{ file.fileName }}">
            <div class="row">
                <div v-if="file.isModified">
                    <button type="button" class="btn btn-outline-primary btn-sm" @click="saveFile">Save file</button>
                </div>
                <div v-else>
                    <button type="button" class="btn btn-outline-secondary btn-sm disabled" aria-disabled="true">Save file</button>
                </div>
                <div class="px-3">
                    <button class="btn btn-outline-dark btn-sm" @click="openModal">Share</button>

                    <modal-window :show="showModal" :share="true" title="Copy the identifier below and share" :content="file.fileId" @close="closeModal"></modal-window>

                </div>
                <div class="pr-3">
                    <button class="btn btn-outline-danger btn-sm" @click="closeFile">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        </div>

        <pre contenteditable="true" @input="handleFileContentInput">{{ file.fileContent }}</pre>
    </div>

    <div v-else class="file-select">
        <h1>Select a file</h1>
        <input type="file" ref="fileInput" accept=".txt" style="display: none" @change="handleFileChange">
        <button class="btn btn-primary" @click="openFileInput">Upload Text File</button> <br>
        <button class="btn btn-outline-primary my-2" @click="openModal">Open From Link</button>

        <modal-window :show="showModal" :share="false" title="Open file from link" content="Enter the identifier below and click 'Open'" @api-call-file="openFileFromLink" @close="closeModal"></modal-window>

    </div>

</div>
</template>

<script>
import {
    API_BASE_URL
} from '../api/api.js';
import TextFileModel from '@/models/TextFileModel.js';
import ModalWindow from './ModalWindow.vue';
export default {
    name: 'HomePage',
    components: {
        ModalWindow,
    },
    data() {
        return {
            file: new TextFileModel(),
            putChangesFlag: false,
            getChangesFlag: false,
            intervalId: '',
            showModal: false,
        };
    },

    methods: {
        openFileInput() {
            this.$refs.fileInput.click();
        },

        openFileFromLink(fileFromLink) {
            console.log('Got a file from the link');
            this.file = new TextFileModel(fileFromLink.fileId, fileFromLink.fileName, fileFromLink.content);

            this.getChangesFlag = true;
            this.intervalId = setInterval(this.getChanges, 3000);
        },

        closeFile() {
            clearInterval(this.intervalId);
            this.file = new TextFileModel();
            this.putChangesFlag = false;
            this.getChangesFlag = false;
            this.showModal = false;
        },

        openModal() {
            this.showModal = true;
        },
        closeModal() {
            this.showModal = false;
        },

        handleFileChange(event) {
            const file = event.target.files[0];
            if (file && file.type === 'text/plain') {
                console.log(file);
                const reader = new FileReader();
                reader.onload = () => {
                    const data = {
                        fileName: file.name,
                        content: reader.result,
                        fileId: ""
                    };
                    const addFileUrl = `${API_BASE_URL}`;
                    fetch(addFileUrl, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(data)
                        })
                        .then(response => {
                            if (response.ok) {
                                return response.json();
                            } else {
                                console.error('Error adding file');
                            }
                        })
                        .then(dataFromServer => {
                            this.file = new TextFileModel(dataFromServer.fileId, dataFromServer.fileName, dataFromServer.content);
                            console.log('File added successfully');
                            this.getChangesFlag = true;
                            this.intervalId = setInterval(this.getChanges, 2000);
                        })
                        .catch(error => {
                            console.error('Error adding file', error);
                        });
                };
                reader.readAsText(file);
            } else {
                alert('Choose text file');
            }
        },
        getChanges() {
            if (this.getChangesFlag) {
                const getChangesUrl = `${API_BASE_URL}/${this.file.fileId}`;
                fetch(getChangesUrl, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                    .then(response => {
                        if (response.ok) {
                            return response.json();
                        } else {
                            console.error('Error getting changes');
                        }
                    })
                    .then(dataFromServer => {
                        console.log('File got changes');
                        this.file.fileContent = dataFromServer.content;
                    })
                    .catch(error => {
                        console.error('Error getting changes', error);
                    });
            }
        },
        handleFileContentInput(event) {
            this.getChangesFlag = false;
            this.file.fileContent = event.target.textContent;
            this.putChangesFlag = true;
            if (!this.timer) {
                this.timer = setTimeout(this.putChanges, 1000);
            }
        },
        putChanges() {
            if (this.putChangesFlag) {
                const data = {
                    fileName: this.file.fileName,
                    content: this.file.fileContent,
                    fileId: this.file.fileId
                };
                const updateFileUrl = `${API_BASE_URL}/${this.file.fileId}`;
                fetch(updateFileUrl, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data)
                    })
                    .then(response => {
                        if (response.ok) {
                            return response.json();
                        } else {
                            console.error('Error updating file');
                        }
                    })
                    .then(dataFromServer => {
                        console.log('File updated successfully');
                        this.file.fileContent = dataFromServer.content;
                        this.file.fileName = dataFromServer.fileName;
                    })
                    .catch(error => {
                        console.error('Error updating file', error);
                    });
                this.timer = null;
            }
            this.getChangesFlag = true;
        },
        saveFile() {
            const fileData = this.file.fileContent;
            let fileName = this.file.fileName || 'filename.txt';
            if (!fileName.endsWith('.txt')) {
                fileName = fileName + '.txt'
            }
            const blob = new Blob([fileData], {
                type: 'text/plain;charset=utf-8'
            });
            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            link.click();

            URL.revokeObjectURL(url);
            console.log("File saved:", fileName);
        }
    },
}
</script>

  <!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.home {
    margin: 60px;
}

h1 {
    text-align: center;
    margin: 40px;
}

.file-select {
    text-align: center;
}

.file-panel {
    border-radius: 8px 8px 4px 4px;
    border: 2px solid #f8f9fa;
    overflow: hidden;
}

.file-panel .row {
    padding: 8px;
    background-color: #f8f9fa;
}

.file-panel pre {
    white-space: pre-wrap;
}

.file-panel pre:focus {
    outline: none;
    border-color: transparent;

}

.file-panel input {
    background-color: transparent;
    outline: none;
    border-color: transparent;
}

.file-panel input:focus {
    outline: none;
    border-color: transparent;
}
</style>
