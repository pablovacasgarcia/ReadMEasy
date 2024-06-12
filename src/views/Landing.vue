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
        </div>
        <div class="preview-container">
          <Workbench :sectionsProp="sections"/>
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
          <div>
            <span class="font-weight-bold">Support me on</span>
            <a href="https://www.paypal.com/donate/?hosted_button_id=C5YCAALP9EF5J" class="font-weight-bold" target="_blank" title="Support me on Paypal">
              Paypal
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
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
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.currentUser = user;
      }
    });
  },

  methods: {
    scrollToWorkbench() {
      const previewContainer = document.querySelector('.preview-container');
      previewContainer.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }

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
  padding-top: 10vh;
}

.preview-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  overflow: hidden;
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 0 0.5rem 0 var(--default);
  margin-top: 20vh;
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

.section-shaped>>>h2{
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
