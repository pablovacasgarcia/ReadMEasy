import Vue from "vue";
import Router from "vue-router";
import { auth } from "../firebase";
const AppHeader = () => import("./layout/AppHeader");
const Landing = () => import("./views/Landing.vue");
const Login = () => import("./views/Login.vue");
const Register = () => import("./views/Register.vue");
const Profile = () => import("./views/Profile.vue");
const Workbench = () => import("./views/Workbench.vue");
const Explore = () => import("./views/Explore.vue");

Vue.use(Router);

const router = new Router({
  mode: "history",
  linkExactActiveClass: "active",
  routes: [
    {
      path: "/workbench/:id",
      name: "workbench",
      components: {
        header: AppHeader,
        default: Workbench,
      }
    },
    {
      path: "/",
      name: "landing",
      components: {
        header: AppHeader,
        default: Landing,
      }
    },
    {
      path: "/login",
      name: "login",
      components: {
        header: AppHeader,
        default: Login,
      }
    },
    {
      path: "/register",
      name: "register",
      components: {
        header: AppHeader,
        default: Register,
      }
    },
    {
      path: '/profile/:id/:section?',
      name: "profile",
      components: {
        header: AppHeader,
        default: Profile,
      },
      meta: { requiresAuth: true }
    },
    {
      path: '/explore',
      name: 'explore',
      components: {
        header: AppHeader,
        default: Explore,
      },
      meta: { requiresAuth: true } 
    },
    {
      path: '*',
      components: {
        header: AppHeader,
        default: Landing,
      }
    }
  ],
  scrollBehavior: to => {
    if (to.hash) {
      return { selector: to.hash };
    } else {
      return { x: 0, y: 0 };
    }
  }
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isAuthenticated = auth.currentUser;

  if (requiresAuth && !isAuthenticated) {
    next('/'); 
  } else {
    next(); 
  }
});

export default router;
