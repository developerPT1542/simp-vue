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
      <h2 class="mt-4">Sign In To SIMP UI</h2>
      <form @submit.prevent="login">
        <div class="form-group">
          <label for="username">Nom d'utilisateur :</label>
          <input type="text" id="username" v-model="formData.username" required />
        </div>
        <div class="form-group">
          <label for="password">Mot de passe :</label>
          <input type="password" id="password" v-model="formData.password" required />
        </div>
        <div class="button-group">
          <button type="submit" class="btn btn-primary">Se connecter</button>
          <p class="small fw-bold mt-2 pt-1 mb-0">
            Don't have an account? <a @click="goToRegister" href="#!" class="link-danger">Register</a>
          </p>
        </div>
      </form>

      <!-- Affichage du token JWT après connexion -->
      <div v-if="token" class="alert alert-success mt-4">
        <strong>Token JWT :</strong>
        <p>{{ token }}</p>
      </div>

      <!-- Affichage des erreurs -->
      <div v-if="error" class="alert alert-danger mt-4">
        <strong>Error:</strong>
        <p>{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      formData: {
        username: '',
        password: '',
      },
      token: '', // Variable pour stocker le token
      error: '', // Variable pour gérer les erreurs
    };
  },
  methods: {
    async login() {
      this.error = ''; // Réinitialiser l'erreur à chaque tentative de connexion
      try {
        const response = await axios.post('/api/users/login', this.formData);
        const { user, token } = response.data;

        // Stocker le token dans localStorage pour utilisation ultérieure
        localStorage.setItem('token', token);
        localStorage.setItem('role',user.roleCode)
        sessionStorage.setItem('userId', user.Iduser);
            // console.log('user' + JSON.stringify(user))
            // console.log(user.roleCode)
        // Mise à jour de la variable locale token
        this.token = token;

        // Redirection après connexion réussie
        this.$router.push({ name: 'HelloWorld', params: { Id: user.Iduser } });
      } catch (error) {
        console.error('Erreur lors de la connexion :', error);
        this.error = error.response?.data?.message || 'Erreur de connexion. Veuillez réessayer.';
      }
    },
    goToRegister() {
      this.$router.push({ name: 'RegistreWs' });
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
