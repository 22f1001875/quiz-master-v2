export default {
    template :`
    <div>
    <div class="d-flex justify-content-between align-items-center mb-3">
        <h4><i class="bi bi-journal-code me-2"></i>{{ subject.name }}</h4>
    </div>
    <div class="row">
    <div class="col-6" style="height: 750px; overflow-y:scroll;">
    <p class="ms-4">{{subject.description}}</p>
    <table class="table">
      <thead class="table-light">
        <tr>
          <th>Chapters</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="chap in subject.chapter" :key="chap.id">
          <td>
            <div class="d-flex align-items-center">
              <i class="bi bi-book text-secondary me-2"></i>
              <strong>{{ chap.name }}</strong>
            </div>
          </td>
          <td>
            <p class="d-inline-flex gap-1">
              <button type="button" class="btn btn-outline-warning" data-bs-toggle="button">Update Chapter</button>
              <button type="button" class="btn btn-outline-danger">Delete </button>
            </p>
          </td>
        </tr>
      </tbody>
    </table>
    </div>
    <div class="col-6" style="height: 750px;">
                <div class="card p-4">
                <h2>Add Quiz</h2>
                    <div class="mb-3">
                        <label for="InputQual" class="form-label">Timeduration in minutes</label>
                        <input type="text" class="form-control" name="timed" id="InputQual" required>
                    </div>
                    <div class="mb-3">
                        <label for="InputDate" class="form-label">Date of quiz</label>
                        <input type="date" class="form-control" name="doq" id="InputDate" required>
                    </div>
                    <div class="mb-3">
                        <label for="exampleInputPassword1" class="form-label">Remarks</label>
                        <input type="text" class="form-control" name="remarks" id="exampleInputPassword1" required>
                    </div>
                    <br>
                    <button class="btn btn-primary w-100 py-2" type="submit">Add</button>
            </div>
    </div>
    </div>
    </div>
    `,
    data: function(){
        return{
            subject:''
        }
    },
    mounted() {
      this.initialLoad()
    },
    methods:{
      initialLoad: function(){
    const subId = this.$route.params.id;
    fetch(`/api/subjects/${subId}`, {
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
        this.subject = data;
    })
    .catch(err => {
        console.error(err);
        alert(err.message);
    });
    }
    }

}