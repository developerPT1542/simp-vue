<!-- Navbar.vue -->

<template>
  <nav id="sidebarMenu" class="collapse d-lg-block sidebar collapse bg-light custom-scrollbar">
    <div class="position-sticky">
      <div class="list-group list-group-flush mx-3 mt-2">
        <h2 class="text-uppercase text-muted mt-2">Profils</h2>
    <div class="accordion" id="dashboardAccordionProfils">
      <div class="accordion-item bg-white border-0">
        <h2 class="accordion-header" id="headingProfils">
          <button class="accordion-button text-dark bg-info border-0 collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseProfils" aria-expanded="false" aria-controls="collapseProfils">
            <i class="fas fa-network-wired me-2"></i> Setting
          </button>
        </h2>
        <div id="collapseProfils" class="accordion-collapse collapse" aria-labelledby="headingProfils" data-bs-parent="#dashboardAccordionProfils">
          <div class="accordion-body">
            <router-link :to="`/SettingSimp/${user.Iduser}`" class="list-group-item list-group-item-action py-2 ripple text-dark">
              Personnel Information
            </router-link>
            <router-link v-if="hasAccess" to="/usersWs/" class="list-group-item list-group-item-action py-2 ripple text-dark" >
          <!-- <img :src="require(`../assets/administrateur.png`)" alt="" style="width: 30px; height: 30px; border-radius: 50%; margin-right: 10px;"> -->
        Administrator
        </router-link>
          </div>
        </div>
      </div>
    </div>
  <sub><h2 class="text-uppercase text-muted mt-2">Dashboard</h2></sub>
      <div class="accordion" id="dashboardAccordion">
        <!-- Endpoint Management -->
        <div class="accordion-item bg-white border-0">
          <h2 class="accordion-header" id="headingEndpoint">
            <button class="accordion-button text-dark bg-info border-0 collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseEndpoint" aria-expanded="false" aria-controls="collapseEndpoint">
              <i class="fas fa-network-wired me-2"></i> Endpoint Management
            </button>
          </h2>
          <div id="collapseEndpoint" class="accordion-collapse collapse" aria-labelledby="headingEndpoint" data-bs-parent="#dashboardAccordion">
  <div class="accordion-body">
    <router-link to="/user/" class="list-group-item list-group-item-action py-2 ripple text-dark">
      <img :src="require(`../assets/home.png`)" alt="" style="width: 30px; height: 30px; border-radius: 50%; margin-right: 10px;">
      <i class="fas fa-home me-2"></i>Home
    </router-link>
    <router-link to="/end/" class="list-group-item list-group-item-action py-2 ripple text-dark">
      <img :src="require(`../assets/network_node.png`)" alt="" style="width: 30px; height: 30px; border-radius: 50%; margin-right: 10px;">
      <i class="fas fa-network-wired me-2"></i>EndPoint
    </router-link>
    <router-link to="/user/urls" class="list-group-item list-group-item-action py-2 ripple text-dark">
      <img :src="require('../assets/link.png')" alt="" style="width: 30px; height: 30px; border-radius: 50%; margin-right: 10px;">
      <i class="fas fa-link me-2"></i>Url
    </router-link>
    <router-link to="/header/" class="list-group-item list-group-item-action py-2 ripple text-dark">
      <img :src="require('../assets/format_align_center.png')" alt="" style="width: 30px; height: 30px; border-radius: 50%; margin-right: 10px;">
      <i class="fas fa-cogs me-2"></i>Header
    </router-link>
    <router-link to="/headerUrl/" class="list-group-item list-group-item-action py-2 ripple text-dark">
      <img :src="require('../assets/format_align_center.png')" alt="" style="width: 30px; height: 30px; border-radius: 50%; margin-right: 10px;">
      <i class="fas fa-link me-2"></i>HeadUrl
    </router-link>
    <router-link to="/proxies/" class="list-group-item list-group-item-action py-2 ripple text-dark">
      <img :src="require('../assets/transition_dissolve.png')" alt="" style="width: 30px; height: 30px; border-radius: 50%; margin-right: 10px;">
      <i class="fas fa-server me-2"></i>Proxies
    </router-link>
    <router-link to="/ProcUrl/" class="list-group-item list-group-item-action py-2 ripple text-dark">
      <img :src="require('../assets/transition_dissolve.png')" alt="" style="width: 30px; height: 30px; border-radius: 50%; margin-right: 10px;">
      <i class="fas fa-link me-2"></i>ProxURL
    </router-link>
    <router-link to="/ProcApi/" class="list-group-item list-group-item-action py-2 ripple text-dark">
      <img :src="require('../assets/back_hand.png')" alt="" style="width: 30px; height: 30px; border-radius: 50%; margin-right: 10px;">
      <i class="fas fa-tasks me-2"></i>Process
    </router-link>
  </div>
