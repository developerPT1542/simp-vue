<template>
  <div class="container">
    <h1>Token Life Cycle</h1>
    <form class="form-box">
      <!-- Champs principaux -->
      <div class="form-row">
    <div class="form-group me-5">
      <label for="tokenUniqueReference">Token Unique Reference:</label>
      <input
        type="text"
        id="tokenUniqueReference"
        v-model="form.tokenUniqueReference"
        class="input-token long-input"
        placeholder="Enter Token Unique Reference"
      />
    </div>
    <div class="form-group">
      <label for="accountPan">Account Pan:</label>
      <input
        type="text"
        id="accountPan"
        v-model="form.AccountPan"
        class="input-token long-input"
        placeholder="Enter Account Pan"
      />
    </div>
  </div>
      <!-- Bouton More Details -->
      <button type="button" class="btn-details float-end" @click="toggleDetails">
        {{ showDetails ? "Hide Details" : "More Details" }}
      </button>
      <button class="btn-search float-end me-3" @click.prevent="search">Search</button>

      <!-- Checklists -->
      <transition name="fade">
        <div v-if="showDetails" class="details-section mt-5">
          <h2>Additional Options</h2>
          <div class="form-group">
  <label for="merchantId">Merchant ID:</label>
  <input
    type="text"
    id="merchantId"
    v-model="form.merchantId"
    class="small-input"
    placeholder="Enter Merchant ID"
  />
</div>
<div class="form-group">
  <label for="paymentAppInstanceId">Payment App Instance ID:</label>
  <input
    type="text"
    id="paymentAppInstanceId"
    v-model="form.paymentAppInstanceId"
    class="small-input"
    placeholder="Enter Payment App Instance ID"
  />
