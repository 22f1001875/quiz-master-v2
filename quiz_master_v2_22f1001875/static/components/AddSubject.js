export default {
  template: `
    <div class="card shadow-sm p-3">
      <div class="card-body">
        <h5 class="card-title"><i class="bi bi-journal-plus me-2"></i>Add New Subject</h5>
        <div class="mb-3 mt-5">
          <label class="form-label">Subject Name</label>
          <input type="text" class="form-control" v-model="subject.name" placeholder="Subject name.." />
        </div>
        <div class="mb-3">
          <label class="form-label">Description</label>
          <textarea class="form-control" rows="4" v-model="subject.description" placeholder="Text Input.."></textarea>
        </div>
        <div class="text-center">
          <button class="btn btn-success" @click="submit"><i class="bi bi-plus-circle me-2"></i>Add Subject</button>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      subject: { name: '', description: '' }
    };
  },
  props: ['submitHandler'],
  methods: {
    submit() {
      this.submitHandler(this.subject);
      this.subject.name = '';
      this.subject.description = '';
    }
  }
};