</div>

        </div>
        <span>&nbsp;</span>
        <div class="accordion-item bg-white border-0">
          <h2 class="accordion-header" id="headingFonction">
            <button class="accordion-button text-dark bg-info border-0 collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFonction" aria-expanded="false" aria-controls="collapseFonction">
              <i class="fas fa-tools me-2"></i> Fonction Management
            </button>
          </h2>
          <div id="collapseFonction" class="accordion-collapse collapse" aria-labelledby="headingFonction" data-bs-parent="#dashboardAccordion">
            <div class="accordion-body">
              <router-link to="/fonction/" class="list-group-item list-group-item-action py-2 ripple text-dark">
                <img :src="require('../assets/open_with.png')" alt="" style="width: 30px; height: 30px; border-radius: 50%; margin-right: 10px;">
                <i class="fas fa-tasks me-2"></i>Fonction
              </router-link>

              <router-link to="/mapping/" class="list-group-item list-group-item-action py-2 ripple text-dark">
                <img :src="require('../assets/transition_dissolve.png')" alt="" style="width: 30px; height: 30px; border-radius: 50%; margin-right: 10px;">
                <i class="fas fa-tasks me-2"></i>Mapping
              </router-link>
            </div>
          </div>
        </div>
      </div>
      <sub><h2 class="text-uppercase text-muted mt-4">MT-MX</h2></sub>
      <div class="accordion" id="mtMxAccordion">
        <div class="accordion-item bg-white border-0">
          <h2 class="accordion-header" id="headingMtMx">
            <button class="accordion-button text-dark bg-info border-0 collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseMtMx" aria-expanded="false" aria-controls="collapseMtMx">
              <i class="fas fa-exchange-alt me-2"></i> MT-MX
            </button>
          </h2>
          <div id="collapseMtMx" class="accordion-collapse collapse" aria-labelledby="headingMtMx" data-bs-parent="#mtMxAccordion">
            <div class="accordion-body">
              <router-link to="/fils/" class="list-group-item list-group-item-action py-2 ripple text-dark">MT CONVERT</router-link>
              <router-link to="/fills/" class="list-group-item list-group-item-action py-2 ripple text-dark">MX CONVERT</router-link>
              <router-link :to="`/MtFile/`" class="list-group-item list-group-item-action py-2 ripple text-dark">MT FILE</router-link>
              <router-link to="/MxFile/" class="list-group-item list-group-item-action py-2 ripple text-dark">MX FILE</router-link>
            </div>
          </div>
        </div>
      </div>
      <sub><h2 class="text-uppercase text-muted mt-4">Life Cycle</h2></sub>
      <div class="accordion" id="lifeAccordion">
        <div class="accordion-item bg-white border-0">
          <h2 class="accordion-header" id="headinglife">
            <button class="accordion-button text-dark bg-info border-0 collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapselife" aria-expanded="false" aria-controls="collapselife">
              <i class="fas fa-exchange-alt me-2"></i> Token Cycle
            </button>
          </h2>
          <div id="collapselife" class="accordion-collapse collapse" aria-labelledby="headinglife" data-bs-parent="#lifeAccordion">
            <div class="accordion-body">
              <router-link to="/LifeCycle/" class="list-group-item list-group-item-action py-2 ripple text-dark">
                <img :src="require(`../assets/token.png`)" alt="" style="width: 30px; height: 30px; border-radius: 50%; margin-right: 10px;">
                Tokens</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</nav>
  <header>
      <nav id="main-navbar" class="navbar navbar-expand-lg navbar-light bg-info fixed-top">
    <!-- Container wrapper -->
    <div class="container-fluid">
     

      <a class="navbar-brand" href="#">
        <img
          :src="require(`../assets/SimpUI.png`)"
          height="30"
          alt="SIMP UI"
          loading="lazy"
        />
      </a>
      
        <h3>SIMP UI</h3>
        <span>&nbsp;</span>
        <button class="btn btn-info" style="display: flex; justify-content: center; align-items: center;">
            <img :src="require(`../assets/menu.png`)" alt="" style="width: 20px; height: 30px; border-radius: 50%;">
        </button>

        <button class="btn btn-info" style="display: flex; justify-content: center; align-items: center;">
          <img :src="require(`../assets/language.png`)" alt="" style="width: 20px; height: 30px; border-radius: 50%;">

        <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
          <li>
            <a class="dropdown-item" href="#"
              ><i class="flag-united-kingdom flag"></i>English
              <i class="fa fa-check text-success ms-2"></i
            ></a>
          </li>
          <li><hr class="dropdown-divider" /></li>
          <li>
            <a class="dropdown-item" href="#"><i class="flag-poland flag"></i>Polski</a>
          </li>
          <li>
            <a class="dropdown-item" href="#"><i class="flag-china flag"></i>中文</a>
          </li>
          <li>
            <a class="dropdown-item" href="#"><i class="flag-japan flag"></i>日本語</a>
          </li>
          <li>
            <a class="dropdown-item" href="#"><i class="flag-germany flag"></i>Deutsch</a>
          </li>
          <li>
            <a class="dropdown-item" href="#"><i class="flag-france flag"></i>Français</a>
          </li>
          <li>
            <a class="dropdown-item" href="#"><i class="flag-spain flag"></i>Español</a>
          </li>
          <li>
            <a class="dropdown-item" href="#"><i class="flag-russia flag"></i>Русский</a>
          </li>
          <li>
            <a class="dropdown-item" href="#"><i class="flag-portugal flag"></i>Português</a>
          </li>
        </ul>
      </button>

      <!-- Right links -->
      
      <ul class="navbar-nav ms-auto d-flex flex-row">
    <button class="btn btn-info" style="display: flex; justify-content: center; align-items: center;">
      <img :src="require(`../assets/chat_bubble.png`)" alt="" style="width: 20px; height: 30px; border-radius: 50%;">

    </button>
        <button class="btn btn-info" @click="LogOut" style="display: flex; justify-content: center; align-items: center;">
          <img :src="require(`../assets/power_settings.png`)" alt="" style="width: 20px; height: 30px; border-radius: 50%;">

        </button>
       
      </ul> 
      
    </div>
    
  </nav>
  <!-- Navbar -->
