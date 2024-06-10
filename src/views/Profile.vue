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
                    <div class="p-5">
                        <div class="profile-info d-flex align-items-center px-5">
                            <div class="w-25 profile-image-container">
                                <img v-if="user.photoURL" :src="user.photoURL" class="profile-image rounded-circle" />
                                <img v-else src="img/theme/team-4-800x800.jpg" class="profile-image rounded-circle" />
                            </div>
                            <div class="w-75 d-flex flex-column align-items-start">
                                <div class="profile-name w-100 d-flex flex-row justify-content-between align-items-center">
                                    <div class="d-flex justify-content-between">
                                        <div class="d-flex flex-column align-items-start font-weight-bold">
                                            {{ user.fullName }}
                                            <span class="font-weight-light text-primary">@{{ user.username }}</span>
                                        </div>

                                        <div class="profile-actions-mobile">
                                            <div v-if="currentUser && user.id != currentUser.uid">
                                                <base-button v-if="!user.followers || !user.followers.includes(currentUser.uid)" class="follow-button" type="primary" icon="fa fa-user-plus" @click="toggleFollow(user)"><span class="profile-button-text">Follow</span></base-button>
                                                <base-button v-else outline type="primary" icon="fa fa-user-times" class="follow-button" @click="toggleFollow(user)"><span class="profile-button-text">Unfollow</span></base-button>
                                            </div>
                                            <div v-else>
                                                <base-button type="primary" icon="fa fa-pencil" class="follow-button" @click="openModal('Edit Profile')"><span class="profile-button-text">Edit</span></base-button>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="card-profile-stats d-flex justify-content-center">
                                        <div @click="openModal('Followers')" class="stat">
                                            <span class="heading">{{ followers.length }}</span>
                                            <span class="description">Followers</span>
                                        </div>

                                        <div @click="openModal('Following')" class="stat">
                                            <span class="heading">{{ following.length }}</span>
                                            <span class="description">Following</span>
                                        </div>
                                    </div>

                                    <div class="profile-actions">
                                        <div v-if="currentUser && user.id != currentUser.uid">
                                            <base-button v-if="!user.followers || !user.followers.includes(currentUser.uid)" class="follow-button" type="primary" icon="fa fa-user-plus" @click="toggleFollow(user)">Follow</base-button>
                                            <base-button v-else outline type="primary" icon="fa fa-user-times" class="follow-button" @click="toggleFollow(user)">Unfollow</base-button>
                                        </div>
                                        <div v-else>
                                            <base-button type="primary" icon="fa fa-pencil" class="follow-button" @click="openModal('Edit Profile')">Edit</base-button>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div class="font-weight-bold mb-3">{{ user.jobTitle }}<span class="font-weight-light" v-if="user.location">, <i class="fa fa-map-marker ml-2"></i> {{ user.location }}</span></div>
                                    <div class="description text-justify">{{ user.description }}</div>
                                </div>
                            </div>
                        </div>

                        <div class="mt-5 py-5 border-top">
                            <div class="readme-toggle d-flex mb-5 pl-5">
                                <div @click="likedReadmes=false" :class="[{'font-weight-bold' : !likedReadmes}, {'font-weight-light' : likedReadmes}]">
                                    {{ readmes.length }} Readmes
                                </div> 

                                <div @click="likedReadmes=true" :class="['ml-4', {'font-weight-bold' : likedReadmes}, {'font-weight-light' : !likedReadmes}]">
                                    {{ likes.length }} Liked
                                </div>
                            </div>  

                            <div v-if="!likedReadmes" class="d-flex flex-wrap justify-content-center">
                                <div v-for="readme in readmes" :key="readme.id" class="readme-card m-4 d-flex flex-column justify-content-center">
                                    <div class="preview w-100 mb-3 p-4 rounded" @click="openReadmeModal(readme)">
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
                                    <div class="preview w-100 mb-3 p-4 rounded" @click="openReadmeModal(readme)">
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
            <div v-if="modalTitle === 'Edit Profile'" class="container">
                <form @submit.prevent="updateProfile">
                    <div class="image-form w-100 d-flex justify-content-center mb-4 position-relative">
                        <div class="position-relative">
                            <div>
                                <img v-if="form.photoURL" :src="form.photoURL" class="form-image rounded-circle" />
                                <img v-else src="img/theme/team-4-800x800.jpg" class="form-image rounded-circle" />
                            </div>
                            <i class="fa fa-camera text-white position-absolute" style="top: 0.5rem; right: 0.5rem; background-color: #00000080; padding: 5px; border-radius: 50%; cursor: pointer;"></i>
                        </div>
                        <input type="file" class="image-input position-absolute rounded-circle" @change="onImageChange">
                    </div>
                    <div class="form-group">
                        <label for="fullName">Full Name</label>
                        <input type="text" class="form-control" id="fullName" v-model="form.fullName" :placeholder="form.fullName">
                    </div>
                    <div class="form-group">
                        <label for="username">Username</label>
                        <input type="text" class="form-control" id="username" v-model="form.username" :placeholder="form.username">
                    </div>
                    <div class="form-group">
                        <label for="location">Location</label>
                        <input type="text" class="form-control" id="location" v-model="form.location">
                    </div>
                    <div class="form-group">
                        <label for="jobTitle">Job Title</label>
                        <input type="text" class="form-control" id="jobTitle" v-model="form.jobTitle">
                    </div>
                    <div class="form-group">
                        <label for="description">Description</label>
                        <textarea class="form-control" id="description" rows="3" v-model="form.description"></textarea>
                    </div>
                </form>
            </div>
            <div class="container d-flex flex-column" v-if="modalTitle=='Followers' || modalTitle=='Following'">
                <div class="user-card border-bottom py-4" v-for="user in users" :key="user.id">
                    <div class="d-flex align-items-center justify-content-between">
                        <div @click="openUser(user.id)" class="user-info d-flex align-items-center">
                            <img :src="user.photoURL" class="rounded-circle" width="50" height="50" />
                            <div class="d-flex flex-column ml-4">
                                <span class="text-default">{{ user.fullName }}</span>
                                <small class="text-primary">@{{ user.username }}</small>
                            </div>
                        </div>

                        <div v-if="user.id != currentUser.uid">
                            <i v-if="!user.followers || !user.followers.includes(currentUser.uid)" class="follow-icon fa fa-user-plus bg-primary text-white p-2 rounded" @click="toggleFollow(user)"></i>
                            <i v-else class="follow-icon fa fa-user-times text-primary border border-primary p-2 rounded" @click="toggleFollow(user)"></i>
                        </div>
                    </div>
                </div>
            </div>
            <template slot="footer">
                <base-button v-if="modalTitle === 'Edit Profile'" type="primary" @click="updateProfile">Save changes</base-button>
                <base-button type="link" class="ml-auto" @click="modal = false">Close</base-button>
            </template>
        </modal>
        <modal :show.sync="readmeModal" class="readme-modal" modal-classes="modal-dialog-centered modal-lg">
            <h6 slot="header" class="modal-title" id="modal-title-default">{{ selectedReadme.title }}</h6>
            <div class="container">
                <div class="row">
                    <div class="col-lg-7">
                        <div class="preview w-100 mb-3 p-4 rounded">
                            <div class="content" v-html="selectedReadme.preview"></div>
                        </div>
                    </div>
                    <div class="col-lg-5 d-flex flex-column align-items-start">
                        <div v-if="currentUser && selectedReadme.user != currentUser.uid" class="w-100 d-flex flex-column">
                            <base-button v-if="selectedReadme.public" class="w-100" type="primary" @click="openReadme(selectedReadme)" icon="fa fa-pencil-square-o">Use this template</base-button>

                            <div v-if="selectedReadme.type != 'template'" class="d-flex align-items-center justify-content-between mt-4">
                                <div @click="openUser(selectedReadme.user)" class="user-info d-flex align-items-center">
                                    <img :src="selectedReadme.photoURL" class="rounded-circle" width="50" height="50" />
                                    <div class="d-flex flex-column ml-4">
                                        <span class="text-default">{{ selectedReadme.fullName }}</span>
                                        <small class="text-primary">@{{ selectedReadme.userName }}</small>
                                    </div>
                                </div>

                                <div v-if="selectedReadme.user != currentUser.uid">
                                    <i v-if="!selectedReadme.followers || !selectedReadme.followers.includes(currentUser.uid)" class="follow-icon fa fa-user-plus bg-primary text-white p-2 rounded" @click="toggleFollow({uid: selectedReadme.user, followers:selectedReadme.followers})"></i>
                                    <i v-else class="follow-icon fa fa-user-times text-primary border border-primary p-2 rounded" @click="toggleFollow({uid: selectedReadme.user, followers:selectedReadme.followers})"></i>
                                </div>
                            </div>

                            <span v-else class="text-default">{{ selectedReadme.fullName }}</span>
                        </div>

                        <div v-else class="w-100">
                            <div class="d-flex">
                                <base-button class="w-50" type="primary" @click="openReadme(selectedReadme)" icon="fa fa-pencil">Edit</base-button>
                                <base-button class="w-50" type="danger" @click="openReadme(selectedReadme)" icon="fa fa-trash">Delete</base-button>
                            </div>                            
                        </div>

                        <p v-if="selectedReadme.description"  class="readme-description w-100 mt-3">{{ selectedReadme.description }}</p>
                    </div>
                </div>
            </div>
            <template slot="footer">
                <span class="like ml-4" v-if="selectedReadme.likes" @click="toggleLike(selectedReadme)"><i :class="['fa text-primary', selectedReadme.likes && selectedReadme.likes.includes(currentUser ? currentUser.uid : '') ? 'fa-heart' : 'fa-heart-o']"></i> {{ selectedReadme.likes.length }} Likes</span>
                <base-button type="link" class="ml-auto" @click="readmeModal = false">Close</base-button>
            </template>
        </modal>
    </div>
