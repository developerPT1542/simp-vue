<template>
  <div class="container-fluid">
    <div class="form-card">
      <!-- Formulaire pour sélectionner les URLs et Headers -->
      <label for="endpoint-select">Select Endpoint:</label>
      <select id="endpoint-select" v-model="selectedEndpoint" @change="fetchUrlsAndHeaders">
        <option v-for="endpoint in endpoints" :key="endpoint.NAME" :value="endpoint.NAME">
          {{ endpoint.NAME }}
        </option>
      </select>

<div class="container-box">
  <h3>Headers</h3>
  <div v-for="header in headers" :key="header.header_id">
    <label class="checkbox-container">
      <input type="checkbox" v-model="selectedHeaders" :value="header.header_id" />
      {{ header.KEY_PARAM }}
    </label>
  </div>
</div>

<div class="container-box">
  <h3>URLs</h3>
  <div v-for="url in urls" :key="url.url_id">
    <label class="checkbox-container">
      <input type="checkbox" v-model="selectedUrls" :value="url.url_id" />
      {{ url.urllink }}
    </label>
  </div>
</div>


      <div class="button-group">
        <button class="btn btn-return" @click="goPage">Return</button>
        <button @click="submit" type="submit" class="btn btn-primary">Ajouter</button>
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
      selectedEndpoint: '',
      endpoints: [], // Liste des endpoints
      urls: [], // Liste des URLs récupérées
      headers: [], // Liste des Headers récupérés
      selectedUrls: [], // URLs sélectionnées pour l'envoi
      selectedHeaders: [] // Headers sélectionnés pour l'envoi
    };
  },
  methods: {
    async fetchUrlsAndHeaders() {
      if (!this.selectedEndpoint) return;

      try {
        const endpointName = this.selectedEndpoint.toUpperCase();
        const response = await axios.get(`/api/users/${endpointName}/urlsandheaders`);
        this.urls = response.data.urls;
        this.headers = response.data.headers;
        this.selectedUrls = []; // Réinitialiser les URLs sélectionnées
        this.selectedHeaders = []; // Réinitialiser les Headers sélectionnés
      } catch (error) {
        console.error('Erreur lors de la récupération des URLs et Headers:', error);
      }
    },
    async submit() {
      if (this.selectedUrls.length === 0 || this.selectedHeaders.length === 0) {
        alert('Veuillez sélectionner au moins une URL et un Header.');
        return;
      }

      try {
        const data = {
          urlIds: this.selectedUrls,
          headerIds: this.selectedHeaders
        };
        await axios.post('/api/users/addHeaderUrls', data);
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Header a été ajouté',
          showConfirmButton: false,
          timer: 1500
        });
        this.$router.push({ name: 'HeaderUrl' });
      } catch (error) {
        console.error('Erreur lors de l\'envoi des données:', error);
        alert('Erreur lors de l\'envoi des données');
      }
    },
    async fetchEndpoints() {
      try {
        const response = await axios.get('/api/users/endpoint');
        this.endpoints = response.data;
      } catch (error) {
        console.error('Erreur lors de la récupération des endpoints:', error);
      }
    },
    goPage(){
      this.$router.push({ name: 'HeaderUrl' });
    }
  },
  mounted() {
    // Fetch endpoints when the component is mounted
    this.fetchEndpoints();
  }
};
</script>

<style scoped>
  /* Global body style */
  body {
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200vh;
    background-color: #f8f9fa; /* Arrière-plan léger */
  }

  /* Container to centralize form */
  .container-fluid {
    margin-top: 80px; /* Marge de 50px en haut */
    display: flex;
    justify-content: center;
    align-items: center;
    height: calc(100vh - 50px); /* Ajustement pour inclure la marge */
    flex-direction: column;
  }

  /* Card-like form style */
  .form-card {
    background-color: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    width: 700px; /* Largeur modérée du formulaire */
    max-width: 200%;
    text-align: center;
  }

  /* Styling for the select dropdown */
  #endpoint-select {
    width: 100%;
    padding: 8px;
    margin-bottom: 15px;
    border-radius: 4px;
    border: 1px solid #ccc;
    font-size: 1rem;
  }

  .container-box {
  border: 2px solid #ddd; 
  margin: 20px 0; /* Space between the boxes */
  background-color: #f9f9f9; /* Light background color */
  border-radius: 8px; /* Rounded corners */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Subtle shadow for a clean look */
}

h3 {
  margin-top: 0; /* Ensure the heading isn't too far from the box */
  font-family: Arial, sans-serif;
  color: #333; /* Slightly darker text color */
}


  /* URL and Header labels styling */
  label {
    font-size: 0.95rem;
    color: #555;
  }

  .button-group {
    display: flex;
    justify-content: center;
    gap: 10px; /* Espacement entre les boutons */
    margin-top: 20px; /* Marge en haut pour les boutons */
  }

  /* Checkbox container */
  .checkbox-container {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 10px;
  }

  /* Styling checkboxes */
  input[type="checkbox"] {
    margin-right: 8px;
    transform: scale(1.2);
  }

  /* Submit button styling */
  .btn {
    background-color: #007BFF;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 5px;
    cursor: pointer;
    width: 100%;
    font-size: 1rem;
    margin-top: 20px;
  }

  .btn-return {
    background-color: #6c757d; /* Gris */
    color: white;
  }

  .btn-return:hover {
    background-color: #5a6268; /* Gris foncé */
  }


  /* Styling for responsiveness */
  @media (max-width: 768px) {
    .form-card {
      width: 90%;
    }
  }
</style>
