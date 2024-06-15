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
        </div>
        <div class="container pt-lg-md">
            <div class="row justify-content-center">
                <div class="col-lg-5">

                    <!-- Register form -->
                    <card type="secondary" shadow header-classes="bg-white pb-5" body-classes="px-lg-5 py-lg-5" class="border-0">
                    <template>

                        <!-- Social login buttons -->
                        <div class="text-muted text-center mb-3">
                            <small>Sign in with</small>
                        </div>
                        <div class="btn-wrapper text-center">
                            <base-button type="neutral" @click="signInWithGoogle">
                                <img slot="icon" src="/img/icons/common/google.svg">
                                Google
                            </base-button>
                            <base-button type="neutral" @click="signInWithGithub">
                                <img slot="icon" src="/img/icons/common/github.svg">
                                Github
                            </base-button>
                        </div>
                    </template>
                    <template>

                        <!-- Or sign up with credentials -->
                        <div class="text-center text-muted m-3">
                            <small>Or sign up with credentials</small>
                        </div>
                        <form>
                            <base-input 
                                v-model="name" 
                                :class="{ 'invalid-input': !nameValid }" 
                                @input="nameValid = true" 
                                alternative 
                                class="mb-3" 
                                placeholder="Name" 
                                addon-left-icon="ni ni-hat-3"
                                :iconClass="{ 'text-danger': !nameValid }">
                            </base-input>
                            <base-input 
                                v-model="email" 
                                :class="{ 'invalid-input': !emailValid }" 
                                @input="emailValid = true" 
                                alternative 
                                class="mb-3" 
                                placeholder="Email" 
                                addon-left-icon="ni ni-email-83"
                                :iconClass="{ 'text-danger': !emailValid }">
                            </base-input>
                            <base-input 
                                v-model="username" 
                                :class="{ 'invalid-input': !usernameValid }" 
                                @input="usernameValid = true" 
                                alternative 
                                class="mb-3" 
                                placeholder="Username" 
                                addon-left-icon="ni ni-circle-08"
                                :iconClass="{ 'text-danger': !usernameValid }">
                            </base-input>
                            <base-input 
                                v-model="password" 
                                @input="checkPasswordStrength" 
                                :class="{ 'invalid-input': !passwordValid }" 
                                alternative 
                                type="password" 
                                placeholder="Password" 
                                addon-left-icon="ni ni-lock-circle-open"
                                :iconClass="{ 'text-danger': !passwordValid }">
                            </base-input>
                            <div class="text-muted font-italic mb-4" v-if="password !== ''">
                                <small>Password Strength: <span id="password-strength" :class="passwordStrengthClass">{{ passwordStrength }}</span></small>
                            </div>
                            <div class="text-center">
                                <base-button type="primary" class="my-4" @click="signUpWithEmail">Create account</base-button>
                            </div>
                            <base-alert class="notification pr-5 alert-dismissible" type="danger" v-show="error != ''">
                                <strong>Ups!</strong> {{ error }}
                                <button @click="error = false" type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true">×</span></button>                         
                            </base-alert>
                        </form>
                    </template>
                    </card>

                    <!-- Already have an account -->
                    <div class="row mt-3">
                        <div class="col-12 text-center">
                            <RouterLink to="/login" class="text-light">
                                <small>Already have an account?</small>
                            </RouterLink>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
  
<script>
  import { auth, googleProvider, githubProvider, db } from '../../firebase';
  import { setDoc, doc, onSnapshot, getDoc } from "firebase/firestore";
  import { signInWithPopup, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
  
  export default {
    data() {
      return {
        name: '',
        email: '',
        username: '',
        password: '',
        passwordStrength: 'weak',
        nameValid: true,
        emailValid: true,
        usernameValid: true,
        passwordValid: true,
        error: ''
      };
    },
    methods: {

        // Signs in the user with Google
        async signInWithGoogle() {
            try {
                const result = await signInWithPopup(auth, googleProvider);
                const user = result.user;
                await this.saveUserData(user);
                this.$router.push('/');
            } catch (error) {
            console.error('Error signing in with Google: ', error);
                this.error = this.extractErrorMessage(error.message);
            }
        },

        // Signs in the user with Github
        async signInWithGithub() {
            try {
                const result = await signInWithPopup(auth, githubProvider);
                const user = result.user;
                await this.saveUserData(user);
                this.$router.push('/');
            } catch (error) {
                console.error('Error signing in with Github: ', error);
                this.error = this.extractErrorMessage(error.message);
            }
        },

        // Signs up the user with email and password
        async signUpWithEmail() {
            if (this.validateForm()) {
                try {
                    const result = await createUserWithEmailAndPassword(auth, this.email, this.password);
                    const user = result.user;
                    await updateProfile(user, { displayName: this.name });
                    await this.saveUserData(user);
                    this.$router.push('/');
                } catch (error) {
                    console.error('Error signing up with email: ', error.message);
                    this.error = this.extractErrorMessage(error.message);
                }
            } else {
                if (!this.nameValid || !this.emailValid || !this.usernameValid) {
                    this.error = 'Please fill in all the required fields.';
                } else if (!this.passwordValid) {
                    this.error = 'The password is too weak. Please choose a stronger password.';
                }
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


        // Checks the strength of the password
        checkPasswordStrength() {
            const password = this.password;
            this.passwordValid = true;
            if (password.length < 6) {
                this.passwordStrength = 'weak';
            } else if (password.length >= 6 && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) {
                this.passwordStrength = 'strong';
            } else {
                this.passwordStrength = 'medium';
            }
        },

        // Validates the form fields
        validateForm() {
            this.nameValid = this.name.trim() !== '';
            this.emailValid = this.email.trim() !== '';
            this.usernameValid = this.username.trim() !== '';
            this.passwordValid = this.passwordStrength == 'medium' || this.passwordStrength == 'strong' && this.password.trim() !== '';
    
            return this.nameValid && this.emailValid && this.usernameValid && this.passwordValid;
        },

        // Extracts the error message from the error object
        extractErrorMessage(message) {
            console.log(message);

            switch (message) {
                case 'Firebase: Error (auth/email-already-in-use).':
                    return 'The email address is already in use by another account.';
                case 'Firebase: Error (auth/invalid-email).':
                    return 'The email address is badly formatted.';
                case 'Firebase: Error (auth/weak-password).':
                    return 'The password is too weak.';
                case 'Firebase: Error (auth/account-exists-with-different-credential).':
                    return 'An account already exists with the same email address and different credentials.';
                case 'Firebase: Error (auth/cancelled-popup-request).':
                    return 'The popup has been closed by the user before finalizing the operation.';
                case 'Firebase: Error (auth/popup-blocked).':
                    return 'The popup has been blocked by the browser.';
                default:
                    return 'An error occurred. Please try again later.';
            }
        }
    },
    computed: {
        // Returns the class for the password strength
        passwordStrengthClass() {
            return {
            'text-danger': this.passwordStrength === 'weak',
            'text-warning': this.passwordStrength === 'medium',
            'text-success': this.passwordStrength === 'strong',
            };
        }
    }
  };
</script>
  
<style>
    /* Invalid input */
    .invalid-input i {
        color: var(--danger);
    }
</style>