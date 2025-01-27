<template>
    <div class="edit-user">
      <h1>Modifier l'utilisateur</h1>
      <form @submit.prevent="updateUser">
        <div class="form-group">
          <label for="email">Email :</label>
          <input
            type="email"
            id="email"
            v-model="editedUser.email"
            required
          />
        </div>
        <div class="form-group">
          <label for="name">Nom :</label>
          <input
            type="text"
            id="name"
            v-model="editedUser.nom"
            required
          />
        </div>
        <div class="form-group">
          <label for="role">Rôle :</label>
          <select id="role" v-model="editedUser.code" required>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
        </div>
        <button type="submit" class="btn btn-primary">Enregistrer</button>
      </form>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  import Swal from "sweetalert2";
  
  export default {
    name: "EditUser",
    data() {
      return {
        editedUser: {
          Id: "",
          email: "",
          nom: "",
          code: "",
        },
      };
    },
    created() {
      this.fetchUserData(); // Appel lors de la création du composant
    },
    methods: {
      async fetchUserData() {
        const Id = this.$route.params.Id; // Récupération de l'ID utilisateur
        try {
          const response = await axios.get(`/api/users/edit/${Id}`);
          this.editedUser = response.data;
           this.editedUser.Id = Id; // Affectation explicite de l'ID
        } catch (error) {
          console.error(
            "Erreur lors de la récupération des données de l'utilisateur",
            error
          );
          Swal.fire({
            icon: "error",
            title: "Erreur",
            text: "Impossible de charger les données de l'utilisateur.",
          });
        }
      },
      async updateUser() {
        try {
          const response = await axios.put(
            `/api/users/update/${this.editedUser.Id}`,
            this.editedUser
          );
          if (response.status === 200) {
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Utilisateur modifié avec succès",
              showConfirmButton: false,
              timer: 1500,
            });
            this.goToList();
          }
        } catch (error) {
          console.error("Erreur lors de la mise à jour de l'utilisateur", error);
          Swal.fire({
            icon: "error",
            title: "Erreur",
            text: "Échec de la mise à jour de l'utilisateur.",
          });
        }
      },
      goToList() {
        this.$router.push({ name: "UsersWS" });
      },
    },
  };
  </script>
  
  <style scoped>
  .edit-user {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background-color: #f9f9f9;
  }
  
  h1 {
    text-align: center;
    margin-bottom: 20px;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  label {
    display: block;
    font-weight: bold;
    margin-bottom: 5px;
  }
  
  input,
  select {
    width: 100%;
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  button {
    display: block;
    width: 100%;
    padding: 10px;
    background-color: #007bff;
    color: #fff;
    font-size: 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #0056b3;
  }
  </style>
  