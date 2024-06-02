<template>
    <div class="profile-page">
        <section class="section-profile-cover section-shaped my-0">
            <div class="shape shape-style-1 shape-primary shape-skew alpha-4">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </div>
        </section>
        <section class="section section-skew">
            <div class="container">
                <card shadow class="card-profile mt--300" no-body>
                    <div class="px-4">
                        <div class="row justify-content-center">
                            <div class="col-lg-3 order-lg-2">
                                <div class="card-profile-image">
                                    <a href="#">
                                        <img v-if="user.photoURL" :src="user.photoURL" class="rounded-circle" />
                                        <img v-else src="img/theme/team-4-800x800.jpg" class="rounded-circle" />
                                    </a>
                                </div>
                            </div>
                            <div class="col-lg-4 order-lg-3 text-lg-right align-self-lg-center">
                                <div class="card-profile-actions py-4 mt-lg-0">
                                    <base-button type="info" size="sm" class="mr-4">Connect</base-button>
                                    <base-button type="default" size="sm" class="float-right">Message</base-button>
                                </div>
                            </div>
                            <div class="col-lg-4 order-lg-1">
                                <div class="card-profile-stats d-flex justify-content-center">
                                    <div>
                                        <span class="heading">22</span>
                                        <span class="description">Friends</span>
                                    </div>
                                    <div>
                                        <span class="heading">10</span>
                                        <span class="description">Photos</span>
                                    </div>
                                    <div>
                                        <span class="heading">89</span>
                                        <span class="description">Comments</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="text-center mt-5">
                            <h3>{{ user.displayName }}
                                <span class="font-weight-light" v-if="user.age">, {{ user.age }}</span>
                            </h3>
                            <div class="h6 font-weight-300"><i class="ni location_pin mr-2"></i>{{ user.location }}</div>
                            <div class="h6 mt-4"><i class="ni business_briefcase-24 mr-2"></i>{{ user.jobTitle }}</div>
                            <div><i class="ni education_hat mr-2"></i>{{ user.education }}</div>
                        </div>
                        <div class="mt-5 py-5 border-top text-center">
                            <div class="row justify-content-center">
                                <div class="col-lg-9">
                                    <p>{{ user.description }}</p>
                                    <a href="#">Show more</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </card>
            </div>
        </section>
    </div>
</template>

<script>
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../../firebase';

export default {
    props: {
        userId : {
            type: String,
            required: true
        }
    },
    data() {
        return {
            user: {
                displayName: '',
                photoURL: '',
                location: '', 
                jobTitle: '', 
                education: '',
                description: '', 
            }
        };
    },
    created() {
        console.log(this.userId);
        onAuthStateChanged(auth, (user) => {
            if (user) {
                this.user.displayName = user.displayName;
                this.user.photoURL = user.photoURL;
                // Add additional user information if needed
            } else {
                // User is signed out
                this.$router.push('/login');
            }
        });
    }
};
</script>

<style>
</style>
