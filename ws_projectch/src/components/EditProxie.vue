<template>
    <div class="container-fluid mt-5">
    <div class="user-form text-center">
      <h2>Éditer</h2>
      <form @submit.prevent="updateEnd">
        <div class="form-group">
          <label for="functionName">EndPoint:</label>
          <input type="text" id="functionName" :value="editedUser.end_name" readonly>
        </div>
        <div class="form-group">
          <label for="url">key param:</label>
          <input type="text" id="url" v-model="editedUser.key_param" required>
        </div>
        <div class="form-group">
          <label for="url">Valeur PARAM:</label>
          <input type="text" id="url" v-model="editedUser.value_param" required>
        </div>
        <button class="btn btn-secondary" style="margin-right: 10px;" @click="goPage">return</button>

        <button type="submit" class="btn btn-primary">Enregistrer</button>
      </form>
    </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import Swal from 'sweetalert2';
  
  export default {
    data() {
      return {
        editedUser: {
            Id: '',
            end_name: '',
            key_param: '',      
            value_param: '',
           
        },
      };
    },
    created() {
      this.fetchUserData();
    },
    methods: {
    async fetchUserData() {
      const Id = this.$route.params.Id;
      try {
        const response = await axios.get(`/api/users/getproxies/${Id}`);
        this.editedUser = response.data;
        this.editedUser.Id = Id;
      } catch (error) {
        console.error('Erreur lors de la récupération des données de l\'utilisateur', error);
      }
    },
      async updateEnd() {
        try {
          const response = await axios.put(`/api/users/updateProxies/${this.editedUser.Id}`, this.editedUser);
          if (response.status === 200) {
            console.log('Mise à jour réussie, redirection...');
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'proxies a été modifié',
              showConfirmButton: false,
              timer: 1500,
            });
            this.goToList();
          }
        } catch (error) {
          console.error('Erreur lors de la mise à jour de l\'utilisateur', error);
        }
      },
      goToList() {
        this.$router.push({ name: 'ProxiesWs' });
      },
      goPage(){
      this.$router.push({ name: 'ProxiesWs' });
    }
    },
  };
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