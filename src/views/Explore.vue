<template>
    <section class="section section-shaped section-lg my-0">
      <div class="shape shape-style-1 bg-gradient-white"></div>
      <div class="header bg-gradient-primary text-white position-relative w-100">
        <div class="container d-flex flex-column align-items-center">
          <base-input alternative class="search-bar mt-5 w-100" v-model="searchQuery" placeholder="Search..."  addon-right-icon="fa fa-search"></base-input>
          <div class="toggle-container d-flex align-items-center justify-content-between">
            <div id="templates" :class="['toggle-item', { active: activeSection === 'templates' }]" @click="setActiveSection('templates')"><i class="ni ni-single-copy-04"></i>Templates</div>
            <div id="readmes" :class="['toggle-item', { active: activeSection === 'readmes' }]" @click="setActiveSection('readmes')"><i class="ni ni-spaceship"></i>Readmes</div>
            <div id="users" :class="['toggle-item', { active: activeSection === 'users' }]" @click="setActiveSection('users')"><i class="fa fa-users"></i>Users</div>
          </div>
          <div class="triangle" :style="{ left: trianglePosition }"></div>
        </div>
      </div>
      <div class="container pt-lg-md d-flex flex-wrap justify-content-center" v-if="activeSection=='readmes' || activeSection=='templates'">
        <div v-for="readme in search" :key="readme.id" class="readme-card d-flex flex-column justify-content-center" v-if="readme.user !=  currentUser.uid">
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
      <div class="container d-flex flex-column" v-if="activeSection=='users'">
        <div class="user-card border-bottom py-4" v-for="user in search" :key="user.id" v-if="user.uid != currentUser.uid">
            <div class="d-flex align-items-center justify-content-between">
                <router-link :to="{name:'profile', params:{id:user.uid}}" class="user-info d-flex align-items-center">
                    <img :src="user.photoURL" class="rounded-circle" width="50" height="50" />
                    <div class="d-flex flex-column ml-4">
                        <span class="text-default">{{ user.fullName }}</span>
                        <small class="text-primary">@{{ user.username }}</small>
                    </div>
                </router-link>

                <div class="d-flex align-items-center">                       
                    <i class="fa fa-users followers mr-2"></i>
                    {{ user.followers ? user.followers.length : 0 }} 
                </div>
                
                <div class="d-flex align-items-center">                       
                    <i class="ni ni-spaceship readmes mr-2"></i>
                    {{ user.readmes ? user.readmes : 0 }} 
                </div>
                
                <base-button v-if="!user.followers || !user.followers.includes(currentUser.uid)" class="follow-button" type="primary" icon="fa fa-user-plus" @click="toggleFollow(user)">Follow</base-button>
                <base-button v-else outline type="primary" icon="fa fa-user-times" class="follow-button" @click="toggleFollow(user)">Unfollow</base-button>

                <i v-if="!user.followers || !user.followers.includes(currentUser.uid)" class="follow-icon fa fa-user-plus bg-primary text-white p-2 rounded" @click="toggleFollow(user)"></i>
                <i v-else class="follow-icon fa fa-user-times text-primary border border-primary p-2 rounded" @click="toggleFollow(user)"></i>
            </div>
        </div>
      </div>
    </section>
  </template>
  
  
  
