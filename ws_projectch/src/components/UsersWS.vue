<template>
    <div class="container">
    <div v-if="loading" class="loading-overlay">
      <div class="spinner-border" role="status">
        <span class="sr-only"></span>
      </div>
      <p>Loading...</p>
    </div>
    <div v-else>
    <div class="row">
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
          <a class="navbar-brand" href="#">Gestion D'utilisation</a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarSupportedContent">
              <ul class="navbar-nav mr-auto">
                <!-- <li class="nav-item ">
                  <a class="nav-link" href="#">Proxies <span class="sr-only">(current)</span></a>
                </li> -->
              </ul>
              <form class="form-inline my-2 my-lg-0">
                <input v-model="search" class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search">
                <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
              </form>
            </div>
         </nav> 
         <div class="mx-auto"></div>
      <table class="table mt-4">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Email</th>
            <th>Rôle</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.Email">
            <td>{{ user.NOM }}</td>
            <td>{{ user.EMAIL }}</td>
            <td>{{ user.ROLECODE }}</td>
            <td>
                <div class="dropdown">
                    <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                      <img :src="require(`../assets/grading.png`)" alt="" style="width: 20px; height: 30px; border-radius: 50%;">
                    </button>
                    <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1" style="width: auto;">
                      <li class="d-flex justify-content-between align-items-center">
                        <router-link :to="`/user/EditProcUrl/${user.ID}`" class="btn btn-sm btn-primary">
                          <img :src="require(`../assets/edit.png`)" style="width: 20px; height: 20px; border-radius: 50%;">
                        </router-link>
                        <button @click="showDeleteConfirmation(user.ID)" class="btn btn-sm btn-danger" style="display: flex; justify-content: center; align-items: center; margin-right: 40px;">
                          <img :src="require(`../assets/delete.png`)" alt="" style="width: 20px; height: 20px; border-radius: 50%;">
                        </button>
                      </li>
                    </ul>
                  </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
</div>
</div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        users: [], // Liste des utilisateurs
      };
    },
    mounted() {
      this.fetchUsers();
    },
    methods: {
      async fetchUsers() {
        try {
          const response = await axios.get('/api/users'); // Appel à l'API pour récupérer les utilisateurs
          this.users = response.data; // Stocke les utilisateurs dans la variable 'users'
        } catch (error) {
          console.error('Erreur lors de la récupération des utilisateurs:', error);
          // Vous pouvez afficher un message d'erreur à l'utilisateur ici
        }
      },
    },
  };
  </script>
  
  <style scoped>
    body {
    background-color: #0078d4;
  }
  @media (min-width: 991.98px) {
    main {
      padding-left: 240px;
    }
  }
  
  /* Sidebar */
  .sidebar {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    padding: 58px 0 0; /* Height of navbar */
    box-shadow: 0 2px 5px 0 rgb(0 0 0 / 5%), 0 2px 10px 0 rgb(0 0 0 / 5%);
    width: 240px;
    z-index: 600;
  }
  
  @media (max-width: 991.98px) {
    .sidebar {
      width: 100%;
    }
  }
  .sidebar .active {
    border-radius: 5px;
    box-shadow: 0 2px 5px 0 rgb(0 0 0 / 16%), 0 2px 10px 0 rgb(0 0 0 / 12%);
  }
  
  .sidebar-sticky {
    position: relative;
    top: 0;
    height: calc(100vh - 48px);
    padding-top: 0.5rem;
    overflow-x: hidden;
    overflow-y: auto; /* Scrollable contents if viewport is shorter than content. */
  }
  h2 {
    font-size: 50px;
  }
    .delete-confirmation-message {
      background-color: #0078d4;
      border: 1px solid #ccc;
      border-radius: 5px;
      padding: 5px;
      margin: 10px;
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      width: 300px;
      position: absolute; 
      right: 200px; 
      top: 200px; 
    }
    
    .delete-confirmation-message button {
      padding: 5px 10px;
      margin: 5px;
      font-size: 14px;
      border: none;
      cursor: pointer;
      background-color: #0078d4;
      color: #fff;
      border-radius: 5px;
    }
    
    .delete-confirmation-message button:hover {
      background-color: #005a9e;
    }
    
    .confirmation-message {
      margin-top: 5px;
      font-weight: bold;
      font-size: 14px;
    }
.loading-overlay {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: #333;
}

.loading-overlay p {
  margin-top: 10px;
}
    
    
    
.container {
    max-width: 100%; /* Ajustez la valeur selon vos besoins */
    margin: 0 auto; /* Pour centrer le contenu horizontalement */
    padding: 20px;
    margin-top: 35px;
    margin-right: 5%; /* Ajoutez un peu d'espace intérieur si nécessaire */
  }
  .navbar-brand{
    margin-left: 16%;
  }

  .mx-auto{
    max-width: 80%;
    margin-left: 50%;
  }
  .table{
    max-width: 80%;
    margin-left: 20%;
  }
  
  .dropdown-menu li .btn-primary {
    margin-left: 20%; /* Ajustez cette valeur selon vos besoins */
  }

  .dropdown-menu li .btn-danger {
    margin-left:8%; /* Ajustez cette valeur selon vos besoins */
  }

    .custom-style {
      background-color: #aaaaee; /* Couleur de fond différente */
      color: #0d0c0c; /* Couleur de texte différente */
      font-weight: bold; /* Texte en gras */
    }
  </style>
  