<template>
    <header class="header-global">

        <!-- Navbar for big devices -->
        <base-nav class="navbar-main position-fixed bg-white shadow-sm" transparent type="" effect="dark" expand>

            <!-- Brand Logo -->
            <router-link slot="brand" class="navbar-brand mr-lg-5" to="/">
                <img src="/img/brand/blue.png" alt="ReadMEasy">
            </router-link>

            <!-- Close button -->
            <div class="row" slot="content-header" slot-scope="{closeMenu}">
                <div class="col-6 collapse-brand">
                </div>
                <div class="col-6 collapse-close">
                    <close-button @click="closeMenu"></close-button>
                </div>
            </div>
            
            <!-- Navbar items -->
            <div class="navbar-nav align-items-lg-center ml-lg-auto">
                <ul class="d-flex align-items-center mb-0">
                    <base-dropdown class="nav-item" menu-classes="dropdown-menu-lg">
                        <div slot="title" class="nav-link" data-toggle="dropdown" role="button" @click.prevent>
                            <span class="nav-link-inner--text text-dark font-weight-bold">ReadMEs</span>
                        </div>
                        <div class="dropdown-menu-inner">
                            <router-link :to="{name:'workbench', params:{id:'NewReadMe'}}" class="media d-flex align-items-center">
                                <div class="icon icon-shape bg-gradient-info rounded-circle text-white">
                                    <i class="ni ni-ruler-pencil"></i>
                                </div>
                                <div class="media-body ml-3">
                                    <h5 class="heading text-info mb-md-1">New ReadME</h5>
                                    <p class="description d-none d-md-inline-block mb-0">Create and design a new ReadME project</p>
                                </div>
                            </router-link>
                            <router-link :to="{name: 'profile', params:{id: 'MyProfile', section: 'readmes'}}" v-if="user" class="media d-flex align-items-center">
                                <div class="icon icon-shape bg-gradient-primary rounded-circle text-white">
                                    <i class="ni ni-spaceship"></i>
                                </div>
                                <div class="media-body ml-3">
                                    <h6 class="heading text-primary mb-md-1">My ReadMEs</h6>
                                    <p class="description d-none d-md-inline-block mb-0">View and edit your ReadMEs</p>
                                </div>
                            </router-link>
                            <RouterLink to="/explore" v-if="user" class="media d-flex align-items-center">
                                <div class="icon icon-shape bg-gradient-warning rounded-circle text-white">
                                    <i class="ni ni-planet"></i>
                                </div>
                                <div class="media-body ml-3">
                                    <h5 class="heading text-warning mb-md-1">Explore</h5>
                                    <p class="description d-none d-md-inline-block mb-0">Explore popular readmes and templates to use</p>
                                </div>
                            </RouterLink>
                            <div v-if="!isPWAInstalled" @click="installApp" id="install-button" class="media d-flex align-items-center">
                                <div class="icon icon-shape bg-gradient-success rounded-circle text-white">
                                    <i class="ni ni-cloud-download-95"></i>
                                </div>
                                <div class="media-body ml-3">
                                    <h5 class="heading text-success mb-md-1">Install</h5>
                                    <p class="description d-none d-md-inline-block mb-0">Install ReadMEasy and start working in one click</p>
                                </div>
                            </div>
                        </div>
                    </base-dropdown>
                </ul>
                    <div class="nav-item search-item" v-if="user">
                        <base-input alternative placeholder="Search" addon-right-icon="fa fa-search" inputClasses="search-input" @keyup.enter="search()" v-model="searchInput"></base-input>
                    </div>
                <ul class="d-flex align-items-center mb-0">
                    <template>
                        <base-dropdown class="nav-item" menu-classes="dropdown-menu-sm">
                            <div slot="title" class="nav-link" data-toggle="dropdown" role="button" @click.prevent aria-label="Profile options">
                                <img v-if="user && user.photoURL" :src="user.photoURL" class="profile-image rounded-circle" width="30" height="30" alt="Profile Image"/>
                                <img v-else src="https://firebasestorage.googleapis.com/v0/b/readmeasy.appspot.com/o/images%2Fcat-symbol-svgrepo-com.svg?alt=media&token=5baf8f00-3b2e-4157-8428-7db153bce3b8" class="profile-image rounded-circle" width="30" height="30" alt="Profile Image"/>
                            </div>
                            <div v-if="user" class="dropdown-menu-inner" aria-labelledby="navbar-default_dropdown_1">
                                <router-link :to="{name:'profile', params:{id:'MyProfile'}}" class="dropdown-item"><i class="ni ni-single-02"></i>My profile</router-link>
                                <router-link :to="{name: 'profile', params:{id: 'MyProfile', section: 'liked'}}" class="dropdown-item"><i class="ni ni-favourite-28"></i>Liked</router-link>
                                <router-link :to="{name: 'profile', params:{id: 'MyProfile', section: 'following'}}" class="dropdown-item"><i class="fa fa-users"></i>Following</router-link>
                                <div class="dropdown-divider"></div>
                                <a class="dropdown-item" href="" @click="signOut"><i class="fa fa-sign-out"></i>Sign out</a>
                            </div>
                            <div v-else  class="dropdown-menu-inner" aria-labelledby="navbar-default_dropdown_1">
                                <router-link to="/login"  class="dropdown-item"><i class="fa fa-sign-in"></i>Login</router-link>
                                <div class="dropdown-divider"></div>
                                <router-link to="/register"  class="dropdown-item"><i class="ni ni-badge"></i>Register</router-link>
                            </div>
                        </base-dropdown>
                    </template>
                </ul>
            </div>
        </base-nav>

        <!-- Navbar for small devices -->
        <base-nav class="navbar-mobile position-fixed bg-white shadow-sm" transparent type="" effect="">
            <!-- Brand Logo -->
            <router-link slot="brand" class="navbar-brand mr-lg-5" to="/">
                <img src="/img/brand/blue.png" alt="logo">
            </router-link>

            <!-- Menu header -->
            <div class="row" slot="content-header" slot-scope="{closeMenu}">
                <!-- Profile photo -->
                <div class="pl-5 col-10 collapse-brand d-flex w-100 justify-content-center mt-5">
                    <router-link v-if="user" :to="{name:'profile', params:{id:'MyProfile'}}">
                        <img v-if="user && user.photoURL" :src="user.photoURL" class="profile-image rounded-circle ml-3" alt="Profile Image"/>
                        <img v-else src="https://firebasestorage.googleapis.com/v0/b/readmeasy.appspot.com/o/images%2Fcat-symbol-svgrepo-com.svg?alt=media&token=5baf8f00-3b2e-4157-8428-7db153bce3b8" class="profile-image rounded-circle ml-3" alt="Profile Image"/>
                    </router-link>
                </div>

                <!-- Close button -->
                <div class="col-11 collapse-close position-absolute">
                    <close-button @click="closeMenu" id="close-button"></close-button>
                </div>

                <!-- Sign out button -->
                <div v-if="user" class="m-2 ml-4 position-absolute" @click="signOut()">
                    <i class="fa fa-sign-out fa-lg text-danger"></i>
                </div>
                     
                <!-- My profile link -->
                <router-link v-if="user" :to="{name:'profile', params:{id:'MyProfile'}}" class="w-100 text-center mt-3 text-primary mb-2"><span class="" >My profile</span></router-link>
            </div>

            <!-- Navbar items -->
            <ul class="navbar-nav align-items-center ml-lg-auto mt-4">
                <template v-if="user">                    
                    <li class="nav-item">
                        <router-link :to="{name: 'profile', params:{id: 'MyProfile', section: 'readmes'}}" class="nav-link nav-link-icon"><i class="ni ni-spaceship"></i><span class="nav-link-inner--text d-lg-none">My ReadMEs</span></router-link>
                    </li>
                    <li class="nav-item">
                        <router-link :to="{name: 'profile', params:{id: 'MyProfile', section: 'liked'}}" class="nav-link nav-link-icon"><i class="ni ni-favourite-28"></i><span class="nav-link-inner--text d-lg-none">Liked</span></router-link>
                    </li>
                    <li class="nav-item">
                        <router-link :to="{name: 'profile', params:{id: 'MyProfile', section: 'following'}}" class="nav-link nav-link-icon"><i class="fa fa-users"></i><span class="nav-link-inner--text d-lg-none">Following</span></router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/explore" class="nav-link nav-link-icon"><i class="ni ni-planet"></i><span class="nav-link-inner--text d-lg-none">Explore</span></router-link>
                    </li>
                </template>
                <template v-else>
                    <li class="nav-item">
                        <router-link to="/login" class="nav-link nav-link-icon"><i class="fa fa-sign-in"></i><span class="nav-link-inner--text d-lg-none">Login</span></router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/register" class="nav-link nav-link-icon"><i class="ni ni-badge"></i><span class="nav-link-inner--text d-lg-none">Register</span></router-link>
                    </li>
                </template>
            </ul>
            <div class="mt-3">
                <div v-if="user" >
                    <base-input alternative placeholder="Search" addon-left-icon="fa fa-search" class="search-mobile" @keyup.enter="search()" v-model="searchInput"></base-input>
                </div>
                <div class="mt-3">
                    <router-link :to="{name:'workbench', params:{id:'NewReadMe'}}"><base-button class="search-mobile" type="primary" icon="ni ni-ruler-pencil">New ReadME</base-button></router-link>
                </div>
                <div v-if="!isPWAInstalled" class="mt-3">
                    <base-button @click="installApp" id="install-button-mobile" class="search-mobile" type="success" icon="ni ni-cloud-download-95">Install</base-button>
                </div>
            </div>            
        </base-nav>

        <!-- Install Instructions modal -->
        <modal :show.sync="iphoneInstall">
                <!-- Modal content -->
                <h6 slot="header" class="modal-title" id="modal-title-default">How to install</h6>

                <!-- Modal content -->
                <div class="container">
                    <p>1. Tap the <img src="/img/icons/common/share-icon.svg" width="30" alt="Share icon"> share button at the bottom of the screen.</p>
                    <p>2. Scroll down and tap <span class="font-weight-bold text-primary"><img src="/img/icons/common/add-icon.svg" width="30" alt="Add Icon">Add to Home Screen</span>.</p>
                    <p>3. Tap <span class="font-weight-bold text-primary">Add</span> in the top right corner.</p>
                </div>                        

                <!-- Modal footer -->
                <template slot="footer">
                    <base-button type="link" class="ml-auto" @click="iphoneInstall = false">Close</base-button>
                </template>
            </modal>
    </header>