</template>

<script>
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from '../../firebase';
import { doc, getDoc, query, collection, where, getDocs, updateDoc, arrayRemove, arrayUnion, onSnapshot  } from "firebase/firestore";
import Modal from "@/components/Modal.vue";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

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
            readmeModal: false,
            selectedReadme: {},
            modal: false,
            modalTitle: '',
            likedReadmes: false,
            form: {
                photoURL: '',
                fullName: '',
                username: '',
                location: '',
                jobTitle: '',
                description: ''
            }
        };
    },

    mounted() {   
        this.getProfileData();

        this.openSection();
    },

    watch: {
        '$route.params.id': 'getProfileData',
        '$route.params.section': 'openSection'
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

        // Open section
        openSection(){
            if (this.$route.params.section) {
                if (this.$route.params.section == 'following') {
                    this.openModal('Following');
                } else if (this.$route.params.section == 'liked') {
                    this.likedReadmes = true;
                } 
            } else {
                this.likedReadmes = false;
            }
        },
        
        // Get followers, following, likes and readmes count
        async updateCounts(userId){
            // Get readMes
            const readmesQuery = query(collection(db, 'readme'), where('user', '==', userId));
            onSnapshot(readmesQuery, async (snapshot) => {
            const readmesData = await Promise.all(snapshot.docs.map(async (docSnap) => {
                const data = docSnap.data();
                let userDoc='';
                let userData = '';
                if (data.user) {
                    userDoc = await getDoc(doc(db, 'user', data.user));
                    userData = userDoc.data();
                }

                return {
                    id: docSnap.id,
                    title: data.title,
                    preview: data.content,
                    likes: data.likes || [],
                    user: data.user,
                    userName: userData.username ? userData.username : 'ReadMEasy Templates',
                    photoURL: userData.photoURL ? userData.photoURL : '',
                    fullName: userData.fullName ? userData.fullName : 'ReadMEasy Templates',
                    followers: userData.followers ? userData.followers : [],
                    description: data.description,
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
                let userData = '';
                if (data.user) {
                    userDoc = await getDoc(doc(db, 'user', data.user));
                    userData = userDoc.data();
                }

                return {
                    id: docSnap.id,
                    title: data.title,
                    preview: data.content,
                    userName: userData.username ? userData.username : 'ReadMEasy Templates',
                    photoURL: userData.photoURL ? userData.photoURL : '',
                    fullName: userData.fullName ? userData.fullName : 'ReadMEasy Templates',
                    followers: userDoc ? userData.followers : [],
                    description: data.description,
                    user: data.user,
                    likes: data.likes || [],
                    public: data.public ? data.public : true,
                };
            }));
            this.likes = readmesData;
            });

            // Get followers
            let followersIds = this.user.followers ? this.user.followers : [];
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

            if (this.modalTitle === 'Edit Profile') {
                this.form = {
                    photoURL: this.user.photoURL,
                    fullName: this.user.fullName,
                    username: this.user.username,
                    location: this.user.location ? this.user.location : '',
                    jobTitle: this.user.jobTitle ? this.user.jobTitle : '',
                    description: this.user.description ? this.user.description : ''
                };
            }
        },

        // Follow/Unfollow user
        async toggleFollow(user) {
            const userRef = doc(db, 'user', user.uid);
            if (user.followers.includes(this.currentUser.uid)) {
                await updateDoc(userRef, {
                    followers: arrayRemove(this.currentUser.uid)
                });

            } else {
                await updateDoc(userRef, {
                    followers: arrayUnion(this.currentUser.uid)
                });
            }

            this.getProfileData();

            if (this.readmeModal) {
                this.selectedReadme.followers.includes(this.currentUser.uid) ? this.selectedReadme.followers.splice(this.selectedReadme.followers.indexOf(this.currentUser.uid), 1) : this.selectedReadme.followers.push(this.currentUser.uid);
            }
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

            if (this.readmeModal) {
                this.selectedReadme.likes.includes(this.currentUser.uid) ? this.selectedReadme.likes.splice(this.selectedReadme.likes.indexOf(this.currentUser.uid), 1) : this.selectedReadme.likes.push(this.currentUser.uid);
            }
        },

        // Open readme modal
        openReadmeModal(readme){
            this.selectedReadme = readme;
            this.readmeModal = true;
        },

        // Open readme
        openReadme(readme){
            document.body.classList.remove('modal-open');
            this.$router.push({name: 'workbench', params: {id: readme.id}});
        },

        // Open user profile
        openUser(uid){
            document.body.classList.remove('modal-open');
            if (uid === this.currentUser.uid) {
                this.$router.push({name: 'profile', params: {id: 'MyProfile'}});
            } else {
                this.$router.push({name: 'profile', params: {id: uid}});
            }
        },

        // Update user profile
        async updateProfile() {
            // Get the file from the input element
            let file = document.querySelector('.image-input').files[0];

            if (file) {
                // Create a storage reference
                const storage = getStorage();
                const storageRef = ref(storage, 'images/' + file.name);

                // Upload the file to Firebase Storage
                await uploadBytes(storageRef, file);

                // Get the download URL of the uploaded file
                const downloadURL = await getDownloadURL(storageRef);

                // Save the link to the section
                this.form.photoURL = downloadURL;
            }

            // Update user profile
            const userRef = doc(db, 'user', this.currentUser.uid);
            await updateDoc(userRef, {
                photoURL: this.form.photoURL,
                fullName: this.form.fullName ? this.form.fullName : this.user.fullName,
                username: this.form.username ? this.form.username : this.user.username,
                location: this.form.location,
                jobTitle: this.form.jobTitle,
                description: this.form.description
            });
            this.modal = false;
            this.getProfileData();
        },

        // Handle image change
        onImageChange(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.form.photoURL = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        },
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

    .modal-dialog .preview {
        height: 50vh;
        overflow-y: auto;
        scrollbar-color: var(--info) transparent;
        scrollbar-width: thin;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
    }

    .modal-dialog .content {
        transform: scale(0.70); 
        width: 143%;
        transform-origin: 0 0;
    }

    .content>>>* {
        max-width: 100%;
    }

    .stat:hover {
        cursor: pointer;
        color: black;
    }
    
    .user-info:hover {
        cursor: pointer;
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

    .follow-icon:hover {
        cursor: pointer;
    }

    .description{
        white-space: pre-line;
    }

    .readme-description{
        white-space: pre-line;
        word-wrap: break-word;
        overflow-wrap: break-word;
    }

    .image-input {
        opacity: 0;
    }

    .image-input:hover {
        cursor: pointer;
    }

    .form-image, .image-input, .profile-image {
        width: 10rem;
        height: 10rem;
        object-fit: cover;
    }
    
    .readme-toggle div:hover {
        cursor: pointer;
    }

    .profile-actions-mobile {
        display: none;
    }

    @media screen and (max-width: 991.5px) {
        .profile-info {
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 0!important;
            margin-top: -10rem;
        }

        .profile-info>div, .profile-name {
            width: 100% !important;
            display: flex;
            flex-direction: column !important;
            align-items: center !important;
            margin-bottom: 1rem;
        }

        .profile-name>div:first-child {
            width: 100% ;
            margin-top: 2rem;
        }

        .profile-actions {
            display: none;
        }

        .profile-actions-mobile {
            display: block;
        }

        .readme-toggle {
            padding-left: 0 !important;
            width: 100%;
            justify-content: center;
        }

        .profile-actions-mobile button{
            padding: 1rem!important;
        }

        .profile-actions-mobile>>>.btn-inner--text {
            display: none;
        }
    }
</style>
