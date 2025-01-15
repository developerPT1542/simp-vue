<template>
  <div class="file-container">
    <div class="upload-container">
      <h1 class="title">Convert MX File</h1>
      <input type="file" @change="handleFileUpload" class="file-input" />
      <button @click="uploadFile" class="upload-button">Upload</button>
    </div>

    <div v-if="filePath" class="file-info">
      <h3>File uploaded successfully:</h3>

      <!-- <a :href="filePath" target="_blank">{{ filePath }}</a> -->
    </div>
    <div v-if="pythonResponse" class="python-response">
      <h3>Response</h3>
      <pre>{{ pythonResponse }}</pre>
    </div>
    <div v-if="fileContent" class="file-content">
      <h3>File Content:</h3>
      <form class="file-content-form">
        <textarea v-model="fileContent" class="file-content-textarea"></textarea>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      selectedFile: null,
      fileContent: '',
      filePath: '',
      pythonResponse: ''
    };
  },
  methods: {
    handleFileUpload(event) {
      this.selectedFile = event.target.files[0];
      this.readFileContent();
    },
    async uploadFile() {
      if (!this.selectedFile) {
        alert('Please select a file first');
        return;
      }

      const formData = new FormData();
      formData.append('file', this.selectedFile);

      try {
        const response = await axios.post('/api/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        this.filePath = response.data.filePath;
        alert('File uploaded successfully:')


       const pythonResponse = await axios.post('http://144.91.74.246:8888/generatefilemx', {
        path: `/home/pts/BOASIMP_WS/serverch_ws/${this.filePath}`
      },{
        responseType: 'blob'  // Important for handling file download
      });

      const url = window.URL.createObjectURL(new Blob([pythonResponse.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'MX_TO_MT.txt'); // Set the file name
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to process file');
    }
  },
    readFileContent() {
      if (!this.selectedFile) return;

      const reader = new FileReader();
      reader.onload = () => {
        this.fileContent = reader.result;
      };
      reader.readAsText(this.selectedFile);
    }
  }
};
</script>

<style>
.file-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 40px;
}

.upload-container {
  text-align: center;
  margin-bottom: 20px;
}

.title {
  margin-bottom: 20px;
  font-size: 24px;
  margin-top: 30px;
}

.file-input {
  margin-bottom: 20px;
}

.upload-button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  font-size: 16px;
  cursor: pointer;
}

.file-content, .file-info, .python-response {
  margin-top: 20px;
}

.file-content-form {
  width: 90%;
}

.file-content-textarea {
  width: 400px;
  height: 400px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: vertical;
}
</style>
