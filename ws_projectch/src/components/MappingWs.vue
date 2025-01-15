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
          <a class="navbar-brand" href="#">MAPPING</a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarSupportedContent float-end">
              <ul class="navbar-nav mr-auto">
                <li class="nav-item ">
                  <a class="nav-link" href="#">Mapping <span class="sr-only">(current)</span></a>
                </li>
              </ul>
              <form class="form-inline my-2 my-lg-0">
              <input v-model="search" class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search">
              <button class="btn btn-outline-success my-2 my-sm-0" type="submit" @click="paginatedUsers">Search</button>
            </form>
            </div>
         </nav> 
         
           
          

        <div class="mx-auto">
          <button class="btn btn-success float-end" @click="goToAddMap">Ajouter</button>
          <table class="table table-striped border">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">INPUTNAME</th>
                <th scope="col">Destination Name</th>
                <th scope="col">TOLOG</th>
                <th scope="col">INPUTOUTPUT</th>
                <!-- <th scope="col">RESPONSE CODE</th> -->
                <th scope="col">MANDATORY</th>
                <th scope="col">Fonction</th>
                <th scope="col">processapi</th> 
                <th scope="col">Url</th> 
                <th scope="col">Actions</th>
              </tr>
            </thead>
          
            <tbody>
              <tr v-for="user in paginatedUsers" :key="user.ID">
                <td>{{ user.ID }}</td>
                 <!-- <td>
                   <div class="form-check">
                      <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
                      <label class="form-check-label" for="flexCheckDefault">
                      </label>
                    </div> 
                </td>  -->
                <td>{{ user.INPUTNAME }}</td>
                <td>{{ user.DESTINATIONNAME }}</td>
                <td>{{ user.TOLOG }}</td>
                <td>{{ user.INPUTOUTPUT }}</td>
                <!-- <td>{{ user.RESPONSECODE }}</td> -->
                <td>{{ user.MANDATORY }}</td>
                <td>{{ user.fonction_name }}</td>
                <td>{{ user.proc_name}}</td> 
                <td>{{ user.url_name }}</td> 


                <td>
                <div class="dropdown">
                  <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                    <img :src="require(`../assets/grading.png`)" alt="" style="width: 20px; height: 30px; border-radius: 50%;">
                  </button>
                  <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1" style="width: auto;">
                    <li class="d-flex justify-content-between align-items-center">
                      <router-link :to="`/user/editMap/${user.ID}`" class="btn btn-sm btn-primary">
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
    </div>
</template>


  
  <script>
  import axios from 'axios';
  import Swal from 'sweetalert2';
 
  
  
  export default {
    data() {
      return {
        users: [],
        showDeleteDialog: false,
        userIdToDelete: null,
        currentPage: 1, 
        itemsPerPage: 50, 
        deleteConfirmationMessage: '',
        loading: true,
        search:'',
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
          (user.DESTINATIONNAME && user.DESTINATIONNAME.toLowerCase().includes(searchString)) ||
          (user.INPUTNAME && user.INPUTNAME.toLowerCase().includes(searchString)) ||
          (user.INPUTOUTPUT && user.INPUTOUTPUT.toLowerCase().includes(searchString)) ||
          (user.RESPONSECODE && user.RESPONSECODE.toLowerCase().includes(searchString)) ||
          (user.FUNCTION_NAME && user.FUNCTION_NAME.toLowerCase().includes(searchString)) ||
          (user.TOLOG && user.TOLOG.toString().toLowerCase().includes(searchString))||
          (user.MANDATORY && user.MANDATORY.toString().toLowerCase().includes(searchString))
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
          const response = await axios.post('/api/users/mapping', {
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
            const response1 = await axios.post('/api/users/mapping', {
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
      showDeleteConfirmation(Id) {
        
        Swal.fire({
              title: 'Are you sure?',
              text: "You won't be able to revert this!",
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Yes, delete it!'
              }).then((result) => {
              if (result.isConfirmed) {
                 
          axios.delete(`/api/users/deleteMap/${Id}`)
          .then(response => {
            if (response.status === 200) {
              this.fetchUsers(); 
            } else {
              console.error('Échec de la suppression de l\'utilisateur');
            }
          })
          .catch(error => {
            console.error('Erreur lors de la suppression de l\'utilisateur', error);
          });
                  Swal.fire(
                  'Deleted!',
                  'Your user has been deleted.',
                  'success'
                  )
              }
          })
      },

      goToWord(){
        this.$router.push({ name: 'HelloWorld'}); 
      },

      goToMenu(){
        this.$router.push({ name: 'MenuWs'}); 

      },
      
      goToAddMap() {
        this.$router.push({ name: 'AddMap' }); 
      },

      goToEndPoint(){
        this.$router.push({ name: 'EndPoint' }); 
      },

      // changePage(page) {
      // if (page >= 1 && page <= this.totalPages) {
      //   this.currentPage = page;
      //   }
      // },
      // formatDate(date) {
      //   return moment(date).format('DD/MM/YY');
      // },

    },
    mounted() {
      this.fetchUsers();
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
h2 {
    font-size: 50px;
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
  
  

  .container {
  max-width: 120%; /* Ajustez la valeur selon vos besoins */
  margin: 0 auto; /* Pour centrer le contenu horizontalement */
  padding: 20px;
  margin-top: 35px;
  margin-right: 5%; /* Ajoutez un peu d'espace intérieur si nécessaire */
}
.navbar-brand{
  margin-left: 16%;
}

.mx-auto{
  max-width: 70%;
}
.table{
  max-width: 60%;
  margin-right: 50%;
  font-size: 65%;

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

.text-right button {
  margin-right: 60px;
}

.pagination {
  display: flex;
  justify-content: center;
  flex-wrap: wrap; /* Permet aux éléments de passer à la ligne si nécessaire */
  gap: 5px; /* Espacement entre les éléments */
  padding: 10px 0;
}

.page-item {
  list-style: none;
}

.page-link {
  display: inline-block;
  padding: 10px 15px;
  font-size: 14px;
  text-align: center;
  text-decoration: none;
  color: #007bff;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #fff;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.page-link:hover {
  background-color: #f8f9fa;
  color: #0056b3;
}

.page-item.disabled .page-link {
  pointer-events: none;
  color: #6c757d;
  background-color: #e9ecef;
  border-color: #ddd;
}

.page-item.active .page-link {
  color: #fff;
  background-color: #007bff;
  border-color: #007bff;
}

@media (max-width: 768px) {
  .page-link {
    font-size: 12px;
    padding: 8px 10px;
  }
}

@media (max-width: 576px) {
  .pagination {
    gap: 3px;
  }
  .page-link {
    font-size: 10px;
    padding: 5px 8px;
  }
}

  </style>
  
  
  
  
  