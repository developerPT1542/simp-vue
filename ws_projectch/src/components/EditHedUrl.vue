<template>
    <div class="container">
      <h2>Modifier Header URL</h2>
      
      <form @submit.prevent="updateHeaderUrl">
        <div class="form-group">
          <label for="key_param">Key Param</label>
          <input type="text" id="key_param" v-model="editedUser.KEY_PARAM" required>
        </div>
        
        <div class="form-group">
          <label for="urllink">URL Link</label>
          <input type="text" id="url" v-model="editedUser.URLLINK" required>
        </div>
        
        <button type="submit" class="btn btn-primary mt-3">Mettre à jour</button>
      </form>
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
            KEY_PARAM: '',      
            URLLINK: '',
        },
    };
    },
    
    methods: {
      async fetchHeaderUrl() {
        const Id = this.$route.params.Id;
        try {
          const response = await axios.get(`/api/users/headerUrl/${Id}`);
          this.editedUser = response.data;
        this.editedUser.Id = Id;
        } catch (error) {
          console.error('Erreur lors de la récupération des données', error);
        }
      },
      
      async updateHeaderUrl() {
        try {
            const response = await axios.put(`/api/users/headerUrl/${this.editedUser.Id}`, this.editedUser);
          if (response.status === 200) {
            console.log('Mise à jour réussie, redirection...');
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'header a été modifié',
              showConfirmButton: false,
              timer: 1500,
            });
          }
          this.$router.push({ name: 'HeaderUrl' });
        } catch (error) {
          console.error('Erreur lors de la mise à jour', error);
        }
      },
    },
    mounted() {
      this.fetchHeaderUrl();
    },
  };
  </script>
  
  <style scoped>
  .container {
    max-width: 600px;
    margin: 50px auto;
  }
  </style>
  