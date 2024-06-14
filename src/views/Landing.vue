<template>
  <div>
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
          <section class="row justify-content-center align-items-center">
            <div class="col-lg-7 text-center pt-lg">

              <!-- Logo -->
              <img src="img/brand/white.svg" fetchpriority="high" style="width: 20rem" class="img-fluid" alt="ReadMEasy Logo">

              <!-- Title -->
              <h1 class="lead text-white">The Easiest <span class="text-info font-weight-bold">README</span> Generator</h1>

              <!-- Buttons if logged -->
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

              <!-- Buttons if not logged -->
              <div v-else class="btn-wrapper mt-5 d-flex flex-column">
                <router-link to="/login">
                  <base-button
                    class="w-50"
                    type="white"
                    icon="fa fa-sign-in">
                    Login
                  </base-button>
                </router-link>
                <div class="mt-2" @click="scrollToWorkbench">
                  <base-button
                    class="w-50"
                    type="info"
                    icon="ni ni-spaceship">
                    Try it
                  </base-button>                
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </section>

    <!-- Workbench Preview -->
    <section class="pb-3">
      <div class="container d-flex flex-column align-items-center">
        <div class="preview-container">
          <Workbench :sectionsProp="sections"/>
        </div>
        <router-link to="/workbench/NewReadMe" class="preview-button">
          <base-button type="primary">Go to Workbench</base-button>
        </router-link>
      </div>
    </section>

    <!-- Logged Features -->
    <section class="section section-lg section-shaped">
      <div class="shape shape-style-1 shape-default shape-skew">
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
      <div class="container features">
        <div class="row row-grid align-items-center">
          <div class="col-md-6 order-2">
            <img src="img/theme/promo-1.png" class="img-fluid floating">
          </div><div class="col-md-6 order-1">
            <div class="pr-md-5">
              <h3 class="text-white"><span class="text-underline font-weight-bold">Logged</span> users features</h3>
              <p class="text-white">
                Join our community and enjoy exclusive features!
                <br>By registering, you'll gain access to advanced tools that enhance your experience and productivity. 
                <br>Customize your profile, save and edit your ReadMEs, and much more. 
                Start now and discover everything you can achieve with these unique features.
              </p>
              <ul class="list-unstyled mt-5">
                <li class="py-2">
                  <div class="d-flex align-items-center">
                    <span class="badge mr-3 badge-white badge-circle">
                      <i class="ni ni-spaceship"></i>
                    </span>
                    <h6 class="mb-0 text-white">Save and edit your ReadMEs</h6>
                  </div>
                </li>
              <li class="py-2">
                <div class="d-flex align-items-center">
                  <span class="badge mr-3 badge-white badge-circle">
                    <i class="ni ni-planet"></i>
                  </span>
                  <h6 class="mb-0 text-white">Explore other users and ReadMEs</h6>
                </div>
              </li>
              <li class="py-2">
                  <div class="d-flex align-items-center">
                    <span class="badge mr-3 badge-white badge-circle">
                      <i class="ni ni-single-copy-04"></i>
                    </span><h6 class="mb-0 text-white">Search and use some awesome templates</h6>
                  </div>
                </li>
                <li class="py-2">
                  <div class="d-flex align-items-center">
                    <span class="badge mr-3 badge-white badge-circle">
                      <i class="ni ni-satisfied"></i>
                    </span><h6 class="mb-0 text-white">Follow users and like ReadMEs</h6>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Links -->
    <section class="links">
      <div class="container w-100 d-flex align-items-center justify-content-between stars-and-coded mb-5">
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
        <div>
          <span class="font-weight-bold">Support me on</span>
          <a href="https://www.paypal.com/donate/?hosted_button_id=C5YCAALP9EF5J" class="font-weight-bold" target="_blank" title="Support me on Paypal">
            Paypal
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Workbench from './Workbench.vue';