</template>

<script>
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { db } from '../../firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import BaseNav from "@/components/BaseNav";
import BaseDropdown from "@/components/BaseDropdown";
import CloseButton from "@/components/CloseButton";
import Modal from "@/components/Modal";
import { RouterLink } from "vue-router";

export default {
    components: {
        BaseNav,
        CloseButton,
        BaseDropdown,
        Modal
    },
    data() {
        return {
            user: null,
            searchInput: '',
            deferredPrompt: null,
            isPWAInstalled: false,
            iphoneInstall: false
        };
    },
    async mounted() {
        // Get the currently signed-in user
        const auth = getAuth();
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userRef = doc(db, "user", user.uid);
                onSnapshot(userRef, (userSnap) => {
                    if (userSnap.exists()) {
                        this.user = userSnap.data();
                    } else {
                        console.log("No such user document!");
                    }
                }, (error) => {
                    console.error("Error listening to user document:", error);
                });
            } else {
                console.log("No user is signed in.");
            }
        });

        // Close the mobile menu after navigating
        this.$router.afterEach(() => {
            const closeButton = document.getElementById('close-button');
            if (closeButton) {
                closeButton.click();
            }
        });

        // Prevent PWA Install prompt
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
        });

        // Detect when the app is installed
        window.addEventListener('appinstalled', () => {
            this.isPWAInstalled = true; 
        });

        // Verify if the app is installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            this.isPWAInstalled = true;
        }
    },
    methods: {
        // Sign out the user
        signOut() {
            const auth = getAuth();
            signOut(auth).then(() => {
                this.user = null;
            }).catch(error => {
                console.error("Error signing out: ", error);
            });
        },

        // Handle install button click
        installApp() {
            if(/iPhone|iPad/i.test(navigator.userAgent)){
                this.iphoneInstall = true;
            } else if (this.deferredPrompt) {
                this.deferredPrompt.prompt();
                this.deferredPrompt.userChoice.then((choiceResult) => {
                    if (choiceResult.outcome === 'accepted') {
                        console.log('User accepted the install prompt');
                    } else {
                        console.log('User dismissed the install prompt');
                    }
                    this.deferredPrompt = null;
                });
            }
        },

        // Search for ReadMEs
        search() {
            this.$router.push({ name: 'explore', params: { search: this.searchInput } });
            this.searchInput = '';
        }
    }
}
</script>


