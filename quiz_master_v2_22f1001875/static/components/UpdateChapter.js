export default {
  template: `
    <div class="card shadow-sm p-3">
      <div class="card-body">
        <h5 class="card-title">
          <i class="bi bi-journal-plus me-2"></i>Update Chapter
        </h5>
        <div class="mb-3">
          <label for="desc" class="form-label">Chapter</label>
          <input type="text" class="form-control" id="desc" v-model="chapter.name">
        </div>
        <div>
          <button class="btn btn-info" @click="submit">
            <i class="bi bi-plus-circle me-2"></i>Update Chapter
          </button>
          <button class="btn btn-secondary" @click="cancel">Cancel</button>
        </div>
      </div>
    </div>
  `,
  props: {
    chapterdetails: {
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
      chapter: {
        name: '',
        id: ''
      }
    };
  },
  watch: {
    chapterdetails: {
      immediate: true,
      handler(newVal) {
        this.chapter.name = newVal.name;
        this.chapter.id = newVal.id;
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