</div>
          
          <div class="form-checklist">
            <input
              type="checkbox"
              id="includeDeletedIndicator"
              v-model="form.includeDeletedIndicator"
            />
            <label for="includeDeletedIndicator">Include Deleted Indicator</label>
          </div>
          <div class="form-checklist">
            <input
              type="checkbox"
              id="includeDeviceTokensOnly"
              v-model="form.includeDeviceTokensOnly"
            />
            <label for="includeDeviceTokensOnly">Include Device Tokens Only</label>
          </div>
          <div class="form-checklist">
            <input
              type="checkbox"
              id="excludeTokensDeleted"
              v-model="form.excludeTokensDeleted"
            />
            <label for="excludeTokensDeleted">Exclude Tokens Deleted From Consumer App</label>
          </div>
        </div>
      </transition>

      <!-- Bouton Search -->
    </form>

    <!-- Résultats -->
    <div v-if="response" class="response-table mt-5">
      <div class="table-container">
        <div class="results-buttons">
          <button @click="activateTokens" class="btn btn-activate">Activate</button>
          <button class="btn btn-suspend" @click="suspendTokens">
            Suspend
          </button>
          <button class="btn btn-resume" @click="unsuspendTokens">
            Resume
          </button>
          <button type="button" class="btn btn-secondary" data-bs-toggle="dropdown" aria-expanded="false">
    ...
  </button>
    <button class="dropdown-menu btn-delete" @click="performAction('delete')">
        delete
      </button>
        </div>
        <table cellspacing="0" cellpadding="10">
          <thead>
            <tr>
              <th>Selection</th>
              <th>Account Pan Suffix</th>
              <th>Expiration Date</th>
              <th>Token Unique Reference</th>
              <th>Primary Account  Number </th>
              <th>Current Status Description</th>
              <th>Current Status Date Time</th>
              <th>Actions</th>

            </tr>
          </thead>
          <tbody>
            <tr v-for="(token, index) in allTokens" :key="index">
              <td>
                <input type="checkbox" v-model="selectedAccounts" :value="token" />
              </td>
              <td>{{ token.AccountPanSuffix }}</td>
              <td>{{ token.ExpirationDate }}</td>
              <td>{{ token.TokenUniqueReference }}</td>
              <td>{{ token.PrimaryAccountNumberUniqueReference }}</td>
              <td>{{ token.CurrentStatusDescription }}</td>
              <td>{{ token.CurrentStatusDateTime }}</td>
              <td>
               <button @click="showDetail(token)" class="btn btn-info">Détails</button>
             </td>
            </tr>
          </tbody>
        </table>
        <div>
        <div v-if="showToast" class="toast-container" aria-live="polite" aria-atomic="true" style="position: absolute; top: 10px; right: 10px;">
    <div class="toast show" style="position: relative;">
      <div class="toast-header">
        <strong class="mr-auto">Activation Status</strong>
        <button type="button" class="ml-2 mb-1 close" @click="closeToast">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="toast-body">
        Token Activated Successfully!
      </div>
    </div>
  </div>
  <div v-if="showSuspendToast" class="toast-container" aria-live="polite" aria-atomic="true" style="position: absolute; top: 10px; right: 10px;">
      <div class="toast show" style="position: relative; max-width: 300px;">
        <div class="toast-header">
          <strong class="mr-auto">Suspension Status</strong>
          <button type="button" class="ml-2 mb-1 close" @click="closeSuspendToast">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="toast-body">
          Token suspended successfully!
        </div>
      </div>
    </div>
    <div v-if="showUnSuspendToast" class="toast-container" aria-live="polite" aria-atomic="true" style="position: absolute; top: 10px; right: 10px;">
      <div class="toast show" style="position: relative; max-width: 300px;">
        <div class="toast-header">
          <strong class="mr-auto">UnSuspension Status</strong>
          <button type="button" class="ml-2 mb-1 close" @click="closeUnSuspendToast">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="toast-body">
          Token unsuspended successfully!
        </div>
      </div>
    </div>
  </div>
        <div v-if="selectedToken" class="modal-overlay" @click="closeDetails">
      <div class="modal-content" @click.stop>
        <h3>Détails du Token</h3>
        <p><strong>Account Pan Suffix:</strong> {{ selectedToken.AccountPanSuffix }}</p>
        <p><strong>Expiration Date:</strong> {{ selectedToken.ExpirationDate }}</p>
        <p><strong>Token Unique Reference:</strong> {{ selectedToken.TokenUniqueReference }}</p>
        <p><strong>Primary Account Number Unique Reference:</strong> {{ selectedToken.PrimaryAccountNumberUniqueReference }}</p>
        <p><strong>Current Status Description:</strong> {{ selectedToken.CurrentStatusDescription }}</p>
        <p><strong>Current Status DateTime:</strong> {{ selectedToken.CurrentStatusDateTime }}</p>
        <p><strong> Payment App Instance Id:</strong> {{ selectedToken. PaymentAppInstanceId }}</p>
        <div class="actions">
          <button @click="activateTokens" class="btn btn-activate">Activate</button>
    <button class="btn-suspend" @click="suspendToken(selectedToken)">Suspend</button>
    <button class="btn-resume" @click="resumeToken(selectedToken)">Resume</button>
    <button class="btn-delete" @click="deleteToken(selectedToken)">Delete</button>
        </div>
        <button @click="closeDetails">Fermer</button>
      </div>
    </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      form: {
        tokenUniqueReference: "",
        AccountPan: "",
        paymentAppInstanceId: "",
        merchantId: "",
        includeDeletedIndicator: false,
        includeDeviceTokensOnly: false,
        excludeTokensDeleted: false,
      },
      showDetails: false,
      response: null,
      selectedAccounts: [],
      selectedToken: null ,
      token:"",
      showToast: false,
      showSuspendToast: false,  
      showUnSuspendToast: false,  
      activatedToken: {},
      suspendeddToken: {},
      unsuspendeddToken: {},
    };
  },
  computed: {
    allTokens() {
      if (!this.response || !this.response.Accounts) return [];
      return this.response.Accounts.Account.flatMap((account) =>
        account.Tokens.Token.map((token) => ({
          ...token,
          AccountPanSuffix: account.AccountPanSuffix,
        }))
      );
    },
  },
  methods: {
    toggleDetails() {
      this.showDetails = !this.showDetails;
    },

    showDetail(token) {
      this.selectedToken = token;
    },
    closeDetails() {
      this.selectedToken = null;
    },
    async search() {
      if (!this.form.tokenUniqueReference && !this.form.AccountPan) {
        alert("Please fill in at least one search field.");
        return;
      }
      try {
        const payload = {
          action: "search",
          token_search: {
            TokenUniqueReference: this.form.tokenUniqueReference,
            AccountPan: this.form.AccountPan,
          },
        };
        const result = await axios.post("http://localhost:8080/mdescs", payload);
        this.response = result.data;
        console.log("Response:", result.data);
      } catch (error) {
        console.error("Error during search:", error);
        this.response = error.response ? error.response.data : null;
      }
    },
    async activateTokens() {
      if (this.selectedAccounts.length === 0) {
        alert("Veuillez sélectionner au moins un token à activer.");
        return;
      }

      try {
        // Boucle sur les tokens sélectionnés et envoie les requêtes
        for (const token of this.selectedAccounts) {
          if (token.TokenUniqueReference) {
            const payload = {
              action: "activate",
              token_activate: {
                TokenUniqueReference: token.TokenUniqueReference,
              },
            };

            const response = await axios.post("http://localhost:8080/mdescs", payload);
            console.log("Token activé:", response.data);
            
            // Met à jour le token activé pour afficher dans le toast
            this.activatedToken = token;
            this.showToast = true;  // Affiche le toast

            // Cache le toast après 3 secondes
           // setTimeout(() => {
              //this.closeToast();
            //}, 3000);
          }
        }
      } catch (error) {
        console.error("Erreur lors de l'activation :", error);
        alert("L'activation a échoué. Veuillez réessayer.");
      }
    },
    async suspendTokens() {
      if (this.selectedAccounts.length === 0) {
        alert("Veuillez sélectionner au moins un token à suspendre.");
        return;
      }

      try {
        for (const token of this.selectedAccounts) {
          if (token.TokenUniqueReference) {
            const payload = {
              action: "suspend",
              token_suspend: {
                TokenUniqueReference: token.TokenUniqueReference,
              },
            };

            const response = await axios.post("http://localhost:8080/mdescs", payload);
            console.log("Token suspendu:", response.data);

            this.suspendedToken = token; // Met à jour le token suspendu
            this.showSuspendToast = true; // Affiche le toast de suspension

            // setTimeout(() => {
            //   this.closeSuspendToast(); // Cache le toast après 3 secondes
            // }, 3000);
          }
        }
        this.search(); // Rafraîchir la liste
      } catch (error) {
        console.error("Erreur lors de la suspension :", error);
        alert("La suspension a échoué. Veuillez réessayer.");
      }
    },
    async unsuspendTokens() {
      if (this.selectedAccounts.length === 0) {
        alert("Veuillez sélectionner au moins un token à unsuspendre.");
        return;
      }

      try {
        for (const token of this.selectedAccounts) {
          if (token.TokenUniqueReference) {
            const payload = {
              action: "unsuspend",
              token_unsuspend: {
                TokenUniqueReference: token.TokenUniqueReference,
              },
            };

            const response = await axios.post("http://localhost:8080/mdescs", payload);
            console.log("Token unsuspendu:", response.data);

            this.unsuspendedToken = token; // Met à jour le token suspendu
            this.showUnSuspendToast = true; // Affiche le toast de suspension

            // setTimeout(() => {
            //   this.closeSuspendToast(); // Cache le toast après 3 secondes
            // }, 3000);
          }
        }
        this.search(); // Rafraîchir la liste
      } catch (error) {
        console.error("Erreur lors de la suspension :", error);
        alert("La suspension a échoué. Veuillez réessayer.");
      }
    },
    closeUnSuspendToast() {
      this.showUnSuspendToast = false;
    },
    closeSuspendToast() {
      this.showSuspendToast = false;
    },
    closeToast() {
      this.showToast = false;
    },
  },
};
</script>

  
  <style scoped>

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  font-size: 80%;
}

