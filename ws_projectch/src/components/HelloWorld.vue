<template>
  <div class="container">
    <div v-if="loading" class="loading-overlay">
      <div class="spinner-border" role="status">
        <span class="sr-only">Loading...</span>
      </div>
      <p>Loading...</p>
    </div>
    
    <div v-else>
    <div class="row">
        <nav class="navbar navbar-expand-lg navbar-light bg-light ">
          <a class="navbar-brand" href="#">Log</a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarSupportedContent">
              <ul class="navbar-nav mr-auto">
                <li class="nav-item ">
                  <a class="nav-link" href="#">log <span class="sr-only">(current)</span></a>
                </li>
              </ul>
              <form class="form-inline my-2 my-lg-0">
                <input v-model="search" class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search">
                <button class="btn btn-outline-success my-2 my-sm-0" type="submit" @click="fetchUsers">Search</button>
              </form>
            </div>
         </nav>        
        
        
        <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Voir detail</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body" id="content">
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Fermer</button>
              </div>
            </div>
          </div>
        </div>
        <!-- <div class="mx-auto"> -->
        <table class="table table-striped border">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Fonction</th>
              <th scope="col">IP source</th>
              <!-- <th scope="col">ID Fonction</th> -->
              <th scope="col">Status</th>
              <th scope="col">Date Response</th>
              <th scope="col">Response</th>
              <th scope="col">Log Trace</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          
          <tbody>
            <tr v-for="user in paginatedUsers" :key="user.ID">
              
              <td>{{ user.ID }}</td>
              <td>{{ user.FUNCTION_NAME }}</td>
              <td>{{ user.URL_ENDPOINT }}</td>
              <!-- <td>{{ user.ID_FONCTION }}</td> -->
              <td>{{ user.STATUS }}</td>
              <td>{{ formatDate(user.DATE_RESPONSE) }}</td>
              <td>{{  truncateText(user.RESPONSE,50) }}</td>
              <td>
                {{ truncateText(user.LOG_TRACE, 50) }}
              </td>

              <td>
                <button @click="showModal(user)" class="btn btn-info" data-toggle="modal" data-target="#exampleModal">Details</button>
              </td>
            </tr>
          </tbody>
          
        </table>
        

        <!-- Pagination -->
        <nav aria-label="Page navigation example">
            <ul class="pagination">
              <li class="page-item" :class="{ disabled: currentPage === 1 }">
                <a class="page-link" @click="changePage(currentPage - 1)" href="#">Previous</a>
              </li>
              <li class="page-item" v-for="page in totalPages" :key="page" :class="{ active: currentPage === page }">
                <a class="page-link" @click="changePage(page)" href="#">{{ page }}</a>
              </li>
              <li class="page-item">
                <a class="page-link" @click="changePage(currentPage + 1)" href="#">Next</a>
              </li>
            </ul>
          </nav>
      </div> 
    </div>
  </div>
</template>



<script>
import axios from 'axios';
// import Swal from 'sweetalert2';
import moment from 'moment';
import  'jquery';