export default {
  name: 'Landing',
  components: {
    Workbench
  },
  data() {
    return {
      currentUser: null,
      sections: JSON.stringify([{"title":"Heading","content":"<h1 class=\"field\">How to create a README</h1>"},{"title":"Text","content":"<p class=\"field\">Creating a README could be really easy or diffcult.                          \nWhich way will you choose?</p>"},{"title":"Subheading","content":"<h2 class=\"field\">Difficult Way ❌</h2>"},{"title":"Ordered List","content":"<ol><li class=\"field\">Learn MarkDown Language 📖</li><li class=\"field\">Think about what to write 💭</li><li class=\"field\">Waste your time testing ⌚</li><li class=\"field\">Give up and leave it halfway 😿</li><li class=\"field\">Back to step 1 ⤴︎</li></ol>"},{"title":"Subheading","content":"<h2 class=\"field\">ReadMEasy Way ✔️</h2>"},{"title":"Ordered List","content":"<ol><li class=\"field\">Open ReadMEasy 🌐</li><li class=\"field\">Choose a tempate 👍</li><li class=\"field\">Edit it to your liking ✎</li><li class=\"field\">Download it and upload it to your repository 📂</li><li class=\"field\">Enjoy 👇🏻</li></ol>"},{"title":"Image","content":"<p class=\"field\" width=\"100\" height=\"50\">https://firebasestorage.googleapis.com/v0/b/readmeasy.appspot.com/o/images%2F5eeea355389655.59822ff824b72.gif?alt=media&amp;token=e5261eed-6ea7-49f1-a64f-c4dccd78f691</p>"}])
    }
  },
  mounted() {
    // Check if user is logged
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.currentUser = user;
      }
    });
  },

  methods: {
    // Scroll to workbench
    scrollToWorkbench() {
      const previewContainer = document.querySelector('.preview-container').parentElement.parentElement;
      previewContainer.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }

  }
};
</script>

<style scoped>
/* Styles of hero container */
.shape {
  height: 100vh;
}

.section-hero {
  min-height: 100vh;
  height: fit-content;
  padding-top: 10vh;
}

/* Styles of preview container */
.preview-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  overflow: hidden;
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 0 0.5rem 0 var(--default);
  margin-top: -2rem;
  border: 2px solid white;
  z-index: 1;
  transition: border 1s;
}

.preview-container:hover, .preview-button:hover ~ .preview-container {
  border: 2px solid var(--primary);
}

.preview-button>>>button {  
  border-radius: 0px 0px 1rem 1rem !important;
  margin-top: -5rem;
  transition: margin-top 2s;
}

.preview-button>>>button:hover {
  margin-bottom: 0;
}

.preview-container:hover ~ .preview-button>>>button, .preview-button>>>button:hover {
  margin-top: 0;
}

.preview-container>>>.section-shaped{
  padding-top: 0;
  height: 80vh!important;
  overflow-x: hidden;
  overflow-y: auto;
  width: 100%;
}

.section-shaped>>>#sections{
  width: 25%;
}

.section-shaped>>>#preview-display p, .section-shaped>>>#preview-display li{
  font-size: 0.8rem;
}

.section-shaped>>>#preview-display h1{
    font-size: 1.5rem;
}

.section-shaped>>>#preview-display h2{
    font-size: 1rem;
}

.section-shaped>>>#preview-display pre p{
    font-size: 0.6rem!important;
}

.preview-container .section-shaped>>>h2{
  font-size: 1.5rem;
}

.section-shaped>>>.buttons button{
  font-size: 0.6rem!important;
  padding: 0.5rem 0.7rem;
}

.section-shaped>>>.buttons button:nth-child(3){
  display: none;
}

.section-shaped>>>.buttons-mobile button:nth-child(3){
  display: none;
}

/* Styles of features container */
.features {
  margin-top: -5rem;
}

/* Styles of links */
.links {
  margin-top: -5rem;
  text-shadow: 
      -1px -1px 0 #fff,  
       1px -1px 0 #fff,
      -1px  1px 0 #fff,
       1px  1px 0 #fff;
}

/* Media queries */
@media screen and (max-width: 991.5px) {
  .section-hero {
    padding-top: 20vh;
  }

  .stars-and-coded {
    flex-direction: column;
  }

  .preview-container {
    height: 70vh !important;
  }

  .preview-container>>>.section-shaped{
    padding-top: 10vh;
  }

  .preview-container>>>.preview-display {
    height: 50vh !important;
  }
}
</style>
