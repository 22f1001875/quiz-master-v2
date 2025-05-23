export default {
  template: `
    <div class="card shadow-sm p-3">
      <div class="card-body">
        <h5 class="card-title">
          <i class="bi bi-journal-plus me-2"></i>Add New Chapter
        </h5>
        <div class="mb-3 mt-5">
          <label for="subc" class="form-label">Subject Name</label>
          <input type="text" class="form-control" id="subc" v-model="sname" disabled readonly>
        </div>
        <div class="mb-3">
          <label for="desc" class="form-label">Chapter</label>
          <input type="text" class="form-control" id="desc" v-model="chapter.name">
        </div>
        <div>
          <button class="btn btn-info" @click="submit">
            <i class="bi bi-plus-circle me-2"></i>Add Chapter
          </button>
          <button class="btn btn-secondary" @click="cancel">Cancel</button>
        </div>
      </div>
    </div>
  `,
  props: {
    adC: {
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
      sname: '',
      chapter: {
        name: '',
        subject_id: ''
      }
    };
  },
  watch: {
    adC: {
      immediate: true,
      handler(newVal) {
        this.sname = newVal.sname;
        this.chapter.subject_id = newVal.subject_id;
      }
    }
  },
  methods: {
    submit() {
      if (!this.chapter.name.trim()) {
        alert("Chapter name cannot be empty.");
        return;
      }
      this.submitHandler(this.chapter);
      this.chapter.name = '';
    },
    cancel() {
      this.cancelHandler();
    }
  }
};
