<template>
   <div class="container-fluid mt-5">
    <div class="user-form-map text-center">
      

      <!-- Step 1 -->
      <div v-if="currentStep === 1">
        <form @submit.prevent="nextStep">
          <h2>STEP 1</h2>
          <div v-for="(record, index) in formData.step1Records" :key="index">

          <div class="form-group row">
            <label for="functionName" class="col-md-3 col-form-label text-md-right">fonction:</label>
            <div class="col-md-9">
              <select class="form-select" v-model="record.IDFUNCTION" required>
                <option v-for="func in functionOptions" :key="func.ID" :value="func.ID">{{ func.NAME }}</option>
              </select>
            </div>
          </div>
      
          <div class="form-group row">
            <label for="functionName" class="col-md-3 col-form-label text-md-right">link url:</label>
            <div class="col-md-9">
              <select class="form-select" v-model="record.IDURL" required>
                <option v-for="url in urlsOptions" :key="url.ID" :value="url.ID">{{ url.URLLINK }}</option>
              </select>
            </div>
          </div>

          <div class="form-group row">
            <label for="username" class="col-md-3 col-form-label text-md-right">RESPONSE CODE:</label>
            <div class="col-md-9">
              <select class="form-select"  v-model="record.IDPROCESSAPI" required>
                <option v-for="processapi in procOptions" :key="processapi.ID" :value="processapi.ID">{{ processapi.NAME}}</option>
              </select>
              
            </div>
          </div>

        </div>
          <button type="submit" class="btn btn-primary">Next</button>
        </form>
      </div>

      <div v-if="currentStep === 2">
        <form @submit.prevent="nextStep">
          <h2>STEP 2</h2>
          <div v-for="(record, index) in formData.step1Records" :key="index">

            <div v-for="(record, index) in formData.step1Records" :key="index">
            <p>Fonction: {{ getFunctionName(record.IDFUNCTION) }}</p>
            <p>Link URL: {{ getUrlLink(record.IDURL) }}</p>
            <p>Response Code: {{ getProcessName(record.IDPROCESSAPI) }}</p>
          </div>

         </div>
          <div v-for="(record, index) in formData.step2Records" :key="index">
          
          
  <div class="form-group row">
    <label for="email" class="col-md-3 col-form-label text-md-right">INPUTNAME:</label>
    <div class="col-md-9">
      <input type="text" id="username" v-model="record.INPUTNAME" required>
    </div>
  </div>

  <div class="form-group row">
    <label for="username" class="col-md-3 col-form-label text-md-right">DESTINATION NAME:</label>
    <div class="col-md-9">
      <input type="text" id="username" v-model="record.DESTINATIONNAME" required />
    </div>
  </div>

  <div class="form-group row">
    <label for="username" class="col-md-3 col-form-label text-md-right">TOLOG:</label>
    <div class="col-md-9">
      <select class="form-select" aria-label="Default select example" v-model="record.TOLOG" required>
        <option value="1">Vrai</option>
        <option value="0">Faux</option>
      </select>
    </div>
  </div>

  <div class="form-group row">
    <label for="username" class="col-md-3 col-form-label text-md-right">INPUTOUTPUT:</label>
    <div class="col-md-9">
      <select class="form-select" aria-label="Default select example" v-model="record.INPUTOUTPUT" required>
        <option value="in">in</option>
        <option value="out">out</option>
      </select>
      <p v-if="record.INPUTOUTPUT === 'in'"></p>
      <p v-else-if="record.INPUTOUTPUT === 'out'"></p>
    </div>
  </div>

  <div class="form-group row">
    <label for="username" class="col-md-3 col-form-label text-md-right">MANDATORY:</label>
    <div class="col-md-9">
      <select class="form-select" aria-label="Default select example" v-model="record.MANDATORY" required>
        <option value="1">Vrai</option>
        <option value="0">Faux</option>
      </select>
      <p v-if="record.MANDATORY === '1'"></p>
      <p v-else-if="record.MANDATORY === '0'"></p>
    </div>
  </div>
    <div class="dropdown float-end">
                    <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                      <span class="material-icons">grading</span>
                    </button>
                    <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1" style="width: auto;">
                      <li class="float-center">
                          <button class="btn btn-success mr-3" @click.prevent="addRecord">Add</button>
                          <button class="btn btn-danger" @click.prevent="removeRecord(index)">Delet</button>
                      </li>
                    </ul>
    </div>
