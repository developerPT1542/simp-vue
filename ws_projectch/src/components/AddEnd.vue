<template>
    <div class="container-fluid mt-5">
    <div class="user-form text-center">
    
      <h2>Ajouter</h2>
      <form @submit.prevent="createEnd">
        <div class="form-group">
          <label for="email">Name:</label>
          <input type="text" id="exampleInputEmail1" v-model="formData.NAME" required>
        </div>   
        <div class="form-group">
          <label for="email">Certifile:</label>
          <input type="text" id="exampleInputEmail1" v-model="formData.CERTFILE">
        </div>      
        <button class="btn btn-secondary" style="margin-right: 10px;" @click="goPage()">return</button>
        <button type="submit" class="btn btn-primary">Ajouter</button>
      </form>
      <div class="button-group">
    </div>
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
            CERTFILE: '',
        },
      };
    },
    methods: {
      async createEnd() {
        try {
          const response = await axios.post('/api/users/addend', this.formData);
          console.log('Réponse du serveur:', response.data);
          Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'endpoint a été ajouté',
              showConfirmButton: false,
              timer: 1500
            })
            this.$router.push({ name: 'EndPoint' });
        } catch (error) {
          console.error('Erreur lors de la récupération des utilisateurs', error);
        }
        
      },
      goPage(){
      this.$router.push({ name: 'EndPoint' });
    }
    },
  };
  </script>
  
  <style>
  .user-form {
    max-width: 100px;
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
  