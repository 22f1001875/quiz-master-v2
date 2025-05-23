export default {
    template : `
    <div class="d-flex justify-content-center align-items-center vh-100 container mt-4">
    <div class="p-4 border rounded shadow" style="width: 100%; max-width: 400px;">
    <h1 class="display-2 text-center" id="logo"></h1>
    <div class="mb-3">
        <label for="email">Email</label>
        <input type="text" class="form-control" id="email" v-model="formData.email">
    </div>
    <div class="mb-3">
        <label for="username">Username</label>
        <input type="text" class="form-control" id="username" v-model="formData.username">
    </div>
    <div class="mb-3">
        <label for="password">Password</label>
        <input type="password" class="form-control" id="password" v-model="formData.password">
    </div>
    <div class="text-center">
        <button class="btn btn-warning" v-on:click="registerfun">Sign-Up</button>
        <button class="btn btn-secondary" v-on:click="loginfun">Login</button>
    </div>
    </div>
    </div>`,
    data : function(){
        return{
            formData:{
                email:"",
                username:"",
                password:""
            }
        }
    },
    mounted: function() {
        const text = "Register";
        const logo = document.getElementById("logo");
    
    
        text.split("").forEach(i => {
          const span = document.createElement("span");
          span.textContent = i;
          span.style.display = "inline-block"; // Needed for animation
          logo.appendChild(span);
        });
    
        anime({
          targets: "#logo span",
          opacity: [0, 1],
          translateY: [20, 0],
          easing: "easeOutExpo",
          duration: 600,
          delay: anime.stagger(100)
        });
      },
    methods:{
        registerfun(){
            fetch('/api/register',{
                method:"POST",
                headers:{
                    "Content-Type": 'application/json'
                },
            body : JSON.stringify(this.formData)
            }).then(async response=>{
                if(!response.ok){
                    const errorData= await response.json()
                    throw new Error(errorData.message)
                }
                return response.json()
            }).then(data=>{
                console.log(data)
                this.loginfun()
            })
            .catch(e=>{
                console.log(e)
            })
        },
        loginfun(){
            this.$router.push('/login')
        }
    }
}