<script> 
import { db } from '../../firebase';
import { collection, doc, updateDoc, arrayUnion, arrayRemove, onSnapshot, getDoc, query, where, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export default {
  data() {
    return {
      readmes: [],
      currentUser: null,
      searchQuery: '',
      activeSection: 'readmes',
      users: []
    };
  },
  computed: {
    search() {
      if (this.searchQuery) {
        if (this.activeSection === 'readmes') {
            return this.readmes.filter(readme => readme.title.toLowerCase().includes(this.searchQuery.toLowerCase()) && readme.type === 'readme');
        } else if (this.activeSection === 'templates') {
            return this.readmes.filter(readme => readme.title.toLowerCase().includes(this.searchQuery.toLowerCase()) && readme.type === 'template');
        } else if (this.activeSection === 'users') {
            return this.users.filter(user => user.fullName.toLowerCase().includes(this.searchQuery.toLowerCase()) || user.username.toLowerCase().includes(this.searchQuery.toLowerCase()));
        }
      }
      if (this.activeSection === 'readmes') {
        return this.readmes.filter(readme => readme.type === 'readme');
      } else if (this.activeSection === 'templates') {
        return this.readmes.filter(readme => readme.type === 'template');
      } else if (this.activeSection === 'users') {
        return this.users;
      }
    },
    trianglePosition() {
        const activeItem = document.getElementById(this.activeSection);

        if (activeItem) {
            const activeItemRect = activeItem.getBoundingClientRect();
            const containerRect = activeItem.parentElement.getBoundingClientRect();
            const leftPosition = activeItemRect.left + activeItemRect.width / 2;
            return `${leftPosition}px`;
        }

        return '50%';
}
  },
  async mounted() {
    const auth = getAuth();
    auth.onAuthStateChanged(user => {
      if (user) {
        this.currentUser = user;
      }
    });

    const readmesRef = collection(db, 'readme');
    onSnapshot(readmesRef, async (snapshot) => {
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
          user: data.user,
          likes: data.likes || [],
          type: data.type ? 'template' : 'readme'
        };
      }));
      this.readmes = readmesData;

      if (this.$route.params.search) {
        this.searchQuery = this.$route.params.search;
      }
    });

    const usersRef = collection(db, 'user');
    onSnapshot(usersRef, async (snapshot) => {
        const usersData = await Promise.all(snapshot.docs.map(async (docSnap) => {
        const data = docSnap.data();
        const readmeQuery = query(collection(db, 'readme'), where('user', '==', docSnap.id));
        const readmeDocs = await getDocs(readmeQuery);
        const readmeCount = readmeDocs.size;
        return {
          uid: docSnap.id,
          fullName: data.fullName,
          username: data.username,
          photoURL: data.photoURL,
          followers: data.followers || [],
          readmes: readmeCount,
        };
      }));
      this.users = usersData;
    });
  },
  methods: {
    // Set active section
    setActiveSection(section) {
      this.activeSection = section;
    },
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

    // Follow or unfollow a user
    async toggleFollow(user) {
      const userRef = doc(db, 'user', user.uid);
      if (user.followers.includes(this.currentUser.uid)) {
        await updateDoc(userRef, {
          followers: arrayRemove(this.currentUser.uid)
        });
        user.followers = user.followers.filter(follower => follower !== this.currentUser.uid);
      } else {
        await updateDoc(userRef, {
          followers: arrayUnion(this.currentUser.uid)
        });
        user.followers.push(this.currentUser.uid);
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
.section-shaped {
  height: max-content!important;
}

.header {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1;
}

.container {
  display: flex;
  flex-wrap: wrap;
  gap: 3rem;
}

.toggle-container {
  position: relative;
  width: 100%;
  margin-top: -2rem;
}

.toggle-item {
  flex: 1;
  padding: 1rem;
  cursor: pointer;
  position: relative;
  transition: font-weight 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 0.8rem;
}

.toggle-item i{
    font-size: 1.5rem;
    border: 1px solid white;
    border-radius: 50%;
    padding: 1rem;
    width: max-content;
    margin-bottom: 0.5rem;
    transition: all 0.3s ease;
}

.active {
  font-weight: bold;
}

.active i{
    background-color: white;
    color: var(--primary);

}

.triangle {
  position: absolute;
  bottom: -1px;
  width: 0;
  height: 0;
  border-left: 1rem solid transparent;
  border-right: 1rem solid transparent;
  border-bottom: 1rem solid white;
  transition: left 0.3s ease;
  transform: translateX(-50%);
}

.readme-card {
  width: 19rem;
  height: 25rem;
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
  transform: scale(0.35); 
  width: 285%;
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

.follow-button {
    width: 10rem;
}

.follow-button.btn-outline-primary:hover {
    background-color: transparent;
    color: var(--primary);
}

.follow-icon {
    display: none;
    font-size: 1.2rem;
}

.followers, .readmes {
    font-size: 1.2rem;
}

@media screen and (max-width: 991.5px) {
  .header {
    margin-top: -2.5rem;
    margin-bottom: 2rem;
  }
    
  .follow-button {
    display: none;
  }

  .follow-icon {
    display: inherit;
  }
}
</style>
  