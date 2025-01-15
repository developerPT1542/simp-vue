<template>
  <div class="container-fluid mt-5">
    <div class="user-form text-center">
      <div class="col-md-9 col-lg-6 col-xl-5 mx-auto">
        <img
          src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
          class="img-fluid d-block mx-auto"
          alt="Sample image"
        />
      </div>
      <h2>Ajouter un utilisateur</h2>
      <form @submit.prevent="createUser">
        <div class="form-group">
          <label for="email">Email Adresse :</label>
          <input type="email" id="exampleInputEmail1" v-model="formData.Email" required />
        </div>

        <div class="form-group">
          <label for="username">Nom d'utilisateur :</label>
          <input type="text" id="username" v-model="formData.username" required />
        </div>

        <div class="form-group">
          <label for="password">Mot de Passe :</label>
          <input type="password" id="password" v-model="formData.password" required />
        </div>

        <div class="button-group">
          <button type="submit" class="btn btn-primary">S'inscrire</button>
          <p class="small fw-bold mt-2 pt-1 mb-0">
            Already have an account? <a @click="goToLogin" href="#!" class="link-danger">Login</a>
          </p>
        </div>
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
      formData: {
        Email: '',
        username: '',
        password: '',
      },
    };
  },
  methods: {
    async createUser() {
      try {
        const response = await axios.post('/api/users/addUser', this.formData);
        console.log('Réponse du serveur:', response.data);
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Utilisateur ajouté avec succès',
          showConfirmButton: false,
          timer: 1500,
        });
        this.$router.push({ name: 'LoginSimp' });
      } catch (error) {
        console.error('Erreur lors de l\'inscription de l\'utilisateur', error);
        if (error.response && error.response.status === 409) {
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: "L'email ou le nom d'utilisateur existe déjà",
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Erreur serveur',
            text: 'Une erreur est survenue. Veuillez réessayer plus tard.',
          });
        }
      }
    },
    goToLogin() {
      this.$router.push({ name: 'LoginSimp' }); // Redirection vers la page de connexion
    },
  },
};
</script>

<style scoped>
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

input[type='email'],
input[type='text'],
input[type='password'] {
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

.btn-primary:hover {
  opacity: 0.9;
}

.button-group {
  margin-top: 20px;
}

.alert {
  font-size: 14px;
  padding: 10px;
  margin-top: 20px;
}

.alert-danger {
  background-color: #f8d7da;
  color: #721c24;
}

.alert-success {
  background-color: #d4edda;
  color: #155724;
}
</style>
