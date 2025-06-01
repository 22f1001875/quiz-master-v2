export default {
  template: `
            <div class="card p-4">
                <h2>{{ isUpdate ? 'Update' : 'Add' }} Quiz</h2>
                    <div class="mb-3">
                        <label for="remarksss" class="form-label">Quiz Title</label>
                        <input v-model="quiz.remarks" type="text" class="form-control" id="remarksss" required>
                    </div>
                    <div class="mb-3">
                        <label for="integerInput" class="form-label">Time Duration (minutes)</label>
                        <input v-model="quiz.time_duration" type="number" class="form-control" id="integerInput" name="integerInput" step="1" required>
                    </div>
                    <div class="mb-3">
                        <label for="InputDate" class="form-label">Date of quiz</label>
                        <input v-model="quiz.date" type="date" class="form-control" name="doq" id="InputDate" required>
                    </div>
                    <br>
                    <div>
                    <button v-on:click="submit" class="btn btn-primary">{{ isUpdate ? 'Update' : 'Add' }}</button>
                    <button v-on:click="cancel" class="btn btn-secondary">cancel</button>
                    </div>
            </div>
  `,
  props: {
    quizdetails: {
      type: Object,
      required: true
    },
    submitHandler: {
      type: Function,
      required: true
    },
    cancelHandler: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      quiz: {
        id:null,
        date:'',
        time_duration:'',
        remarks:'',
        c_id:''
      }
    };
  },
  computed: {
    isUpdate() {
      return !!this.quiz.id;
    }
    },
  watch: {
    quizdetails: {
      immediate: true,
      handler(newVal) {
        if(newVal.id){
            Object.assign(this.quiz, newVal);
        }
        else {
            this.quiz = {
            id: null,
            date: '',
            time_duration: '',
            remarks: '',
            c_id: newVal.c_id
            }
        }
      }
    }
  },
  
  methods: {
    submit() {
       console.log("Submitting quiz:", JSON.stringify(this.quiz, null, 2))
      this.submitHandler(this.quiz);
      if (!this.isUpdate){
        this.quiz.remarks = ''
        this.quiz.date = ''
        this.quiz.time_duration = ''
      }
      else
      this.cancel()
    },
    cancel() {
      this.cancelHandler();
    }
  }
}
