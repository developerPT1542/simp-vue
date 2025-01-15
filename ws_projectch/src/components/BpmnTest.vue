<template>
  <div class="container-fluid mt-5">
    <div class="user-form text-center">
      <form @submit.prevent="loadBpmnDiagram" class="form-inline justify-content-center">
        <div class="form-group row">
          <label for="processSelect" class="col-form-label text-md-right">Process Name:</label>
          <div class="col-md-6">
            <select id="processSelect" class="form-select" v-model="formData.IDPROCESSAPI" required>
              <option v-for="processapi in procOptions" :key="processapi.ID" :value="processapi.ID">{{ processapi.NOM }}</option>
            </select>
          </div>
        </div>
        <button type="submit" class="btn btn-primary ml-3">Load Diagram</button>
      </form>
    </div>
    <div>
      <div ref="canvas" class="bpmn-container mt-4"></div>
    </div>
  </div>
</template>

<script>
import BpmnViewer from 'bpmn-js/lib/NavigatedViewer';
import axios from 'axios';

export default {
  data() {
    return {
      formData: {
        IDPROCESSAPI: '',
      },
      procOptions: [],
      viewer: null, 
    };
  },
  mounted() {
    this.fetProc();
  },
  methods: {
    async fetProc() {
      try {
        const responseProc = await axios.get('/api/users/proc');
        this.procOptions = responseProc.data;
      } catch (error) {
        console.error('Erreur lors de la récupération des données', error);
      }
    },
    async loadBpmnDiagram() {
      if (!this.formData.IDPROCESSAPI) {
        return;
      }
      try {
        console.log('Fetching BPMN diagram for process ID:', this.formData.IDPROCESSAPI);
        const response = await axios.get(`/api/generate-bpmn/${this.formData.IDPROCESSAPI}`, { responseType: 'text' });
        const bpmnXML = response.data;
        console.log(response.data);
    

        if (this.viewer) {
          this.viewer.destroy(); // Destroy the previous viewer instance
        }

        this.viewer = new BpmnViewer({
          container: this.$refs.canvas,
        });

        this.viewer.importXML(bpmnXML).then((result) => {
          const { warnings } = result;
          console.log("BPMN diagram loaded successfully!", warnings);
        }).catch((err) => {
          const { warnings, message } = err;
          console.log("Something went wrong:", warnings, message);
        });
      } catch (error) {
        console.error('Erreur lors du chargement du diagramme BPMN', error);
      }
    },
  },
};
</script>

<style>
/* .container-fluid {
  padding-top: 20px;
} */

/* .user-form {
  margin-bottom: 20px;
} */

.form-inline .form-group {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* .form-inline .form-group label {
  margin-right: 10px;
} */

.bpmn-container {
  width: 80%;
  height: 400px; /* Reduced height for a smaller diagram */
  border: 2px solid #007bff;
  border-radius: 4px;
  background-color: #f9f9f9;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-left: 16%;
  margin-right: 16%;
}

.btn {
  margin-left: 10px;
}
</style>