</div>
<div>
<button @click="goBack" class="btn btn-secondary mr-3 mt-3">Back</button>
</div>
  </form>
  <table class="table mt-3">
          <thead>
            <tr>
              <th>Fonction</th>
              <th>Link URL</th>
              <th>Response Code</th>
              <th>Input Name</th>
              <th>Destination Name</th>
              <th>To Log</th>
              <th>Input Output</th>
              <th>Mandatory</th>
            </tr>
          </thead>
          
            <tbody>
            <tr v-for="(record, index) in getAllRecords" :key="index">
              <td>{{ getFunctionName(record.IDFUNCTION) }}</td>
              <td>{{ getUrlLink(record.IDURL) }}</td>
              <td>{{getProcessName(record.IDPROCESSAPI) }}</td>
              <td>{{ record.INPUTNAME }}</td>
              <td>{{ record.DESTINATIONNAME }}</td>
              <td>{{ record.TOLOG }}</td>
              <td>{{ record.INPUTOUTPUT }}</td>
              <td>{{ record.MANDATORY }}</td>
            </tr>
          </tbody>
    
        </table>

        <div class="button-group">

          <button @click="submitForm" class="btn btn-primary">Validate</button>
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
      formData: {
        step1Records: [{ IDFUNCTION: null, IDURL: null, IDPROCESSAPI: null }],
        step2Records: [
          { INPUTNAME: null, DESTINATIONNAME: null, TOLOG: null, INPUTOUTPUT: null, MANDATORY: null },
        ],
      },
      functionOptions: [],
      urlsOptions: [],
      procOptions: [],
      currentStep: 1,

    };
  },
  async created() {
    await this.fetchfunpro();
    await this.fetchurl();
    await this.fetProc();
  },
  computed: {
  getAllRecords() {
    const step1Length = this.formData.step1Records.length;
    const step2Length = this.formData.step2Records.length;

    const maxRecordsLength = Math.max(step1Length, step2Length);

    const combinedRecords = [];

    for (let i = 0; i < maxRecordsLength; i++) {
      const step1Record = i < step1Length ? this.formData.step1Records[i] : {};
      const step2Record = i < step2Length ? this.formData.step2Records[i] : {};

      combinedRecords.push({ ...step1Record, ...step2Record });
    }

    return combinedRecords;
  },
},



  methods: {
    async fetchfunpro() {
      try {
        const responseRecup = await axios.get('/api/users/fonction');
        this.functionOptions = responseRecup.data;
      } catch (error) {
        console.error('Erreur lors de la récupération des donnees', error);
      }
    },
    async fetchurl() {
      try {
        const responseUrl = await axios.get('/api/users/urls');
        this.urlsOptions = responseUrl.data;
      } catch (error) {
        console.error('Erreur lors de la récupération des donnees', error);
      }
    },
    async fetProc() {
      try {
        const responseProc = await axios.get('/api/users/proc');
        this.procOptions = responseProc.data;
      } catch (error) {
        console.error('Erreur lors de la récupération des donnees', error);
      }
    },
    goBack() {
    this.currentStep -= 1;
  },
  addRecord() {
  if (this.currentStep === 1) {
    this.formData.step1Records.push({
      IDFUNCTION: null,
      IDURL: null,
      IDPROCESSAPI: null,
    });

    this.formData.step2Records.push({
      INPUTNAME: null,
      DESTINATIONNAME: null,
      TOLOG: null,
      INPUTOUTPUT: null,
      MANDATORY: null,
    });
  } else if (this.currentStep === 2) {
    if (this.formData.step1Records.length > 0) {
      const lastStep1Record = this.formData.step1Records[this.formData.step1Records.length-1];
      this.formData.step2Records.push({
        INPUTNAME: null,
        DESTINATIONNAME: null,
        TOLOG: null,
        INPUTOUTPUT: null,
        MANDATORY: null,
        IDFUNCTION: lastStep1Record.IDFUNCTION,
        IDURL: lastStep1Record.IDURL,
        IDPROCESSAPI: lastStep1Record.IDPROCESSAPI,
      });
    } else {
      console.warn('Please add a record in Step 1 first.');
    }
  }
},



removeRecord(index) {
      if (this.currentStep === 2) {
        this.formData.step2Records.splice(index, 1);
      }
    },
    async submitForm() {
  console.log('Form data submitted:', this.formData);

  Swal.showLoading();

  try {
    

    let formData = new FormData();
    formData.append('step1Records', JSON.stringify(this.formData.step1Records));
    formData.append('step2Records', JSON.stringify(this.formData.step2Records));
    console.log(this.formData.step1Records.INPUTNAME)
    const responseAddMap = await axios.post('/api/users/addMap', formData);

    console.log('Réponse du serveur:', responseAddMap.data);

  

    this.$router.push({ name: 'MappingWs' });

    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Mapping a été ajouté',
      showConfirmButton: false,
      timer: 1500,
    });

    if (this.currentStep === 1) {
      this.formData.step1Records = [];
    } else if (this.currentStep === 2) {
      this.formData.step2Records = [];
    }

    this.currentStep = 1;

  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: 'Erreur lors de l\'ajout du mapping',
    });
  }
},




    nextStep() {
      this.currentStep += 1;
    },
    getFunctionName(id) {
      const selectedFunction = this.functionOptions.find(func => func.ID === id);
      return selectedFunction ? selectedFunction.NAME : '';
    },
    getUrlLink(id) {
      const selectedUrl = this.urlsOptions.find(url => url.ID === id);
      return selectedUrl ? selectedUrl.URLLINK : '';
    },
    getProcessName(id) {
      const selectedProc = this.procOptions.find(processapi => processapi.ID === id);
      return selectedProc ? selectedProc.NOM : '';
    },
  },
};
</script>

<style>
.user-form-map {
  max-width: 100%;
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

/* Hide the element with the 'hidden' class */
.hidden {
  display: none !important;
}
</style>