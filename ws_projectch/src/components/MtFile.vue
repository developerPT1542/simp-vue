<template>
  <div class="file-manager">
    <h1>File Manager</h1>
    <h2>File MT Content:</h2>
    <div class="edit-section">

      <textarea v-model="newContent" rows="10" cols="50"></textarea>
      <br />
      <button class="btn" @click="saveFile">Save File</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      fileContent: '',
      newContent: ''
    };
  },
  created() {
    this.fetchFile();
  },
  methods: {
    async fetchFile() {
      try {
        const response = await axios.get('/api/fille');
        this.fileContent = response.data;
        this.newContent = response.data;
      } catch (error) {
        console.error('Error fetching file:', error);
        alert('Error fetching file.');
      }
    },
    async saveFile() {
      try {
        await axios.post('/api/fille', { content: this.newContent });
        alert('File saved successfully.');
      } catch (error) {
        console.error('Error saving file:', error);
        alert('Error saving file.');
      }
    }
  }
};
</script>

<style scoped>
.file-manager {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1 {
  color: #35495e;
  margin-bottom: 20px;
}

.btn {
  background-color: #42b983;
  border: none;
  color: white;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 10px 2px;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.btn:hover {
  background-color: #36966e;
}

.file-content, .edit-section {
  margin: 20px auto;
  width: 80%;
  text-align: left;
  margin-left: 20%;
}

textarea {
  width: 80%;
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-top: 10px;

}

pre {
  background-color: #f8f8f8;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
