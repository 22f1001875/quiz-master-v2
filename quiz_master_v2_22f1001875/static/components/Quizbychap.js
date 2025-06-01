export default {
  template: `
    <div class="card p-4">
      <h2>Quizzes under {{ chapter_name }}</h2>
      <br>
      <div v-if="message" class="alert alert-warning">{{ message }}</div>
      <div class="list-group list-group-flush">
        <div v-for="quiz in quizzes" :key="quiz.id" class="list-group-item">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <strong><button type="button" v-on:click="routeToQuestions(quiz.id)" :class="['btn','p-0','bg-transparent','border-0','link-offset-2','link-underline-opacity-25','link-underline-opacity-100-hover','link-primary']">{{ quiz.remarks }}</button></strong>
              <small class="text-muted d-block">{{ quiz.date }}</small>
              <small class="text-muted">Time Duration: {{ quiz.time_duration }} mins</small>
            </div>
            <div>
              <button class="btn btn-sm btn-outline-primary me-2" @click="toggleAddQuestion(quiz)">Add Question</button>
              <button class="btn btn-sm btn-outline-secondary" @click="toggleViewQuestions(quiz)">View Questions</button>
            </div>
          </div>

          <div v-if="activeAddQuiz && activeAddQuiz.id === quiz.id" class="mt-3">
            <h6>Add Question</h6>
            <form @submit.prevent="submitQuestion">
            <div class="mb-2">
                <input type="text" class="form-control" v-model="question" placeholder="Question" required>
            </div>
            <div class="mb-2">
                <input type="text" class="form-control" v-model="options[0]" placeholder="Option 1" required>
                    </div>
                    <div class="mb-2">
                        <input type="text" class="form-control" v-model="options[1]"  placeholder="Option 2" required>
                    </div>
                    <div class="mb-2">
                        <input type="text" class="form-control" v-model="options[2]" placeholder="Option 3" required>
                    </div>
                    <div class="mb-2">
                        <input type="text" class="form-control" v-model="options[3]" placeholder="Option 4" required>
                    </div>
                    <p>Choose correct option</p>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" v-model="correctOption" id="inlineRadio1" value="1" required>
                        <label class="form-check-label" for="inlineRadio1">1</label>
                    </div>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" v-model="correctOption" id="inlineRadio2" value="2">
                        <label class="form-check-label" for="inlineRadio2">2</label>
                    </div>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" v-model="correctOption" id="inlineRadio3" value="3">
                        <label class="form-check-label" for="inlineRadio3">3</label>
                    </div>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" v-model="correctOption" id="inlineRadio4" value="4">
                        <label class="form-check-label" for="inlineRadio4">4</label>
                    </div>
                    <br>
              <button class="btn btn-sm btn-success">Submit</button>
            </form>
          </div>

          <div v-if="activeViewQuiz && activeViewQuiz.id === quiz.id && questions.length>0" class="mt-3">
            <h6>Questions</h6>
            <ol>
              <li v-for="q in questions" :key="q.id">{{ q.question }}</li>
            </ol>
          </div>
          <div v-else-if="activeViewQuiz && activeViewQuiz.id === quiz.id" class="mt-3">
          <small class="text-muted d-block">No questions</small>
          </div>
        </div>
      </div>
    </div>
  `,
  props: {
    chapter: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chapter_id: null,
      chapter_name: null,
      quizzes: [],
      message: null,
      activeAddQuiz: null,
      activeViewQuiz: null,
      question: "",
      correctOption: null,
      options: ["", "", "", ""],
      questions: []
    };
  },
  watch: {
    chapter: {
      immediate: true,
      handler(newVal) {
        this.chapter_id = newVal.id;
        this.chapter_name = newVal.name;
        this.quizfetch();
      }
    }
  },
  methods: {
    quizfetch() {
      const id = this.chapter_id;
      this.quizzes=null
      this.message=null
      fetch(`/api/quizbychapter/${id}`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          "Authentication-Token": localStorage.getItem("authToken")
        }
      })
      .then(res => {
        if (!res.ok) throw new Error("Failed to load quizzes");
        return res.json();
      })
      .then(data => {
        this.quizzes = data;
      })
      .catch(err => {
        console.error(err);
        this.message = err.message;
      });
    },
    routeToQuestions(id){
      this.$router.push({
        path: `/adminhome/questions/${id}`,
        query: {
        returnPath: this.$route.fullPath
      }
    } 
    )
    },
    toggleAddQuestion(quiz) {
      this.activeAddQuiz = this.activeAddQuiz && this.activeAddQuiz.id === quiz.id ? null : quiz;
      this.activeViewQuiz = null;
      this.question = "";
    },
    toggleViewQuestions(quiz) {
      this.activeViewQuiz = this.activeViewQuiz && this.activeViewQuiz.id === quiz.id ? null : quiz;
      this.activeAddQuiz = null;
      this.questions=[]
      fetch(`/api/questionbyquiz/${quiz.id}`, {
        headers: {
          "Authentication-Token": localStorage.getItem("authToken")
        }
      })
      .then(res => {
        if (!res.ok) throw new Error(res.message);
        return res.json();
      })
      .then(data => {
        this.questions = data;
      })
      .catch(err => {
        console.log(err)
        this.questions=[]
      });
    },
    submitQuestion() {
      const payload = {
        question: this.question,
        options: this.options,
        correct_option: this.correctOption,
        quiz_id: this.activeAddQuiz.id
      };
      fetch('/api/addquestion', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authentication-Token": localStorage.getItem("authToken")
        },
        body: JSON.stringify(payload)
      })
      .then(res => {
        if (!res.ok) throw new Error(res.message);
        return res.json();
      })
      .then(() => {
        this.question = "";
        this.options = ["", "", "", ""];
        this.correctOption = null;
        alert("Question added!");
      })
      .catch(err => {
        alert(err);
      });
    }
  }
};
