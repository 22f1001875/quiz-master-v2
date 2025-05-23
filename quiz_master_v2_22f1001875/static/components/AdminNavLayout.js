import Navbar from './Navbar.js'

export default {
  components: { Navbar },
  template: `
    <div>
      <Navbar />
      <div class="container mx-auto mt-4">
        <router-view></router-view>
      </div>
    </div>
  `
}