export default {
  data() {
    return {
      users: [],
      // showDeleteDialog: false,
      // userIdToDelete: null,
      // deleteConfirmationMessage: '',
      currentPage: 1, 
      itemsPerPage: 50, 
      loading: true,
      search: '',
      // selectedUser: null,
      // detailsModalVisible: false,
          
    };
  },
 
  computed: {
    paginatedUsers() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      return this.users
    .slice(startIndex, endIndex)
    .filter(user => {
      const searchString = this.search.toLowerCase();
      return (
        user.ID.toString().includes(searchString) ||
        (user.URL_ENDPOINT && user.URL_ENDPOINT.toString().toLowerCase().includes(searchString)) ||
        (user.FUNCTION_NAME && user.FUNCTION_NAME.toString().toLowerCase().includes(searchString))||
        (user.STATUS && user.STATUS.toString().toLowerCase().includes(searchString))||
        (user.DATE_RESPONSE && user.DATE_RESPONSE.toString().toLowerCase().includes(searchString))||
        (user.RESPONSE && user.RESPONSE.toString().toLowerCase().includes(searchString))||
        (user.LOG_TRACE && user.LOG_TRACE.toString().toLowerCase().includes(searchString))
      );
    });
  },
    totalPages() {
      return Math.ceil(this.users.length / this.itemsPerPage);
    },

  },
  methods: {
    changePage(page) {
          this.currentPage = page;
          this.fetchUsers();
        },

    async fetchUsers() {
      try {
        this.loading = true;
            let startIndex = (this.currentPage - 1) * this.itemsPerPage;
            let endIndex = startIndex + this.itemsPerPage;
            console.log(startIndex+":"+endIndex);
          
       
        const response = await axios.post('/api/users/allWS', {
            startIndex,
            endIndex
        }); 
        if (response.data === '')
          {
            this.loading = true;
            this.currentPage = 1 ;
            this.users = [];
              startIndex = (this.currentPage - 1) * this.itemsPerPage;
              endIndex = startIndex + this.itemsPerPage;
              console.log(startIndex+":"+endIndex);

       const response1 = await axios.post('/api/users/allWS', {
              startIndex,
              endIndex
             });
             this.users = [...this.users, ...response1.data];
             this.users.splice( this.itemsPerPage, ...response1.data);
          }
          else
          {
            this.users = [...this.users, ...response.data];
          }
            console.log('Data after fetch:', this.users);
            
          } catch (error) {
            console.error('Error fetching data', error);
          } finally {
            this.loading = false;
          }
        },
    truncateText(text, maxLength) {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    } else {
      return text;
    }
  },
  
 showModal(user) {
  let element = document.querySelector('.modal'); 
  element.classList.add('show');
  const content = document.getElementById("content")
  content.innerHTML =`
    <div class="modal-content">
      <div><strong>ID:</strong> ${user.ID}</div>
      <div><strong>Nom de Fonction:</strong>${user.FUNCTION_NAME}</div>
      <div><strong>Url:</strong>${user.URL_ENDPOINT}</div>
      <div><strong>Response:</strong> ${user.RESPONSE}</div>
      <div><strong>Status:</strong> ${user.STATUS}</div>
      <div><strong>Date Response:</strong> ${user.DATE_RESPONSE}</div>
      <div><strong>Log Trace:</strong> ${user.LOG_TRACE}</div>
    </div>
  `;
},

  //   showDetailsModal(user) {
  //   this.selectedUser = user;
  //   this.detailsModalVisible = true;
  //    // Ouvrir la modal Bootstrap
  // },
  // closeDetailsModal() {
  //   this.detailsModalVisible = false;
  //    // Fermer la modal Bootstrap
  // },

    
    
   
    // showDeleteConfirmation(Id) {
      
    //   Swal.fire({
    //         title: 'Are you sure?',
    //         text: "You won't be able to revert this!",
    //         icon: 'warning',
    //         showCancelButton: true,
    //         confirmButtonColor: '#3085d6',
    //         cancelButtonColor: '#d33',
    //         confirmButtonText: 'Yes, delete it!'
    //         }).then((result) => {
    //         if (result.isConfirmed) {
               
    //     axios.delete(`http://localhost:3000/api/users/deleteLog/${Id}`)
    //     .then(response => {
    //       if (response.status === 200) {
    //         this.fetchUsers(); 
    //       } else {
    //         console.error('Échec de la suppression de l\'utilisateur');
    //       }
    //     })
    //     .catch(error => {
    //       console.error('Erreur lors de la suppression de l\'utilisateur', error);
    //     });
    //             Swal.fire(
    //             'Deleted!',
    //             'Your user has been deleted.',
    //             'success'
    //             )
    //         }
    //     })
    // },
    
    
    goToUrls() {
      this.$router.push({ name: 'UrlsWs' }); 
    },
    goToMenu(){
        this.$router.push({ name: 'MenuWs'}); 

      },

    formatDate(date) {
      return moment(date).format('DD/MM/YY');
    },
    
  },
  mounted() {
    this.fetchUsers();
  },
}
</script>


<style scoped>

body {
  background-color: #fbfbfb;
}
@media (min-width: 991.98px) {
  main {
    padding-left: 240px;
  }
}
h2{
  font-size: 50px;
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
    max-width: 70%;
    margin-left: 23%;
    margin-top: 30px;
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

/* Sidebar */

.delete-confirmation-message {
  background-color: #fff;
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

.custom-search {
  height: 30px; /* Ajustez la hauteur selon vos besoins */
  width: 200px; /* Ajustez la largeur selon vos besoins */
}

.custom-input {
  height: 30px; /* Ajustez la hauteur selon vos besoins */
}

.search-icon {
  display: flex;
  align-items: center;
  padding: 0 10px;
}

.pagination{
  margin-left: 20%;
}

.search-icon i {
  font-size: 16px; /* Ajustez la taille de l'icône selon vos besoins */
}



.custom-style {
    background-color: #aaaaee; /* Couleur de fond différente */
    color: #0d0c0c; /* Couleur de texte différente */
    font-weight: bold; /* Texte en gras */
  }



</style>




