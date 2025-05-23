export default{
    template:`
    <div class="card shadow-sm p-3">
        <div class="card-body">
            <h5 class="card-title"><i class="bi bi-journal-plus me-2"></i>Update Subject</h5>
            <div class="mb-3 mt-5">
                <label for="upsub" class="form-label">Subject Name</label>
                <input type="text" class="form-control" id="upsub" placeholder="Subject name.." v-model="currentSub.name">
            </div>
            <div class="mb-3">
                <label for="updesc" class="form-label">Description</label>
                <textarea class="form-control" id="updesc" rows="4" placeholder="Text Input.." v-model="currentSub.description"></textarea>
            </div>
            <div>
                <button class="btn btn-warning" v-on:click="submit"><i class="bi bi-plus-circle me-2"></i>Update Subject</button>
                <button class="btn btn-secondary" @click="cancel">Cancel</button>
            </div>
        </div>
    </div>
    `,
    props:{
        updateSub: {
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
  data: function(){
    return{
        currentSub:{
            id:'',
            name:'',
            description:''
        }
    }
  },
  watch: {
    updateSub: {
      immediate: true,
      handler(newVal) {
        this.currentSub.id = newVal.id;
        this.currentSub.name = newVal.name;
        this.currentSub.description = newVal.description;
      }
    }
  },
  methods:{
    submit(){
        if (!this.currentSub.name.trim() && !this.currentSub.description.trim()) {
        alert("Some required fields empty.");
        return;
      }
      this.submitHandler(this.currentSub);
    },
    cancel() {
      this.cancelHandler();
    }
  }

}