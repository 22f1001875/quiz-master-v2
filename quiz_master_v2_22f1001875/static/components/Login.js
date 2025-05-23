export default {
    template : `
    <div class="d-flex justify-content-center align-items-center vh-100">
    <div class="p-4 border rounded shadow" style="width: 100%; max-width: 400px;">
    <h1 class="display-2 text-center" id="logo"></h1>
    <div class="mb-3">
        <label for="username">Email/Username</label>
        <input type="text" class="form-control" id="username" v-model="formData.emailorusername">
    </div>
    <div class="mb-3">
        <label for="password">Password</label>
        <input type="password" class="form-control" id="password" v-model="formData.password">
        
    </div>
    <div class="small text-danger mb-3" id="errer"></div>
    <div class="text-center">
        <button class="btn btn-primary" v-on:click="loginfun">Login</button>
        <button class="btn btn-warning" v-on:click="registerfun">Sign-Up</button>
    </div>
    </div>
    </div>`,
    data : function(){
        return{
            formData:{
                emailorusername:"",
                password:""
            }
        }
    },
    mounted: function() {
        const text = "Login";
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
        loginfun(){
            fetch('/api/login',{
                method:"POST",
                headers:{
                    "Content-Type": 'application/json'
                },
            body : JSON.stringify(this.formData)
            }).then(async response=>{
                if(!response.ok){
                    const err = await response.json()
                    throw new Error(err.message)
                }
                return response.json()
            }).then(data=>{
                localStorage.setItem("authToken",data["auth-token"])
                localStorage.setItem("id",data.id)
                localStorage.setItem("username",data.username)
                this.$router.push('/adminhome')
            }).catch(e=>{
                const errer = document.getElementById("errer");
                errer.innerText =e

                setTimeout(() => {
                    errer.innerText = ""
                }, 5000)
            });
        },
        registerfun(){
            this.$router.push('/register')
        }
    }
}