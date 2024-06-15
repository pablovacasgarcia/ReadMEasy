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

                        <!-- Login form -->
                        <template>
                            <div class="text-muted text-center mb-3">
                                <small>Sign in with</small>
                            </div>

                            <!-- Social login buttons -->
                            <div class="btn-wrapper text-center">
                                <base-button type="neutral" @click="signInWithGithub">
                                    <img slot="icon" src="/img/icons/common/github.svg">
                                    Github
                                </base-button>

                                <base-button type="neutral" @click="signInWithGoogle">
                                    <img slot="icon" src="/img/icons/common/google.svg">
                                    Google
                                </base-button>
                            </div>
                        </template>

                        <!-- Or sign in with credentials -->
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

                    <!-- Create new account -->
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
import { auth, googleProvider, githubProvider, db } from '../../firebase';
import {doc, setDoc, getDoc} from "firebase/firestore";


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
                this.saveUserData(user);
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
                this.saveUserData(user);
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

        // Saves the user data to the database
        async saveUserData(user) {
            try {
                const userRef = doc(db, "user", user.uid);
                const userSnap = await getDoc(userRef);

                if (userSnap.exists()) {
                    this.user = userSnap.data();
                } else {
                    await setDoc(doc(db, 'user', user.uid), {
                        fullName: this.name || user.displayName,
                        username: this.username || user.email.split('@')[0],
                        email: user.email,
                        photoURL: user.photoURL
                    });
                }
            } catch (error) {
                console.error('Error saving user data: ', error);
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
                case 'Firebase: Error (auth/popup-closed-by-user).':
                    return 'The popup has been closed by the user before finalizing the operation.';
                case 'Firebase: Error (auth/popup-blocked).':
                    return 'The popup has been blocked by the browser.';
                case 'Firebase: Error (auth/invalid-email).':
                    return 'The email address is not valid.';
                case 'Firebase: Error (auth/user-not-found).':
                    return 'The user with the provided email address does not exist.';
                case 'Firebase: Error (auth/cancelled-popup-request).':
                    return 'The popup has been closed by the user before finalizing the operation.';
                default:
                    return 'An error occurred. Please try again later.';
            }
        }
    }
};
</script>
<style scoped>
.section-shaped{
    min-height: 100vh!important;
}
</style>