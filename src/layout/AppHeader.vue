<template>
    <header class="header-global">
        <base-nav class="navbar-main position-fixed bg-white shadow-sm" transparent type="" effect="dark" expand>
            <router-link slot="brand" class="navbar-brand mr-lg-5" to="/">
                <img src="img/brand/blue.png" alt="logo">
            </router-link>

            <div class="row" slot="content-header" slot-scope="{closeMenu}">
                <div class="col-6 collapse-brand">
                    <a href="https://demos.creative-tim.com/vue-argon-design-system/documentation/">
                        <img src="img/brand/blue.png">
                    </a>
                </div>
                <div class="col-6 collapse-close">
                    <close-button @click="closeMenu"></close-button>
                </div>
            </div>
            
            <div class="navbar-nav align-items-lg-center ml-lg-auto">
                <base-dropdown class="nav-item" menu-classes="dropdown-menu-lg">
                    <a slot="title" href="" class="nav-link" data-toggle="dropdown" role="button" @click.prevent>
                        <span class="nav-link-inner--text text-dark">ReadMEs</span>
                    </a>
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
                        <a v-if="user" href="https://demos.creative-tim.com/vue-argon-design-system/documentation/" class="media d-flex align-items-center">
                            <div class="icon icon-shape bg-gradient-primary rounded-circle text-white">
                                <i class="ni ni-spaceship"></i>
                            </div>
                            <div class="media-body ml-3">
                                <h6 class="heading text-primary mb-md-1">My ReadMEs</h6>
                                <p class="description d-none d-md-inline-block mb-0">View and edit your ReadMEs</p>
                            </div>
                        </a>
                        <RouterLink to="/explore" v-if="user" class="media d-flex align-items-center">
                            <div class="icon icon-shape bg-gradient-warning rounded-circle text-white">
                                <i class="ni ni-planet"></i>
                            </div>
                            <div class="media-body ml-3">
                                <h5 class="heading text-warning mb-md-1">Explore</h5>
                                <p class="description d-none d-md-inline-block mb-0">Explore popular readmes and templates to use</p>
                            </div>
                        </RouterLink>
                    </div>
                </base-dropdown>

                <div class="nav-item search-item" v-if="user">
                    <base-input alternative placeholder="Search" addon-right-icon="fa fa-search" inputClasses="search-input" @keyup.enter="search()" v-model="searchInput"></base-input>
                </div>

                <template>
                    <base-dropdown class="nav-item" menu-classes="dropdown-menu-sm">
                        <a slot="title" href="#" class="nav-link" data-toggle="dropdown" role="button" @click.prevent>
                            <img v-if="user && user.photoURL" :src="user.photoURL" class="rounded-circle" width="30" height="30" />
                            <i v-else class="fa fa-user-circle fa-2x text-dark"></i>
                        </a>
                        <div v-if="user" class="dropdown-menu-inner" aria-labelledby="navbar-default_dropdown_1">
                            <router-link :to="{name:'profile', params:{id:'MyProfile'}}" class="dropdown-item"><i class="ni ni-single-02"></i>My profile</router-link>
                            <a class="dropdown-item" href="#"><i class="ni ni-favourite-28"></i>Liked</a>
                            <a class="dropdown-item" href="#"><i class="fa fa-users"></i>Following</a>
                            <div class="dropdown-divider"></div>
                            <a class="dropdown-item" href="#" @click="signOut"><i class="fa fa-sign-out"></i>Sign out</a>
                        </div>
                        <div v-else  class="dropdown-menu-inner" aria-labelledby="navbar-default_dropdown_1">
                            <router-link to="/login"  class="dropdown-item"><i class="fa fa-sign-in"></i>Login</router-link>
                            <div class="dropdown-divider"></div>
                            <router-link to="/register"  class="dropdown-item"><i class="ni ni-badge"></i>Register</router-link>
                        </div>
                    </base-dropdown>
                </template>
            </div>
        </base-nav>

        <base-nav class="navbar-mobile position-fixed bg-white shadow-sm" transparent type="" effect="">
            <router-link slot="brand" class="navbar-brand mr-lg-5" to="/">
                <img src="img/brand/blue.png" alt="logo">
            </router-link>

            <div class="row" slot="content-header" slot-scope="{closeMenu}">
                <div class="pl-5 col-10 collapse-brand d-flex w-100 justify-content-center mt-5">
                    <router-link :to="{name:'profile', params:{id:'MyProfile'}}">
                        <img v-if="user && user.photoURL" :src="user.photoURL" class="w-100 h-auto rounded-circle ml-2"/>
                        <i v-else class="fa fa-user-circle fa-5x text-dark w-100 h-auto ml-3"></i>
                    </router-link>
                </div>

                <div class="col-1 collapse-close position-absolute">
                    <close-button @click="closeMenu" id="close-button"></close-button>
                </div>
                        
                <router-link :to="{name:'profile', params:{id:'MyProfile'}}" class="w-100 text-center mt-3 text-primary mb-2"><span class="" >My profile</span></router-link>
            </div>

            <ul class="navbar-nav align-items-center ml-lg-auto mt-4">
                <template v-if="user">
                    
                    <li class="nav-item">
                        <a href="#" class="nav-link nav-link-icon"><i class="ni ni-spaceship"></i><span class="nav-link-inner--text d-lg-none">My ReadMEs</span></a>
                    </li>
                    <li class="nav-item">
                        <a href="#" class="nav-link nav-link-icon"><i class="ni ni-favourite-28"></i><span class="nav-link-inner--text d-lg-none">Liked</span></a>
                    </li>
                    <li class="nav-item">
                        <a href="#" class="nav-link nav-link-icon"><i class="fa fa-users"></i><span class="nav-link-inner--text d-lg-none">Following</span></a>
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
            <div class="nav-bottom position-absolute">
                <li v-if="user" class="nav-item nav-link">
                    <base-input alternative placeholder="Search" addon-left-icon="fa fa-search" class="search-mobile" @keyup.enter="search()" v-model="searchInput"></base-input>
                </li>
                <li class="nav-item nav-link">
                    <router-link :to="{name:'workbench', params:{id:'NewReadMe'}}"><base-button class="search-mobile" type="primary" icon="ni ni-ruler-pencil">New ReadME</base-button></router-link>
                </li>
            </div>

        </base-nav>
    </header>
