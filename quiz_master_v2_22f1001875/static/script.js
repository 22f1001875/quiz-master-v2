import Login from "./components/Login.js"
import Landpage from "./components/Landpage.js"
import Register from "./components/Register.js"
import Adminhome from "./components/Adminhome.js"
import Chapterbysub from "./components/Chapterbysub.js"
import AdminNavLayout from "./components/AdminNavLayout.js"
import Questionsbyquiz from "./components/Questionsbyquiz.js"


const routes = [
    {path: '/', component: Landpage},
    {path:'/login',component:Login},
    {path:'/register', component:Register},
    {
        path: '/adminhome',
        component: AdminNavLayout,
        children: [
            {
                path: '',
                component:Adminhome
            },
            {
                path: 'subject/:id',
                component: Chapterbysub
            },
            {
                path: 'questions/:id',
                component: Questionsbyquiz
            }
        ]
    }
]

const router = new VueRouter({
    routes
})

const app = new Vue({
    el: "#app",
    router,
    components: {
        Landpage
    },
    template: `<router-view></router-view>`,
    data: {

    }
})
