export default {
  template: `
  <div>
    <button :disabled="!$route.query.returnPath" class="btn btn-secondary" @click="goBack">Go Back</button>
    <h2 class="display-5 mt-3 mb-3">Questions</h2>
    <div class="row">
      
      <!-- LEFT: List of Questions -->
      <div class="col-7" style="height: 750px; overflow-y: scroll;">
        <ul class="list-group">
          <li class="list-group-item list-group-item-primary fs-4" 
              v-for="q in questions" :key="q.id" @click="selectQuestion(q)" style="cursor: pointer;">
            Question: <br> {{ q.question }}
            <ul class="list-group mt-3 mb-3">
              <li class="list-group-item list-group-item-light fs-6">Option 1: {{ q.op1 }}</li>
              <li class="list-group-item list-group-item-light fs-6">Option 2: {{ q.op2 }}</li>
              <li class="list-group-item list-group-item-light fs-6">Option 3: {{ q.op3 }}</li>
              <li class="list-group-item list-group-item-light fs-6">Option 4: {{ q.op4 }}</li>
              <li class="list-group-item list-group-item-success fs-6">Correct Option: {{ q.cop }}</li>
            </ul>
          </li>
        </ul>
      </div>
      
      <!-- RIGHT: Form to Edit Selected Question -->
      <div class="col-5" style="height: 750px; overflow-y: auto;">
        <div v-if="selectedQuestion" class="card p-3 shadow">
          <h4>Edit Question</h4>
            <div class="mb-2">
              <label>Question</label>
              <textarea class="form-control" v-model="selectedQuestion.question" rows="2"></textarea>
            </div>
            <div class="mb-2">
              <label>Option 1</label>
              <input type="text" class="form-control" v-model="selectedQuestion.op1">
            </div>
            <div class="mb-2">
              <label>Option 2</label>
              <input type="text" class="form-control" v-model="selectedQuestion.op2">
            </div>
            <div class="mb-2">
              <label>Option 3</label>
              <input type="text" class="form-control" v-model="selectedQuestion.op3">
            </div>
            <div class="mb-2">
              <label>Option 4</label>
              <input type="text" class="form-control" v-model="selectedQuestion.op4">
            </div>
            <div class="mb-2">
              <label>Correct Option</label>
              <div>
                <div class="form-check form-check-inline" v-for="n in 4" :key="n">
                  <input 
                    class="form-check-input" 
                    type="radio" 
                    :id="'cop'+n" 
                    :value="n" 
                    v-model.number="selectedQuestion.cop"
                  >
                  <label class="form-check-label" :for="'cop'+n">Option {{n}}</label>
                </div>
              </div>
            </div>
            <div>
            <button v-on:click="updateQuestion" class="btn btn-outline-success mt-2">Update</button>
            <button v-on:click="deleteQuestion" class="btn btn-outline-danger mt-2">Delete</button>
            </div>
        </div>
        <div v-else class="text-muted">
          <p>Select a question to edit</p>
        </div>
      </div>

    </div>
  </div>
  `,
  data() {
    return {
      questions: null,
      selectedQuestion: null
    };
  },
  mounted() {
    this.initialLoad();
  },
  methods: {
    initialLoad() {
      const q_Id = this.$route.params.id;
      fetch(`/api/questionbyquiz/${q_Id}`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          "Authentication-Token": localStorage.getItem("authToken")
        }
      })
      .then(async response => {
        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.message);
        }
        return response.json();
      })
      .then(data => {
        this.questions = data;
      })
      .catch(err => {
        console.error(err);
        alert(err.message);
      });
    },
    selectQuestion(q) {
      this.selectedQuestion = { ...q };
    },
    updateQuestion() {
      const q = this.selectedQuestion;
      fetch(`/api/updatequestion/${q.id}`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Authentication-Token": localStorage.getItem("authToken")
        },
        body: JSON.stringify(q)
      })
      .then(async response => {
        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.message);
        }
        return response.json();
      })
      .then(updated => {
        this.initialLoad()
      })
      .catch(err => {
        console.error(err);
        alert(err.message);
      });
    },
    deleteQuestion() {
      const q = this.selectedQuestion;
      fetch(`/api/deletequestion/${q.id}`, {
        method: 'DELETE',
        headers: {
          "Content-Type": "application/json",
          "Authentication-Token": localStorage.getItem("authToken")
        },
        body: JSON.stringify(q)
      })
      .then(async response => {
        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.message);
        }
        return response.json();
      })
      .then(deleted => {
        this.selectedQuestion = null
        this.initialLoad()

      })
      .catch(err => {
        console.error(err);
        alert(err.message);
      });
    },
    goBack() {
      if (this.$route.query.returnPath) {
        this.$router.push(this.$route.query.returnPath);
      } else {
        this.$router.push('/adminhome');
      }
    }
  }
}
