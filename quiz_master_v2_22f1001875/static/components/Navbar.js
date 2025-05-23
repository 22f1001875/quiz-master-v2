// components/Navbar.js

export default {
    template: `
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container">
      <a class="navbar-brand" id="logo"></a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <a class="nav-link active" aria-current="page" href="#">Home</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Summary</a>
          </li>
          <li class="nav-item">
            <a class="nav-link active" href="#">Logout</a>
          </li>
        </ul>
        <form class="d-flex" role="search" action="/search" method="GET">
          <input class="form-control me-2" type="search" name="query" placeholder="Search" aria-label="Search">
          <button class="btn btn-outline-success" type="submit">Search</button>
        </form>        
        <span class="navbar-text ms-3">
            Welcome user
          </span>
      </div>
    </div>
  </nav>
    `,
    mounted: function() {
      const text = "QuizMasterV2";
      const logo = document.getElementById("logo");
  
      text.split("").forEach(char => {
        const span = document.createElement("span");
        span.textContent = char;
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
      logoutFun() {
        localStorage.removeItem("authToken");
        localStorage.removeItem("username");
        localStorage.removeItem("id");
        this.$router.push("/login");
  }}
  
  }
  