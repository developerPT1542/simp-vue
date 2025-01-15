<template>
    <div class="container-fluid mt-5">
    <div class="user-form text-center">
      <h2>Éditer</h2>
      <form @submit.prevent="updateEnd">

        <div class="form-group">
          <label for="functionName">Nom de la fonction:</label>
          <input type="text" id="functionName" :value="editedUser.fonction_name" readonly>
        </div>
        <div class="form-group">
          <label for="functionName">Url Link:</label>
          <input type="text" id="functionName" :value="editedUser.url_name" readonly>
        </div>
                
        <div class="form-group">
          <label for="url">INPUTNAME:</label>
          <input type="text" id="url" v-model="editedUser.inputname" required>
        </div>
        <div class="form-group">
          <label for="url">DESTINATION NAME:</label>
          <input type="text" id="url" v-model="editedUser.destinationname" required>
        </div>
        <div class="form-group">
          <label for="url">TOLOG:</label>
          <select class="form-select" aria-label="Default select example" v-model="editedUser.tolog" required>
                <option value="1">Vrai</option>
                <option value="0">Faux</option>
                </select>
                <p v-if="editedUser.TOLOG === '1'"></p>
                <p v-else-if="editedUser.TOLOG === '0'"></p>
        </div>
        <div class="form-group">
          <label for="url">INPUTOUTPUT:</label>
          <select class="form-select" aria-label="Default select example" v-model="editedUser.inputoutput" required>
                <option value="in">in</option>
                <option value="out">out</option>
            </select>
                <p v-if="editedUser.inputoutput === 'in'"></p>
                <p v-else-if="editedUser.inputoutput === 'out'"></p>
        </div>
        <!-- <div class="form-group">
         <label for="username">RESPONSE CODE:</label>
         <select class="form-select" aria-label="Default select example" v-model="editedUser.RESPONSECODE" required >
                <option value="200">200</option>
                <option value="400">400</option>
            </select>
                <p v-if="editedUser.RESPONSECODE === '200'"></p>
                <p v-else-if="editedUser.RESPONSECODE === '400'"></p>
       </div> -->
        <div class="form-group">
          <label for="url">MANDATORY:</label>
          <select class="form-select" aria-label="Default select example" v-model="editedUser.mandatory" required>
          <option value="1">Vrai</option>
                <option value="0">Faux</option>
                </select>
                <p v-if="editedUser.MANDATORY === '1'"></p>
                <p v-else-if="editedUser.MANDATORY === '0'"></p>
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
            fonction_name: '',
            url_name: '',
            inputname: '',     
            destinationname: '',
            tolog: 1,
            inputoutput: 'in',
            mandatory: 1,
            
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
          const response = await axios.get(`/api/users/getMap/${Id}`);
          this.editedUser = response.data;
          this.editedUser.Id = Id;

          console.log('API Response:', response.data);

          // if (this.editedUser.fonction_name) {
          //   console.log('Fonction Name:', this.editedUser.fonction_name);
          // } else {
          //   console.log('Fonction Name is not present in the API response.');
          // }
        } catch (error) {
          console.error('Erreur lors de la récupération des données de l\'utilisateur', error);
        }
      },
      async updateEnd() {
        try {
          const response = await axios.put(`/api/users/updateMap/${this.editedUser.Id}`, this.editedUser);
          if (response.status === 200) {
            console.log('Mise à jour réussie, redirection...');
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'mapping a été modifié',
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
        this.$router.push({ name: 'MappingWs' });
      },
      goPage(){
      this.$router.push({ name: 'MappingWs' });
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