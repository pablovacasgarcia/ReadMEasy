<template>
    <section class="section section-shaped section-lg my-0">
        <div class="shape shape-style-1 bg-gradient-default">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
        </div>
        <div class="container pt-lg-md">
            <div class="row justify-content-center">
                <div class="col-lg-5">
                    <card type="secondary" shadow
                          header-classes="bg-white pb-5"
                          body-classes="px-lg-5 py-lg-5"
                          class="border-0">
                        <template>
                            <div class="text-muted text-center mb-3">
                                <small>Sign in with</small>
                            </div>
                            <div class="btn-wrapper text-center">
                                <base-button type="neutral" @click="signInWithGithub">
                                    <img slot="icon" src="img/icons/common/github.svg">
                                    Github
                                </base-button>

                                <base-button type="neutral" @click="signInWithGoogle">
                                    <img slot="icon" src="img/icons/common/google.svg">
                                    Google
                                </base-button>
                            </div>
                        </template>
                        <template>
                            <div class="text-center text-muted m-3">
                                <small>Or sign in with credentials</small>
                            </div>
                            <form>
                                <base-input v-model="email"
                                            alternative
                                            class="mb-3"
                                            placeholder="Email"
                                            addon-left-icon="ni ni-email-83">
                                </base-input>
                                <base-input v-model="password"
                                alternative
                                            type="password"
                                            placeholder="Password"
                                            addon-left-icon="ni ni-lock-circle-open">
                                </base-input>
                                <div class="text-center">
                                    <base-button type="primary" class="my-4" @click="signInWithEmail">Sign In</base-button>
                                </div>
                                <base-alert class="notification pr-5 alert-dismissible" type="danger" v-show="error != ''">
                                    <strong>Ups!</strong> {{ error }}
                                    <button @click="error = false" type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true">×</span></button>                         
                                </base-alert>
                            </form>
                        </template>
                    </card>
                    <div class="row mt-3">
                        <div class="col-12 text-center">
                            <RouterLink to="/register" class="text-light">
                                <small>Create new account</small>
                            </RouterLink>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
<script>
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { auth, googleProvider, githubProvider } from '../../firebase';


export default {
    data() {
        return {
            email: '',
            password: '',
            error: ''
        };
    },
    methods: {

        // Sign in with Google
        async signInWithGoogle() {
            try {
                const result = await signInWithPopup(auth, googleProvider);
                const user = result.user;
                this.$router.push('/');
            } catch (error) {
                console.error('Error signing in with Google: ', error);
                this.error = this.extractErrorMessage(error.message);
            }
        },

        // Sign in with Github
        async signInWithGithub() {
            try {
                const result = await signInWithPopup(auth, githubProvider);
                const user = result.user;
                this.$router.push('/');
            } catch (error) {
                console.error('Error signing in with Github: ', error);
                this.error = this.extractErrorMessage(error.message);
            }
        },

        // Sign in with email and password
        async signInWithEmail() {
            try {
                const result = await signInWithEmailAndPassword(auth, this.email, this.password);
                const user = result.user;
                this.$router.push('/');
            } catch (error) {
                console.error('Error signing in with email: ', error);
                this.error = this.extractErrorMessage(error.message);
            }
        },

        // Extracts the error message from the error object
        extractErrorMessage(message) {
            console.log(message);

            switch (message) {
                case 'Firebase: Error (auth/invalid-credential).':
                    return 'Email or password is incorrect. Please try again.';
                case 'Firebase: Error (auth/account-exists-with-different-credential).':
                    return 'An account already exists with the same email address and different credentials.';
                default:
                    return 'An error occurred. Please try again later.';
            }
        }
    }
};
</script>
<style>
</style>
../firebase