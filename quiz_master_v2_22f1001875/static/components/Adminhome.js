import AddSubject from "./AddSubject.js"
import AddChapter from "./AddChapter.js"
import UpdateSubject from "./UpdateSubject.js"
export default {
    template: `
              <div>
                  <div class="d-flex justify-content-between align-items-center mb-3">
                      <h3><i class="bi bi-kanban me-2"></i>Admin Dashboard</h3>
                  </div>
                  <div class="row">
                    <div class="col-9" style="height: 750px; overflow-y:scroll;">
                      <div class="row">
                      <template v-if="subData && subData.length > 0">
                      <div class="col-md-6 mb-4" v-for="(subject, index) in subData" :key="subject.id">
                        <div class="card shadow-sm card-animated p-2">
                          <div class="card-body">
                          <div class="list-group-item d-flex justify-content-between align-items-center">
                            <div><h4 class="card-title text-primary"><i class="bi bi-journal-code me-2"></i>{{ subject.name }}</h4></div>
                            <div class="btn-group btn-group-sm">
                                  <a v-on:click="chapterdirect(subject.id)" class="btn btn-outline-info" title="Chapter Dash"><i class="bi bi-patch-question"></i></a>
                            </div>
                            </div>
                            <ul class="list-group list-group-flush chapter-list my-3">
                              <li class="list-group-item d-flex justify-content-between align-items-center" v-for="chapter in subject.chapter":key="chapter.id">
                              <div><i class="bi bi-book me-2 text-secondary"></i>{{ chapter.name }}</div>
                                
                              </li>
                            </ul>
                            <div class="d-flex justify-content-between">
                              <button v-on:click="readyUpChap(subject.id,subject.name)" class="btn btn-info btn-sm w-100 me-2 d-flex justify-content-center align-items-center">
                              <i class="bi bi-node-plus me-1"></i>Add Chapter
                              </button>
                              <button v-on:click="readyUpSub(subject.id,subject.name,subject.description)" class="btn btn-warning btn-sm w-100 me-2 d-flex justify-content-center align-items-center">
                              <i class="bi bi-pencil-square me-1"></i>Update Subject
                              </button>
                              <button class="btn btn-danger btn-sm w-100 me-2 d-flex justify-content-center align-items-center" v-on:click="delSub(subject.id)">
                              <i class="bi bi-trash me-1"></i>Delete Subject
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      </template>
                      <template v-else>
                      <div class="text-center text-muted mt-5">
                        <i class="bi bi-exclamation-circle me-2"></i>No subjects available. Please add a new subject.
                      </div>
                      </template>
                    </div>
                  </div>
                  <div class="col-3" style="height: 750px;">
                  <UpdateSubject v-if="updateSub" :updateSub="updateSub" :submitHandler="sendUpSub" :cancelHandler="cancelSUpdate" />
                  <AddChapter v-else-if="adC" :adC="adC" :submitHandler="chapAdd" :cancelHandler="cancelChap"/>
                  <AddSubject v-else :submitHandler="sendSub" />
                  </div>
                </div>
                <!------>
              </div>
    `,
    components: {
      AddSubject,
      AddChapter,
      UpdateSubject
    },
    data: function(){
      return {
        subData : [],
        updateSub : null,
        adC : null
      }
    },
    mounted(){
      this.loadData()
    },
    methods : {
      rhead : function(){
        return {
            "Content-Type":"application/json",
            "Authentication-Token" : localStorage.getItem("authToken")
          
        }
      },
      sendSub: function(sub){
        fetch('/api/addsubject',{
          method : 'POST',
          headers: this.rhead(),
          body:JSON.stringify(sub)
        }).then(async response=>{
          if(!response.ok){
            const errorData= await response.json()
            throw new Error(errorData.message)
          }
          return response.json()
        }).then(data=>{
          this.subData = [...this.subData, data]
        }).catch(err=>{
          console.error(err)
          alert(err)
        })
      },
      delSub: function(id){
        fetch(`/api/deletesubject/${id}`,{
          method : 'DELETE',
          headers : this.rhead()
        }).then(response => {
      if (!response.ok) {
        throw new Error("Failed to delete subject");
      }
      this.subData = this.subData.filter(sub => sub.id !== id);
      this.updateSub=null
      this.adC=null
    })
    .catch(err => {
      console.error(err);
      alert("An error occurred while deleting the subject.");
    });
      },
    readyUpSub: function(id,name,description){
      const tempstate = {id,name,description}
      this.updateSub=tempstate
    },
    sendUpSub : function(sub){
      const id = sub.id
      fetch(`/api/updatesubject/${id}`,{
        method:'PUT',
        headers : this.rhead(),
        body:JSON.stringify(sub)
      }).then(async response=>{
          if(!response.ok){
            const errorData= await response.json()
            throw new Error(errorData.message)
          }
          return response.json()
        }).then(data=>{
          this.updateSub=null
          this.loadData()
        }).catch(err=>{
          console.error(err)
          alert(err)
        })
    },
    loadData: function(){
      fetch('/api/subjects',{
        method: 'GET',
        headers: this.rhead()
      }).then(response=>response.json()).then(data=>{
        this.subData=data
        console.log(this.subData)
      })
    },
    chapAdd: function(stobj){
      fetch('/api/addchapter',{
          method : 'POST',
          headers: this.rhead(),
          body:JSON.stringify(stobj)
        }).then(async response=>{
          if(!response.ok){
            const errorData = await response.json()
            throw new Error(errorData.message)
          }
          return response.json()
        }).then(data=>{
          this.loadData()
        }).catch(err=>{
          console.error(err)
          alert(err)
        })
    },
    readyUpChap: function(id,sname){
      this.adC={subject_id:id,sname:sname}
      this.updateSub=null
    },
    cancelChap: function(){
      this.adC=null
    },
    cancelSUpdate:function(){
      this.updateSub=null
    },
    chapterdirect: function(id){
      this.$router.push(`/adminhome/subject/${id}`)
    }
    }
  }
  