<style>
/* Navbar styles */
nav {
    opacity: 0.95!important;
}

.nav-link:hover {
    cursor: pointer;
}

/* Search input */
.search-item {
    width: 7rem;
    margin-top: auto;
}

.search-item .input-group .form-control, .search-item .input-group .input-group-text {
    height: 2rem;
}

/* Navbar mobile */
.navbar-mobile {
    display: none!important;;
}

.navbar-mobile .nav-item {
    width: 90%;
}

.navbar-mobile .nav-link {
    font-size: 2.5vh;
}

.navbar-mobile .nav-link .nav-link-inner--text {
    margin-left: 1rem!important;
}

.search-mobile {
    width: 100%!important;
    font-size: 2vh!important;
    height: 6vh;
    padding: 0!important;
    margin-bottom: 0 !important;
}

.search-mobile .form-control, .search-mobile .input-group-text {
    height: 6vh;
    font-size: 2vh;
}

/* Profile dropdown */
.dropdown-menu-sm {
    margin-left: -150%!important;
}

.dropdown-menu-sm::before {
    left: 65%!important;
}

.profile-image {
    object-fit: cover;
}

/* Navbar active link */
.router-link-active {
    background-color: white !important;
    color: var(--dark)!important;
}

.router-link-active:hover {
    background-color: var(--secondary) !important;
    color: var(--dark)!important;
}

#install-button:hover {
    cursor: pointer;
}

#install-button:hover .media-body, #install-button:hover h5{    
    color: var(--dark) !important;
}

/* Media queries */
@media screen and (max-width: 991.5px) {
    .navbar-main {
        display: none!important;;
    }

    .navbar-mobile {
        display: inherit!important;
    }

    nav {
        opacity: 1!important;
    }

    .collapse-close {
        right: 30!important;
    }

    .profile-image {
        width: 10rem!important;
        height: 10rem!important;
    }
}
</style>
