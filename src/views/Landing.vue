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
              <div class="preview-container">
                <div class="preview w-100 h-100 mt-5 border rounded">

                </div>
              </div>
              <div class="w-100 d-flex align-items-center justify-content-between stars-and-coded mb-5">
                  <div>
                      <span class="font-weight-bold">Star me on</span>
                      <a href="https://github.com/pablovacasgarcia/ReadMEasy" class="font-weight-bold" target="_blank" title="Support us on Github">
                          GitHub
                      </a>
                  </div>
                  <div>
                      <span class="font-weight-bold">Coded by</span>
                      <a href="https://github.com/pablovacasgarcia" class="font-weight-bold" target="_blank">
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
import AOS from 'aos';

export default {
  name: 'Landing',
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

    AOS.init();
  }
};
</script>

<style scoped>
  .shape {
    height: 100vh;
  }

  .section-hero {
    min-height: 100vh;
    height: fit-content;
  }

  .preview-container {
    display: flex;
    justify-content: center;
    height: 80vh;
  }

  @media screen and (max-width: 991.5px){
    .stars-and-coded {
      flex-direction: column;
    }
  }
</style>