.modal-content {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  position: relative;
}

.modal-content h3 {
  margin: 0 0 10px;
}

.modal-content button {
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
}

.modal-content button:hover {
  background: #0056b3;
}
  /* Conteneur principal */
  .container {
    margin-top: 5%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    font-family: 'Arial', sans-serif;
    padding: 20px;
    box-sizing: border-box;
  }
  
  h1 {
    font-size: 2rem;
    margin-bottom: 30px;
    color: #333;
  }
  
  /* Formulaire */
  .form-box {
    background: white;
    width: 100%;
    max-width: 80%;
    padding: 20px 30px;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }
  
  .form-group {
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
  }
  
  label {
    margin-bottom: 5px;
    font-size: 0.9rem;
    font-weight: 600;
    color: #555;
  }
  
  /* input[type="text"] {
    padding: 10px 12px;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 5px;
    outline: none;
    transition: all 0.3s ease;
  } */
  
  input[type="text"]:focus {
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.3);
  }

  .small-input {
    width: 60%; /* Ajustez la largeur selon vos besoins */
  }

  .long-input {
  width: 100%; /* Le champ prendra toute la largeur de son conteneur parent */
  max-width: 600px; /* Ajustez selon vos besoins */
  padding: 10px; /* Pour plus de confort */
  font-size: 16px; /* Police plus grande si nécessaire */
  margin-inline-end: 180px;
}
  
  /* Bouton More Details */
  .btn-details {
    display: block;
    width: 20%;
    padding: 10px 0;
    margin: 20px 0;
    background-color: #007bff;
    color: white;
    font-size: 1rem;
    font-weight: bold;
    text-align: center;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .btn-details:hover {
    background-color: #0056b3;
  }
  
  /* Section des détails */
  .details-section {
    margin-top: 20px;
  }
  
  .details-section h2 {
    margin-bottom: 15px;
    font-size: 1.2rem;
    color: #333;
  }
  
  .form-checklist {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }
  
  input[type="checkbox"] {
    margin-right: 10px;
  }
  
  /* Bouton Search */
  .btn-search {
    display: block;
    width: 20%;
    padding: 10px 0;
    margin-top: 20px;
    background-color: #28a745;
    color: white;
    font-size: 1rem;
    font-weight: bold;
    text-align: center;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .btn-search:hover {
    background-color: #218838;
  }

  .btn-info{
    font-size: 100%;
  }
  
  /* Animation Fade */
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }

  

.results-buttons {
  display: flex;
  gap: 15px; 
}

.btn-action {
  padding: 8px 16px;
  font-size: 14px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: #fff;
  font-weight: bold;
}

.btn-activate {
  background-color: #28a745;
}

.btn-activate:hover {
  background-color: #218838;
}

.btn-suspend {
  background-color: #07ffa4;
}

.btn-suspend:hover {
  background-color: #07ffa4;
}

.btn-resume {
  background-color: #17a2b8;
}

.btn-resume:hover {
  background-color: #138496;
}
.btn-delete{
  background-color: #96131a;
  text-align: center;
}
.btn-delete:hover {
  background-color: #96131a;
}

.table-container {
  display: flex;
  flex-direction: column;
  margin-left: 10%;
}

.results-buttons {
  display: flex;
  justify-content: flex-end; /* Place les boutons à la fin de la ligne */
  margin-bottom: 10px; /* Ajouter un petit espace entre les boutons et la table */
}

table {
  border-collapse: collapse;
  font-size: 10px;
}


th, td {
  padding: 8px 10px;
  border: 1px solid #ccc;
}

  
th {
  background-color: #f2f2f2;
}
  
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

  .actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.actions button {
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
}

.actions button:hover {
  background: #0056b3;
}

button {
  margin-top: 15px;
}


  </style>
  