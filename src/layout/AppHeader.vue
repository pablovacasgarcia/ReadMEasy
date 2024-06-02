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
                        <RouterLink to="/workbench" class="media d-flex align-items-center">
                            <div class="icon icon-shape bg-gradient-info rounded-circle text-white">
                                <i class="ni ni-ruler-pencil"></i>
                            </div>
                            <div class="media-body ml-3">
                                <h5 class="heading text-info mb-md-1">New ReadME</h5>
                                <p class="description d-none d-md-inline-block mb-0">Create and design a new ReadME project</p>
                            </div>
                        </RouterLink>
                        <a v-if="user" href="https://demos.creative-tim.com/vue-argon-design-system/documentation/" class="media d-flex align-items-center">
                            <div class="icon icon-shape bg-gradient-primary rounded-circle text-white">
                                <i class="ni ni-spaceship"></i>
                            </div>
                            <div class="media-body ml-3">
                                <h6 class="heading text-primary mb-md-1">My ReadMEs</h6>
                                <p class="description d-none d-md-inline-block mb-0">View and edit your ReadMEs</p>
                            </div>
                        </a>
                        <a v-if="user" href="https://demos.creative-tim.com/vue-argon-design-system/documentation/" class="media d-flex align-items-center">
                            <div class="icon icon-shape bg-gradient-warning rounded-circle text-white">
                                <i class="ni ni-planet"></i>
                            </div>
                            <div class="media-body ml-3">
                                <h5 class="heading text-warning mb-md-1">Explore</h5>
                                <p class="description d-none d-md-inline-block mb-0">Explore popular readmes and templates to use</p>
                            </div>
                        </a>
                    </div>
                </base-dropdown>

                <div class="nav-item search-item" v-if="user">
                    <base-input alternative placeholder="Search" addon-right-icon="fa fa-search" inputClasses="search-input"></base-input>
                </div>

                <template>
                    <base-dropdown class="nav-item" menu-classes="dropdown-menu-sm">
                        <a slot="title" href="#" class="nav-link" data-toggle="dropdown" role="button" @click.prevent>
                            <img v-if="user && user.photoURL" :src="user.photoURL" class="rounded-circle" width="30" height="30" />
                            <i v-else class="fa fa-user-circle fa-2x text-dark"></i>
                        </a>
                        <div v-if="user" class="dropdown-menu-inner" aria-labelledby="navbar-default_dropdown_1">
                            <RouterLink to="/profile" class="dropdown-item"><i class="ni ni-single-02"></i>My profile</RouterLink>
                            <a class="dropdown-item" href="#"><i class="ni ni-favourite-28"></i>Liked</a>
                            <a class="dropdown-item" href="#"><i class="fa fa-users"></i>Followed</a>
                            <div class="dropdown-divider"></div>
                            <a class="dropdown-item" href="#" @click="signOut"><i class="fa fa-sign-out"></i>Sign out</a>
                        </div>
                        <div v-else  class="dropdown-menu-inner" aria-labelledby="navbar-default_dropdown_1">
                            <router-link to="/login"  class="dropdown-item"><i class="fa fa-sign-in"></i>Login</router-link>
                            <div class="dropdown-divider"></div>
                            <router-link to="/register"  class="dropdown-item"><i class="fa fa-user-plus"></i>Register</router-link>
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
                <div class="pl-5 col-10 collapse-brand">
                    <RouterLink to="/profile">
                        <img v-if="user && user.photoURL" :src="user.photoURL" class="w-100 h-auto rounded-circle"/>
                    </RouterLink>
                </div>
                <div class="col-1 collapse-close">
                    <close-button @click="closeMenu"></close-button>
                </div>
                        
                <RouterLink to="/profile" class="w-100 text-center mt-3"><span class="" >My profile</span></RouterLink>
            </div>

            <ul class="navbar-nav align-items-center ml-lg-auto">
                <template v-if="user">
                    
                    <li class="nav-item">
                        <a href="#" class="nav-link nav-link-icon"><i class="ni ni-spaceship"></i><span class="nav-link-inner--text d-lg-none">My ReadMEs</span></a>
                    </li>
                    <li class="nav-item">
                        <a href="#" class="nav-link nav-link-icon"><i class="ni ni-favourite-28"></i><span class="nav-link-inner--text d-lg-none">Liked</span></a>
                    </li>
                    <li class="nav-item">
                        <a href="#" class="nav-link nav-link-icon"><i class="fa fa-users"></i><span class="nav-link-inner--text d-lg-none">Followed</span></a>
                    </li>
                    <li class="nav-item">
                        <a href="#" class="nav-link nav-link-icon"><i class="ni ni-planet"></i><span class="nav-link-inner--text d-lg-none">Explore</span></a>
                    </li>
                    <li class="nav-item nav-link">
                        <RouterLink to="/workbench"><base-button class="search-mobile" type="info" icon="ni ni-ruler-pencil">New ReadME</base-button></RouterLink>
                    </li>
                </template>
                <template v-else>
                    <li class="nav-item">
                        <router-link to="/login" class="nav-link nav-link-icon"><i class="fa fa-sign-in"></i><span class="nav-link-inner--text d-lg-none">Login</span></router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/register" class="nav-link nav-link-icon"><i class="fa fa-user-plus"></i><span class="nav-link-inner--text d-lg-none">Register</span></router-link>
                    </li>
                    <li class="nav-item nav-link">
                        <RouterLink to="/workbench"><base-button class="search-mobile" type="info" icon="ni ni-ruler-pencil">New ReadME</base-button></RouterLink>
                    </li>
                </template>

                <li v-if="user" class="nav-item nav-link">
                    <base-input alternative placeholder="Search" addon-left-icon="fa fa-search" class="search-mobile"></base-input>
                </li>
            </ul>
        </base-nav>
    </header>
</template>

<script>
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
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
            user: null
        };
    },
    mounted() {
        const auth = getAuth();
        onAuthStateChanged(auth, user => {
            this.user = user;
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

@media screen and (max-width: 991.5px) {
    .navbar-main {
        display: none!important;;
    }

    .navbar-mobile {
        display: inherit!important;
    }
}
</style>
