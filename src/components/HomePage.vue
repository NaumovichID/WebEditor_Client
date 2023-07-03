<template>
<div class="home">

    <div v-if="fileContent" class="col file-panel">
        <div class="row justify-content-between">
            <input class="text-primary font-italic" type="text" v-model="fileName" placeholder="{{ fileName }}">
            <div class="row">
                <div v-if="isModified">
                    <button type="button" class="btn btn-outline-primary btn-sm" @click="saveFile">Save file</button>
                </div>
                <div v-else>
                    <button type="button" class="btn btn-outline-secondary btn-sm disabled" aria-disabled="true">Save file</button>
                </div>
                <div class="px-3">
                    <input type="file" ref="fileInput" accept=".txt" style="display: none" @change="handleFileChange">
                    <button class="btn btn-primary btn-sm" @click="openFileInput">Upload New</button>
                </div>
            </div>
        </div>

        <pre contenteditable="true" @input="handleFileContentInput">{{ fileContent }}</pre>
    </div>

    <div v-else class="file-select">
        <h1>Select a file</h1>
        <input type="file" ref="fileInput" accept=".txt" style="display: none" @change="handleFileChange">
        <button class="btn btn-primary" @click="openFileInput">Upload Text File</button>
    </div>

</div>
</template>

<script>
import {
    API_BASE_URL
} from '../api/api.js';
export default {
    name: 'HomePage',

    data() {
        return {
            fileContent: '',
            fileName: '',
            fileId: '',
            initialContent: '',
            shouldCallAPI: false,
        };
    },

    methods: {
        openFileInput() {
            this.$refs.fileInput.click();
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
                    const addFileUrl = API_BASE_URL;
                    fetch(addFileUrl, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(data)
                        })
                        .then(response => {
                            if (response.ok) {
                                console.log('File added successfully');

                                return response.json();
                            } else {
                                console.error('Error adding file');
                            }
                        })
                        .then(dataFromServer => {
                            this.fileId = dataFromServer.fileId;
                            console.log("fileid debuggingЖ " + this.fileId)
                            this.fileContent = dataFromServer.content;
                            this.initialContent = this.fileContent;
                            this.fileName = dataFromServer.fileName;
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
        handleFileContentInput(event) {
            this.fileContent = event.target.textContent;
            this.shouldCallAPI = true;
            if (!this.timer) {
                this.timer = setTimeout(this.makeAPICall, 2000);
            }
        },
        makeAPICall() {
            if (this.shouldCallAPI) {
                const data = {
                    fileName: this.fileName,
                    content: this.fileContent,
                    fileId: this.fileId
                };
                const updateFileUrl = '${API_BASE_URL}/${this.fileId}';
                fetch(updateFileUrl, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data)
                    })
                    .then(response => {
                        if (response.ok) {
                            console.log('File updated successfully');

                            return response.json();
                        } else {
                            console.error('Error updating file');
                        }
                    })
                    .then(dataFromServer => {
                        this.fileId = dataFromServer.fileId;
                        console.log("fileid debuggingЖ2 " + this.fileId)
                        this.fileContent = dataFromServer.content;
                        this.fileName = dataFromServer.fileName;
                    })
                    .catch(error => {
                        console.error('Error updating file', error);
                    });
                this.shouldCallAPI = false;
                this.timer = null;
            }
        },
        saveFile() {
            const fileData = this.fileContent;
            let fileName = this.fileName || 'filename.txt';
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
    computed: {
        isModified() {
            return this.fileContent !== this.initialContent;
        },
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
