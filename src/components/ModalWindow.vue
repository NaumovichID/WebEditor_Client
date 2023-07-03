<template>
<div v-if="show" class="modal">
    <div class="modal-content">
        <h3 class="text-primary">{{ title }}</h3>
        <p>{{ content }}</p>
        <div v-if="share">

        </div>
        <div v-else>
            <input type="text" v-model="fileLink" />
            <p class="text-danger">{{ message }}</p>
        </div>
        <div class="row m-2 d-flex flex-row-reverse">
            <button class="btn btn-outline-danger" @click="closeModal">Cancel</button>
            <div v-if="share">

            </div>
            <div v-else>
                <button class="btn btn-primary mr-2" @click="uploadFileFromLink">Open</button>
            </div>

        </div>

    </div>
</div>
</template>

<script>
import {
    API_BASE_URL
} from '../api/api.js';
export default {
    props: {
        show: Boolean,
        share: Boolean,
        title: String,
        content: String,
    },
    data() {
        return {
            fileLink: '',
            message: ''
        };
    },
    methods: {
        uploadFileFromLink() {
            const getFileUrl = `${API_BASE_URL}/${this.fileLink}`;
            fetch(getFileUrl, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(response => {
                    if (response.ok) {
                        console.log('File uploaded successfully');

                        return response.json();
                    } else {
                        console.error('Error uploading file');
                    }
                })
                .then(dataFromServer => {
                    this.$emit('api-call-file', dataFromServer);
                    this.$emit('close');
                })
                .catch(error => {
                    console.error('Error uploading file', error);
                    this.message = 'Please, enter the link!';
                });
        },
        closeModal() {
            this.$emit('close');
        },
    },
};
</script>

<style scoped>
.modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-content {
    max-width: 665px;
    background-color: white;
    margin: 20px;
    padding: 20px;
    border: none;
    border-radius: 8px;
}

input {
    width: 600px;
    border: none;
    outline: none;
    border-bottom: 2px solid #007bff;
    padding: 8px;
}
</style>
