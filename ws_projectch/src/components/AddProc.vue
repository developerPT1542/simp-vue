<template>
  <div class="container-fluid mt-5">
    <div class="user-form text-center">
      <h2>Ajouter</h2>
      <form @submit.prevent="createUser">

        <div class="form-group">
          <label for="email">Name:</label>
          <input type="text" id="username" v-model="formData.NAME" required>
        </div>

        <div class="form-group">
          <label for="username">PATHURL:</label>
          <input type="text" id="username" v-model="formData.PATHURL" required />
        </div>

      
        <!-- The "RESPONSE CODE" field is hidden -->
        <div class="form-group">
          <label for="username">POSTGET:</label>
          <select class="form-select" aria-label="Default select example" v-model="formData.POSTGET" required>
            <option value="post">post</option>
            <option value="get">get</option>
            <option value="put">put</option>
            <option value="delete">delete</option>
            <option value="patch">patch</option>
          </select>
        </div>

        <div class="form-group">
          <label for="username">ISASYNC:</label>
          <input type="text" id="username" v-model="formData.ISASYNC" required />
        </div>

        <div class="form-group">
          <label for="functionName">fonction:</label>
          <select class="form-select" v-model="formData.FUNCTIONID" required>
            <option v-for="func in functionOptions" :key="func.ID" :value="func.ID">{{ func.NAME }}</option>
          </select>
        </div>
        <button class="btn btn-secondary" style="margin-right: 10px;" @click="goPage">return</button>

        <button type="submit" class="btn btn-primary">Ajouter</button>
      </form>
      <div class="button-group"></div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';

export default {
  data() {
    return {
      formData: {
        NAME: '',
        PATHURL: '',
        POSTGET: '',
        ISASYNC: '',
        FUNCTIONID: '',
      },
      functionOptions: [],
    };
  },
   async created() {
    await this.fetchfunpro();
    
  },
   methods: {
    async fetchfunpro() {
      try {
        const responseRecup = await axios.get('/api/users/fonction');
        this.functionOptions = responseRecup.data;
        // this.processOptions = responseRecup.data;

      } catch (error) {
        console.error('Erreur lors de la récupération des donnees', error);
      }
    },
    async createUser() {
      try {
        // Make an axios post request to your backend for RESPONSECODE 200
        const response = await axios.post('/api/users/addProc', { ...this.formData});

        
        if (response.status === 200) {
          Swal.fire('Success', 'Enregistrements ajoutés avec succès', 'success');
          this.$router.push({ name: 'ProcApi' });
        } else {
          Swal.fire('Error', 'Échec de l\'ajout des enregistrements', 'error');
        }
      } catch (error) {
        console.error('Erreur lors de l\'ajout des enregistrements:', error);
        Swal.fire('Error', 'Erreur serveur', 'error');
      }
    },
    goPage(){
      this.$router.push({ name: 'ProcApi' });
    }
 },
}
 </script>
 
 <style>
 .user-form {
   max-width: 400px;
   margin: 0 auto;
   padding: 20px;
   background-color: #f7f7f7;
   border: 1px solid #ccc;
   border-radius: 5px;
   box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
 }
 
 .form-group {
   margin-bottom: 15px;
 }
 
 label {
   display: block;
   font-weight: bold;
 }
 
 input[type="text"],
 input[type="password"] {
   width: 100%;
   padding: 10px;
   border: 1px solid #ccc;
   border-radius: 3px;
 }
 
 .btn {
   padding: 10px 20px;
   border: none;
   border-radius: 3px;
   cursor: pointer;
 }
 
 .btn-primary {
   background-color: #007bff;
   color: #fff;
 }
 
 .btn-success {
   background-color: #28a745;
   color: #fff;
 }
 
 .btn-primary:hover,
 .btn-success:hover {
   opacity: 0.9;
 }
 .button-group {
 margin-top: 20px; 
}
 </style>
 