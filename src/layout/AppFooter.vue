<template>
    <footer class="footer has-cards">
        <div class="container">
           <hr>
            <div class="row align-items-center justify-content-md-between">                
                <router-link slot="brand" class="navbar-brand mr-lg-5" to="/">
                    <img src="https://firebasestorage.googleapis.com/v0/b/readmeasy.appspot.com/o/images%2Fblue.png?alt=media&token=86cd20a2-eea2-4e6d-822b-1dc26cbc504d" alt="logo">
                </router-link>
                <div>
                    <div class="copyright">
                        &copy; {{year}}
                        <a href="https://github.com/pablovacasgarcia" target="_blank" class="text-primary font-weight-bold">Pablo Vacas García</a>
                    </div>
                </div>
            </div>
        </div>
    </footer>
</template>
<script>
export default {
  name: 'app-footer',
  data() {
    return {
      year: new Date().getFullYear()
    }
  }
};
</script>
<style>
</style>
