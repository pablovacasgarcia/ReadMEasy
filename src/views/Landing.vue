<template>
  <section class="section-hero section-shaped my-0">
      <div class="shape shape-style-1 shape-primary">
          <span class="span-150"></span>
          <span class="span-50"></span>
          <span class="span-50"></span>
          <span class="span-75"></span>
          <span class="span-100"></span>
          <span class="span-75"></span>
          <span class="span-50"></span>
          <span class="span-100"></span>
          <span class="span-50"></span>
          <span class="span-100"></span>
      </div>
      <div class="container shape-container d-flex align-items-center">
          <div class="col px-0">
              <div class="row justify-content-center align-items-center">
                  <div class="col-lg-7 text-center pt-lg">
                      <img src="img/brand/white.svg" fetchpriority="high" style="width: 20rem" class="img-fluid" alt="ReadMEasy Logo">
                      <h1 class="lead text-white">The Easiest <span class="text-info font-weight-bold">README</span> Generator</h1>
                      <div v-if="currentUser" class="btn-wrapper mt-5 d-flex flex-column">
                        <router-link to="/workbench/NewReadMe">
                          <base-button
                              class="w-50"
                              type="info"
                              icon="ni ni-ruler-pencil">
                              New README
                          </base-button>
                        </router-link>
                        <router-link to="/explore" class="mt-2">
                          <base-button
                              class="w-50"
                              type="white"
                              icon="ni ni-planet">
                              Explore
                          </base-button>
                        </router-link>
                      </div>
                      <div v-else class="btn-wrapper mt-5 d-flex flex-column">
                        <router-link to="/login">
                          <base-button
                              class="w-50"
                              type="white"
                              icon="fa fa-sign-in">
                              Login
                          </base-button>
                        </router-link>
                        <router-link to="/register" class="mt-2">
                          <base-button
                              class="w-50"
                              type="dark"
                              icon="ni ni-badge">
                              Register
                          </base-button>
                        </router-link>
                      </div>
                  </div>
              </div>
              <div class="row align-items-center justify-content-between stars-and-coded">
                  <div class="col-sm-4">
                      <span class="text-white alpha-7 ml-3">Star me on</span>
                      <a href="https://github.com/pablovacasgarcia/ReadMEasy" target="_blank" title="Support us on Github">
                          <img src="img/brand/github-white-slim.png" style="height: 22px; margin-top: -3px" alt="GitHub Logo">
                      </a>
                  </div>
                  <div class="col-sm-4 mt-4 mt-sm-0 text-right">
                      <span class="text-white alpha-7">Coded by</span>
                      <a href="https://github.com/pablovacasgarcia" class="text-white font-weight-bold" target="_blank">
                          Pablo Vacas García
                      </a>
                  </div>
              </div>
          </div>
      </div>
  </section>
</template>

<script>
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default {
  data() {
    return {
      currentUser: null
    }
  },

  mounted() {
    const auth = getAuth();

    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.currentUser = user;
      }
    });
  }
};
</script>

<style scoped>
  .section-hero {
    height: 100vh;
  }
</style>
