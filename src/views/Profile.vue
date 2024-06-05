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
                                    <a href="">
                                        <img v-if="user.photoURL" :src="user.photoURL" class="rounded-circle" />
                                        <img v-else src="img/theme/team-4-800x800.jpg" class="rounded-circle" />
                                    </a>
                                </div>
                            </div>
                            <div class="col-lg-4 order-lg-3 text-lg-right align-self-lg-center">
                                <div class="card-profile-stats d-flex justify-content-center">
                                    <div v-if="currentUser && user.id != currentUser.uid">
                                        <base-button v-if="!user.followers || !user.followers.includes(currentUser.uid)" class="follow-button" type="primary" icon="fa fa-user-plus" @click="toggleFollow(user)">Follow</base-button>
                                        <base-button v-else outline type="primary" icon="fa fa-user-times" class="follow-button" @click="toggleFollow(user)">Unfollow</base-button>
                                    </div>
                                    <div v-else>
                                        <base-button type="primary" icon="fa fa-pencil" class="follow-button" @click="openModal('Edit Profile')">Edit</base-button>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-4 order-lg-1">
                                <div class="card-profile-stats d-flex justify-content-center">
                                    
                                    <div @click="openModal('Followers')">
                                        <span class="heading">{{ followers.length }}</span>
                                        <span class="description">Followers</span>
                                    </div>

                                    <div @click="openModal('Following')">
                                        <span class="heading">{{ following.length }}</span>
                                        <span class="description">Following</span>
                                    </div>

                                    <div v-if="!likedReadmes" @click="likedReadmes=true">
                                        <span class="heading">{{ likes.length }}</span>
                                        <span class="description">Liked</span>
                                    </div>        
                                    
                                    <div v-else @click="likedReadmes=false">
                                        <span class="heading">{{ readmes.length }}</span>
                                        <span class="description">Readmes</span>
                                    </div> 
                                </div>
                            </div>
                        </div>
                        <div class="text-center">
                            <h3>{{ user.fullName }}
                                <p class="font-weight-light text-primary">@{{ user.username }}</p>
                            </h3>
                            <div class="h6 font-weight-300"><i class="ni location_pin mr-2"></i>{{ user.location }}</div>
                            <div class="h6 mt-4"><i class="ni business_briefcase-24 mr-2"></i>{{ user.jobTitle }}</div>
                            <div><i class="ni education_hat mr-2"></i>{{ user.education }}</div>
                            <div class="row justify-content-center">
                                <div class="col-lg-9">
                                    <p>{{ user.description }}</p>
                                </div>
                            </div>
                        </div>
                        <div class="mt-5 py-5 border-top">
                            <div v-if="!likedReadmes" class="d-flex flex-wrap justify-content-center">
                                <div v-for="readme in readmes" :key="readme.id" class="readme-card m-4 d-flex flex-column justify-content-center">
                                    <div class="preview w-100 mb-3 p-4 rounded" @click="openReadme(readme)">
                                        <div class="content" v-html="readme.preview"></div>
                                    </div>
                                    
                                    <div class="d-flex align-items-center w-100 justify-content-between">
                                        <p>{{ readme.title }}</p>
                                        <p><i :class="['fa text-primary like', readme.likes && readme.likes.includes(currentUser ? currentUser.uid : '') ? 'fa-heart' : 'fa-heart-o']" @click="toggleLike(readme)"></i></p>
                                    </div>
                                </div>
                            </div>
                            <div v-else class="d-flex flex-wrap justify-content-center">
                                <div v-for="readme in likes" :key="readme.title+readme.id" class="readme-card m-4 d-flex flex-column justify-content-center">
                                    <div class="preview w-100 mb-3 p-4 rounded" @click="openReadme(readme)">
                                        <div class="content" v-html="readme.preview"></div>
                                    </div>
                                    
                                    <div class="d-flex align-items-center w-100 justify-content-between">
                                        <p>{{ readme.title }}</p>
                                        <p><i :class="['fa text-primary like', readme.likes && readme.likes.includes(currentUser ? currentUser.uid : '') ? 'fa-heart' : 'fa-heart-o']" @click="toggleLike(readme)"></i></p>
                                    </div>
                                    <span class="username text-primary">@{{ readme.userName }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </card>
            </div>
        </section>

        <modal :show.sync="modal">
            <h6 slot="header" class="modal-title" id="modal-title-default">{{ modalTitle }}</h6>
            <div class="container d-flex flex-column" v-if="modalTitle=='Followers' || modalTitle=='Following'">
                <div class="user-card border-bottom py-4" v-for="user in users" :key="user.id">
                    <div class="d-flex align-items-center justify-content-between">
                        <router-link :to="{name:'profile', params:{id:user.id}}" class="user-info d-flex align-items-center">
                            <img :src="user.photoURL" class="rounded-circle" width="50" height="50" />
                            <div class="d-flex flex-column ml-4">
                                <span class="text-default">{{ user.fullName }}</span>
                                <small class="text-primary">@{{ user.username }}</small>
                            </div>
                        </router-link>

                        <div v-if="user.id != currentUser.uid">
                            <i v-if="!user.followers || !user.followers.includes(currentUser.uid)" class="follow-icon fa fa-user-plus bg-primary text-white p-2 rounded" @click="toggleFollow(user)"></i>
                            <i v-else class="follow-icon fa fa-user-times text-primary border border-primary p-2 rounded" @click="toggleFollow(user)"></i>
                        </div>
                    </div>
                </div>
            </div>
            <template slot="footer">
                <base-button type="link" class="ml-auto" @click="modal = false">Close</base-button>
            </template>
        </modal>
    </div>
</template>

<script>
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from '../../firebase';
import { doc, getDoc, query, collection, where, getDocs, updateDoc, arrayRemove, arrayUnion, onSnapshot, userDoc  } from "firebase/firestore";
import Modal from "@/components/Modal.vue";

export default {
    name: 'Profile',
    components: {
        Modal
    },
    data() {
        return {
            user: '',
            currentUser: null,
            userId: '',
            followers: [],
            following: [],
            likes: [],
            readmes: [],
            modal: false,
            modalTitle: '',
            likedReadmes: false
        };
    },

    mounted() {   
        this.getProfileData();
    },

    watch: {
        '$route.params.id': 'getProfileData'
    },

    computed: {
        users(){
            return this.modalTitle == 'Followers' ? this.followers : this.following;
        }
    },

    methods: {

        // Get user data
        async getProfileData(){
            this.modal = false;
            this.userId = this.$route.params.id ? this.$route.params.id : 'MyProfile';

            onAuthStateChanged(auth, async (user) => {
                if (user) {
                    this.currentUser = user;
                    if (this.userId == this.currentUser.uid) {
                        this.$router.push({name: 'profile', params: {id: 'MyProfile'}});
                    }
                } else {
                    console.log("No user is signed in.");
                }
            });


            if (this.userId == 'MyProfile') {
                onAuthStateChanged(auth, async (user) => {
                    const userRef = doc(db, "user", this.currentUser.uid);
                    const userSnap = await getDoc(userRef);
                    if (userSnap.exists()) {
                        this.user = {id: user.uid, ...userSnap.data()};
                        this.updateCounts(user.uid);
                    } else {
                        console.log("No such user document!");
                    }
                });
            } else {
                const userRef = doc(db, "user", this.userId);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    this.user = userSnap.data();
                    this.updateCounts(this.userId);
                } else {
                    console.log("No such user document!");
                }
            }
        },
        
        // Get followers, following, likes and readmes count
        async updateCounts(userId){
            // Get readMes
            const readmesQuery = query(collection(db, 'readme'), where('user', '==', userId));
            onSnapshot(readmesQuery, async (snapshot) => {
            const readmesData = await Promise.all(snapshot.docs.map(async (docSnap) => {
                const data = docSnap.data();

                return {
                    id: docSnap.id,
                    title: data.title,
                    preview: data.content,
                    likes: data.likes || [],
                };
            }));
            this.readmes = readmesData;
            });

            // Get likes
            const likesQuery = query(collection(db, 'readme'), where('likes', 'array-contains', userId));
            onSnapshot(likesQuery, async (snapshot) => {
            const readmesData = await Promise.all(snapshot.docs.map(async (docSnap) => {
                const data = docSnap.data();
                let userDoc='';
                if (data.user) {
                    userDoc = await getDoc(doc(db, 'user', data.user));
                }

                return {
                    id: docSnap.id,
                    title: data.title,
                    preview: data.content,
                    userName: userDoc ? userDoc.data().username : 'ReadMEassy Templates',
                    likes: data.likes || [],
                };
            }));
            this.likes = readmesData;
            console.log(this.likes);
            });

            // Get followers
            let followersIds = this.user.followers;
            this.followers = [];
            followersIds.forEach(async (followerId) => {
                const followerRef = doc(db, "user", followerId);
                const followerSnap = await getDoc(followerRef);
                if (followerSnap.exists()) {
                    this.followers.push({id: followerSnap.id, ...followerSnap.data()});
                } else {
                    console.log("No such follower document!");
                }
            });

            // Get following
            const followingQuery = query(collection(db, 'user'), where('followers', 'array-contains', userId));
            const followingSnap = await getDocs(followingQuery);
            this.following = followingSnap.docs.map(doc => {return {id: doc.id, ...doc.data()};});
        },

        // Open modal
        openModal(type){
            this.modal = true;
            this.modalTitle = type;
        },

        // Follow/Unfollow user
        async toggleFollow() {
            const userRef = doc(db, 'user', this.userId);
            if (this.user.followers.includes(this.currentUser.uid)) {
                await updateDoc(userRef, {
                    followers: arrayRemove(this.currentUser.uid)
                });

            } else {
                await updateDoc(userRef, {
                    followers: arrayUnion(this.currentUser.uid)
                });
            }

            this.getProfileData();
        },

        // Like/Unlike readme
        async toggleLike(readme) {
            const readmeRef = doc(db, 'readme', readme.id);
            if (readme.likes.includes(this.currentUser.uid)) {
                await updateDoc(readmeRef, {
                    likes: arrayRemove(this.currentUser.uid)
                });
            } else {
                await updateDoc(readmeRef, {
                    likes: arrayUnion(this.currentUser.uid)
                });
            }
        },

        // Open readme
        openReadme(readme){
            this.$router.push({name: 'workbench', params: {id: readme.id}});
        }
    }
};
</script>


<style scoped>
    .readme-card {
        width: 15rem;
        height: 20rem;
    }

    .preview {
        height: 90%;
        overflow: hidden;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
    }

    .preview:hover {
        box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);
        cursor: pointer;
    }

    .content {
        height: 90%;
        transform: scale(0.30); 
        width: 333%;
        transform-origin: 0 0;
    }

    .content>>>* {
        max-width: 100%;
    }

    .username {
    font-size: 0.7rem;
    margin-top: -1rem;
    }

    .like {
    cursor: pointer;
    }

    .user-card:last-of-type{
        border-bottom: none!important;
    }

    .follow-icon {
        cursor: pointer;
    }
</style>
