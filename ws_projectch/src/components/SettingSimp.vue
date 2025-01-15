<template>
<section style="background-color: #eee;">
  <div class="container py-5">
    <div class="row">
      <div class="col">
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
          <a class="navbar-brand" href="#" style="margin-left: 12%;">PROFIL</a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarSupportedContent float-end">
              <ul class="navbar-nav mr-auto">
                <li class="nav-item ">
                  <a class="nav-link" href="#">User <span class="sr-only">(current)</span></a>
                </li>
              </ul>
            </div>
         </nav> 
      </div>
    </div>

    <div v-if="user">
      <div class="row" style="margin-left: 25%; margin-top: 15px;">
        <div class="col-lg-8">
          <div class="card mb-4">
            <div class="card-body">
              <div class="row">
                <div class="col-sm-3">
                  <p class="mb-0">Full Name</p>
                </div>
                <div class="col-sm-9">
                  <p class="text-muted mb-0">{{ user.Nom }}</p>
                  <!-- <p type="text" id="functionName" :v-model = "user.Nom" required></p> -->
                </div>
              </div>
              <hr>
              <div class="row">
                <div class="col-sm-3">
                  <p class="mb-0">Email</p>
                </div>
                <div class="col-sm-9">
                  <p class="text-muted mb-0">{{ user.Email }}</p>
                  <!-- <p type="text" id="functionName" :value="user.Email" readonly></p> -->
                </div>
              </div>
            </div>
          </div>
        
          <div class="card card-outline-secondary">
            <div class="card-header">
              <h3 class="mb-0">Change Password</h3>
            </div>
            <div class="card-body">
              <form @submit.prevent="changePassword" class="form" role="form" autocomplete="off">
                <div class="form-group">
                  <label for="inputPasswordOld">Current Password</label>
                  <input type="password" v-model="oldPassword" class="form-control" id="inputPasswordOld" required>
                </div>
                <div class="form-group">
                  <label for="inputPasswordNew">New Password</label>
                  <input type="password" v-model="newPassword" class="form-control" id="inputPasswordNew" required>
                  <span class="form-text small text-muted">
                    The password must be 8-20 characters, and must <em>not</em> contain spaces.
                  </span>
                </div>
                <div class="form-group">
                  <label for="inputPasswordNewVerify">Verify</label>
                  <input type="password" v-model="confirmPassword" class="form-control" id="inputPasswordNewVerify" required>
                  <span class="form-text small text-muted">
                    To confirm, type the new password again.
                  </span>
                </div>
                <div class="form-group">
                  <button type="submit" class="btn btn-success btn-lg float-right">Save</button>
                </div>
              </form>
          </div>
        </div>
       </div>
      </div>
    </div>
    <div v-else>
      <div class="row" style="margin-left: 25%;">
        <div class="col-lg-8">
          <p>Chargement...</p>
        </div>
      </div>
    </div>
</div> 
</section>

</template>
<script>
import axios from 'axios';

export default {
  data() {
    return {
      user: {
        Id: '',
        Nom: '',
        Email: '',
      },
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
  },
  created() {
      this.affiche();
    },
  methods: {
  async affiche() {
    console.log('front')
    const Id = this.$route.params.Id;
   
    console.log(this.user.Nom)
    try {
      const response = await axios.get(`/api/user/${Id}`);
      this.user = response.data.user;
      this.user.Id = Id;
      console.log(this.user.Nom + 'hello')
      console.log(this.user);

      
    } catch (error) {
      console.log('Erreur:', error);
      alert('Erreur lors de la récupération des informations de l\'utilisateur');
    }
  },
  async changePassword() {
      try {
        // Validation du formulaire
        if (this.newPassword !== this.confirmPassword) {
          alert('Les mots de passe ne correspondent pas.');
          return;
        }
        // Envoyer la demande de changement de mot de passe au backend
        const response = await axios.post('/api/users/resetPassword', {
          ID: this.user.Id,
          newPassword: this.newPassword
        });
        this.$router.push({ name: 'LoginSimp'})

        console.log(this.user.Id);


        alert(response.data.message);
      } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de la réinitialisation du mot de passe.');
      }
    }
    
},
mounted() {
    this.affiche();
  },
};
 
</script>
    