</template>

<script>
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import BaseNav from "@/components/BaseNav";
import BaseDropdown from "@/components/BaseDropdown";
import CloseButton from "@/components/CloseButton";
import { RouterLink } from "vue-router";

export default {
    components: {
        BaseNav,
        CloseButton,
        BaseDropdown
    },
    data() {
        return {
            user: null,
            searchInput: ''
        };
    },
    async mounted() {
        const auth = getAuth();
        onAuthStateChanged(auth, user => {
            onAuthStateChanged(auth, async (user) => {
                if (user) {
                    const userRef = doc(db, "user", user.uid);
                    const userSnap = await getDoc(userRef);
                    if (userSnap.exists()) {
                        this.user = userSnap.data();
                    } else {
                        console.log("No such user document!");
                    }
                } else {
                    console.log("No user is signed in.");
                }
            });         
        });

        this.$router.afterEach(() => {
            const closeButton = document.getElementById('close-button');
            if (closeButton) {
                closeButton.click();
            }
        });
    },
    methods: {
        signOut() {
            const auth = getAuth();
            signOut(auth).then(() => {
                this.user = null;
            }).catch(error => {
                console.error("Error signing out: ", error);
            });
        },
        search() {
            this.$router.push({ name: 'explore', params: { search: this.searchInput } });
        }
    }
}
</script>

<style>
nav {
    opacity: 0.95!important;
}

.search-item {
    width: 7rem;
    margin-top: auto;
}

.search-item .input-group .form-control, .search-item .input-group .input-group-text {
    height: 2rem;
}

.navbar-mobile {
    display: none!important;;
}

.navbar-mobile .nav-item {
    width: 90%;
}

.navbar-mobile .nav-link .nav-link-inner--text {
    margin-left: 1rem!important;
}

.search-mobile {
    width: 100%!important;
    font-size: 2.4vh!important;
    height: 6vh;
    padding: 0!important;
}

.search-mobile .form-control, .search-mobile .input-group-text {
    height: 6vh;
    font-size: 2.5vh;
}

.dropdown-menu-sm {
    margin-left: -150%!important;
}

.dropdown-menu-sm::before {
    left: 65%!important;
}

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

    .navbar-mobile .nav-bottom {
        bottom: 40;
    }
}
</style>
