import UpdateChapter from "./UpdateChapter.js"
import Apdatequiz from "./Apdatequiz.js"
import Quizbychap from "./Quizbychap.js"
export default {
    template :`
    <div>
    <div class="d-flex justify-content-between align-items-center mb-3">
        <h4><i class="bi bi-journal-code me-2"></i>{{ subject.name }}</h4>
    </div>
    <div class="row">
    <div class="col-7" style="height: 750px; overflow-y:scroll;">
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
              <strong>
              <button
                    type="button"
                    @click="quizchapter(chap.id,chap.name)"
                    :class="[
                      'btn',
                      'p-0',  
                      'bg-transparent',
                      'border-0',
                      'link-offset-2',
                      'link-underline-opacity-25',
                      'link-underline-opacity-100-hover',
                      quizbychap && quizbychap.id === chap.id ?'link-info':'link-primary'
                    ]">
                    {{ chap.name }}
                  </button>
              </strong>
            </div>
          </td>
          <td>
            <p class="d-inline-flex gap-1">
              <button v-on:click="readyChapter(chap.id,chap.name)" type="button" class="btn btn-outline-warning" :class="{
              'btn-outline-warning': true, active: chapterdetails && chapterdetails.id === chap.id}">Update Chapter</button>
              <button v-on:click="deleteChapter(chap.id)" type="button" class="btn btn-outline-danger">Delete </button>
              <button v-on:click="readyQuiz(chap.id)" type="button" class="btn btn-outline-info" :class="{
              'btn-outline-info': true, active: q_id && q_id.id === chap.id}">Quiz</button>
            </p>
          </td>
        </tr>
      </tbody>
    </table>
    </div>
    <div class="col-5" style="height: 750px;">
                <UpdateChapter v-if="chapterdetails" :chapterdetails="chapterdetails" :submitHandler="submitChange" :cancelHandler="cancelChange" />
                <Quizbychap v-else-if="quizbychap" :chapter="quizbychap" />
                <Apdatequiz v-if="q_id" :quizdetails="q_id" :submitHandler="submitQuiz" :cancelHandler="cancelQuiz" />
                
    </div>
    </div>
    </div>
    `,
    components:{
      UpdateChapter,
      Apdatequiz,
      Quizbychap
    },
    data: function(){
        return{
            subject:'',
            chapterdetails:null,
            q_id:null,
            quizbychap:null
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
        this.chapterdetails=null
    })
    .catch(err => {
        console.error(err);
        alert(err.message);
    });
    },
    deleteChapter:function(id){
        fetch(`/api/deletechapter/${id}`,{
          method : 'DELETE',
          headers : {
          "Content-Type": "application/json",
          "Authentication-Token": localStorage.getItem("authToken")
          }}).then(response => {
      if (!response.ok) {
        throw new Error("Failed to delete chapter");
      }
      this.initialLoad()
      this.quizbychap=null
    })
    .catch(err => {
      console.error(err);
      alert("An error occurred while deleting the subject.");
    });
      },
    quizchapter:function(id,name){
      this.quizbychap={id,name}
      this.q_id=null
    },
    readyChapter: function(id,name){
      this.chapterdetails={
        id,
        name
      }
    },
    readyQuiz: function(c_id){
      this.q_id={c_id}
      this.quizbychap=null
    },
    cancelChange:function(){
      this.chapterdetails=null
    },
    submitChange:function(chap){
      const id=chap.id
      fetch(`/api/updatechapter/${id}`,{
        method:'PUT',
        headers: {
        "Content-Type": "application/json",
        "Authentication-Token": localStorage.getItem("authToken")
        },
        body: JSON.stringify(chap)
      }).then(async response=>{
          if(!response.ok){
            const errorData= await response.json()
            throw new Error(errorData.message)
          }
          return response.json()
        }).then(data=>{
          this.initialLoad()
          console.log(data)
          this.quizbychap=null
        }).catch(err=>{
          console.log(err)
          alert(err)
        })
    },
    submitQuiz: function(quiz){
      fetch('/api/addquiz',{
          method : 'POST',
          headers: {
            "Content-Type": "application/json",
            "Authentication-Token": localStorage.getItem("authToken")
          },
          body:JSON.stringify(quiz)
        }).then(async response=>{
          if(!response.ok){
            const errorData = await response.json()
            throw new Error(errorData.message)
          }
          return response.json()
        }).then(data=>{
          console.log(data)
          this.quizbychap=null
        }).catch(err=>{
          console.error(err)
          alert(err)
        })
    },
    cancelQuiz:function(){
      this.q_id=null
    }
    }

}