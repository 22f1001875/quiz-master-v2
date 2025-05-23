export default {
    template: `
      <div class="d-flex justify-content-center align-items-center vh-100">
        <div class="text-center">
          <h1 class="display-1" id="logo" style="white-space: nowrap;"></h1>
          <button class="btn btn-secondary mt-4" v-on:click="reRoute">Enter</button>
        </div>
      </div>
    `,
    mounted: function() {
      const text = "QuizMasterV2";
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
    methods: {
        reRoute(){
        this.$router.push('/login')
        }
    }
}
  