</header>

</template>

<script>
export default {
  data() {
    return {
      user: {
        Iduser: '',
      },
    };
  },
  methods: {
    
  LogOut() {
    localStorage.removeItem('token');
    this.$router.push({ name: 'LoginSimp' });
  },
  getIdUser(){
    const userId =  sessionStorage.getItem('userId');
    this.user.Iduser= userId;
    console.log('navbar'+ userId)
  }

    
  },

computed: {
  isAuthenticated() {
    return !!localStorage.getItem('token');
  },
  hasAccess() {
    const role = localStorage.getItem('role')
    if (!role) return false
     return role === 'admin'
   }
},
mounted() {
        this.getIdUser();
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



.sidebar {
position: fixed;
top: 0;
bottom: 0;
left: 0;
padding: 58px 0 0; 
box-shadow: 0 2px 5px 0 rgb(0 0 0 / 5%), 0 2px 10px 0 rgb(0 0 0 / 5%);
width: 240px;
z-index: 600;
}

@media (max-width: 991.98px) {
.sidebar {
  width: 100%;
}
}
nav{
  background-color: darkgray;
}
.sidebar .active {
border-radius: 5px;
box-shadow: 0 2px 5px 0 rgb(0 0 0 / 16%), 0 2px 10px 0 rgb(0 0 0 / 12%);
}
.custom-scrollbar {
  max-height: 100vh; /* Limite la hauteur de la sidebar à 100% de la hauteur de la fenêtre */
  overflow-y: auto;  /* Ajoute la barre de défilement verticale */
}
#main-navbar.navbar {
height: 60px; 
}

#main-navbar.navbar img {
max-height: 50px; 
}
.sidebar-sticky {
position: relative;
top: 0;
height: calc(100vh - 48px);
padding-top: 0.5rem;
overflow-x: hidden;
overflow-y: auto; 
}
h2 {
  font-size: 15px;
}

h3 {
  font-size: 20px;
}

.btn-info{
  font-size: 10px;
  max-width: 50px;

}


.list-group-item.router-link-active {
  background-color: cadetblue;
  color: black;
 
}



.material-symbols-outlined {
          font-size: 20px; /* Ajustez la taille de la police selon vos besoins */
          margin-right: 25px; /* Ajustez l'espacement horizontal entre les icônes */
      }
</style>
