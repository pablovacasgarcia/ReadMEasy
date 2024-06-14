<template>
    <section class="section section-shaped section-lg my-0">
        <div class="shape shape-style-1 bg-white">
        </div>

        <!-- Content -->
        <div class="content container-fluid w-100 h-100 d-flex p-5 justify-content-center">

            <!-- My Sections -->
            <div id="sections">
                <h2 class="mb-5">My Sections</h2>

                <!-- Draggable Sections -->
                <draggable v-model="mySections" group="sections" class="list-unstyled section-list pr-1 w-100" v-bind="dragOptions" handle=".handle" @change="saveHistory">
                    <transition-group type="transition">
                        <li v-for="(section, index) in mySections" :id="`section_${index}`" :key="`section_${index}`" class="section-container w-100 mb-4 h-max-content d-flex align-items-center flex-column">
                            
                            <!-- Section Card -->
                            <div :class="['section-card', 'my-section', 'bg-white', 'p-4', 'rounded', 'd-flex', 'justify-content-between', 'align-items-center', 'display-5', 'position-relative', 'w-100', { 'section-card-active' : editing == section }]">
                                <div class="d-flex align-items-center position-relative w-100 handle">   
                                    <div class="d-flex ml-0"> 
                                        <i class="fa fa-arrows-v"></i>
                                    </div>
                                    
                                    <div class="section-title ml-1 w-100">
                                        {{ section.title }}
                                        <small class="ml-2 text-muted">{{ extractText(section.content) }}</small>
                                    </div>
                                    
                                </div> 
                                <div class="section-actions d-flex position-absolute">
                                    <i class="fa fa-pencil mr-2" @click="editSection(section)"></i>
                                    <i class="fa fa-trash" @click="deleteSection(index)"></i>
                                </div>
                            </div>

                            <!-- Editing Section -->
                            <p v-if="section.title == 'Social Links' && editing==section" class="m-2 px-4 text-justify socialLinks-label">Enter your username, or leave it empty so as not to use it</p>

                            <div id="section-input" v-if="editing==section">                     
                                <div v-for="(field, index) in fields" :key="index" class="d-flex align-items-center">
                                    <base-input 
                                        v-if="section.title != 'Code' && section.title != 'Text' && section.title != 'Image'" 
                                        alternative 
                                        class="field-input m-2" 
                                        v-model="field.textContent"
                                        :placeholder="section.title === 'Social Links' ? field.id : ''">
                                    </base-input>
                                    
                                    <div v-else-if="section.title === 'Image'" class="image-input-container m-2">
                                        <input type="file" @change="onImageChange" class="image-input" />
                                        <div class="image-placeholder" v-if="!imagePreview">
                                            <i class="fa fa-upload"></i>
                                        </div>
                                        <img v-show="imagePreview" :src="imageSrc" alt="Uploaded Image" class="image-preview" @error="()=>{ imagePreview = false }" @load="()=>{ imagePreview = true }"/>
                                    </div>  

                                    <textarea rows="4" v-else alternative class="form-control field-input m-2" v-model="field.textContent"></textarea>
                                    <base-button v-if="fields.length > 1 && section.title=='Unordered List' || section.title=='Ordered List'" type="danger" class="ml-1 p-1" @click="removeField(index)"><i class="ni ni-fat-delete"></i></base-button>
                                </div>

                                <div v-if="section.title=='Image'" class="d-flex flex-column w-100 align-items-center">
                                    <base-input alternative class="field-input m-2 w-50" v-model="imageWidth" placeholder="Image Width" type="number" min="0" max="100"></base-input>
                                </div>

                                <div v-else-if="section.title=='GitHub Stats'" class="ml-2">
                                    <base-checkbox v-model="githubStats.summary">Summary</base-checkbox>
                                    <base-checkbox v-model="githubStats.stats">Stats</base-checkbox>
                                    <base-checkbox v-model="githubStats.streak">Streak</base-checkbox>
                                    <base-checkbox v-model="githubStats.languages">Languages</base-checkbox>
                                    <base-checkbox v-model="githubStats.trophy">Trophies</base-checkbox>
                                </div>

                                <div v-else-if="section.title=='Skill Icons'">
                                    <base-input alternative type="text" v-model="searchQuery" @input="scrollToCheckbox" placeholder="Search Skill" />

                                    <div class="skillIcons-list m-2">
                                        <base-checkbox v-for="(icon, key) in skillIcons" :key="key" :id="key" v-model="skillIcons[key]">{{ key }}</base-checkbox>
                                    </div>
                                </div>

                                <base-input v-else-if="section.title==='Link'" class="field-input m-2" v-model="linkUrl" placeholder="URL link"></base-input>

                                <div v-else-if="section.title==='Repository Badges'" class="m-2">
                                    <base-checkbox v-for="(value, badge) in badges" :key="badge" v-model="badges[badge]" class="badges">{{ badge }}</base-checkbox>
                                </div>

                                <div class="d-flex align-items-center w-50 p-2 justify-content-center w-100">
                                    <base-button v-if="section.title=='Unordered List' || section.title=='Ordered List'" type="default" class="input-button" @click="addField(section)">Add</base-button>
                                    <base-button type="info" class="input-button" @click="saveSection(section)">Save</base-button>
                                    <base-button type="danger" class="input-button" @click="editSection(section)">Cancel</base-button>
                                </div>
                            </div>
                            
                            
                        </li>
                    </transition-group>
                </draggable>
            </div>

            <!-- Preview Container -->
            <div id="preview">
                <header class="d-flex w-100 justify-content-between alignn-items-center">
                    <h2 class="mb-5 title-toggle">
                        <!-- Preview / Code Toggle -->
                        <span id="previewTitle" @click="switchDisplay(0)">Preview</span>
                        <span id="codeTitle" @click="switchDisplay(1)" class="ml-3 unactive">Code</span>
                    </h2>

                    <!-- Buttons -->
                    <div class="buttons">
                        <base-button type="warning" @click="undo()"><i class="fa fa-undo"></i></base-button>     
                        <base-button type="info" @click="redo()"><i class="fa fa-repeat"></i></base-button>                   
                        <base-button type="success" @click="showTitleModal = true"><i class="fa fa-floppy-o"></i></base-button>
                        <base-button type="primary" @click="downloadReadme()"><i class="fa fa-download"></i></base-button>
                    </div>
                </header>

                <!-- Preview Display -->
                <div class="w-100 bg-white rounded preview-display p-5" id="preview-display"></div>

                <!-- Mobile Buttons -->
                <div class="buttons-mobile d-none justify-content-between mt-3">
                        <base-button type="warning" @click="undo()"><i class="fa fa-undo"></i></base-button>     
                        <base-button type="info" @click="redo()"><i class="fa fa-repeat"></i></base-button>                   
                        <base-button type="success" @click="showTitleModal = true"><i class="fa fa-floppy-o"></i></base-button>
                        <base-button type="primary" @click="downloadReadme()"><i class="fa fa-download"></i></base-button>
                    </div>
            </div>

            <!-- Sections to Add -->
            <div id="addSections">
                <h2 class="mb-5 title-toggle">
                    <!-- My Sections / Add Sections Toggle -->
                        <span id="mySectionsTitle" @click="switchSections(0)" class="unactive">My Sections</span>
                        <span id="addSectionsTitle" @click="switchSections(1)" class="ml-3">Add Sections</span>
                    </h2>

                <!-- Available Section List -->
                <ul id="add-sections-list" class="list-unstyled section-list pr-1">
                    <li class="section-card bg-white mb-4 p-4 rounded d-flex justify-content-between align-items-center display-5" v-for="section in sections" :key="section.id" @click="addSection(section)">
                        {{ section.title }} <i class="fa fa-plus"></i>
                    </li>
                </ul>

                <!-- Draggable mobile Sections -->
                <draggable id="mobile-sections-list" v-model="mySections" group="sections" class="d-none list-unstyled section-list" v-bind="dragOptions" handle=".handle" @change="saveHistory">
                    <transition-group type="transition">
                        <li v-for="(section, index) in mySections" :id="`section_${index}`" :key="`section_${index}`" class="section-container w-100 mb-4 h-max-content d-flex align-items-center flex-column">
                            
                            <!-- Section Card -->
                            <div :class="['section-card', 'my-section', 'bg-white', 'p-4', 'rounded', 'd-flex', 'justify-content-between', 'align-items-center', 'display-5', 'position-relative', 'w-100', { 'section-card-active' : editing == section }]">
                                <div class="d-flex align-items-center position-relative w-100 handle">   
                                    <div class="d-flex"> 
                                        <i class="fa fa-arrows-v"></i>
                                    </div>
                                    
                                    <div class="section-title ml-1 w-100">
                                        {{ section.title }}
                                        <small class="ml-2 text-muted">{{ extractText(section.content) }}</small>
                                    </div>
                                    
                                </div> 
                                <div class="section-actions position-absolute">
                                    <i class="fa fa-pencil mr-3" @click="editSection(section)"></i>
                                    <i class="fa fa-trash" @click="deleteSection(index)"></i>
                                </div>
                            </div>

                            <!-- Editing Section -->
                            <p v-if="section.title == 'Social Links' && editing == section" class="m-2 px-4 text-justify socialLinks-label">Enter your username, or leave it empty so as not to use it</p>

                            <div id="section-input" v-if="editing==section">
                                <div v-for="(field, index) in fields" :key="index" class="d-flex align-items-center">
                                    <base-input 
                                        v-if="section.title != 'Code' && section.title != 'Text' && section.title != 'Image'" 
                                        alternative 
                                        class="field-input m-2" 
                                        v-model="field.textContent"
                                        :placeholder="section.title === 'Social Links' ? field.id : ''">
                                    </base-input>

                                    <div v-else-if="section.title === 'Image'" class="image-input-container m-2">
                                        <input type="file" @change="onImageChange" class="image-input-mobile" />
                                        <div class="image-placeholder" v-if="!imagePreview">
                                            <i class="fa fa-upload"></i>
                                        </div>
                                        <img v-show="imagePreview" :src="imageSrc" alt="Uploaded Image" class="image-preview-mobile" @error="()=>{ imagePreview = false }" @load="()=>{ imagePreview = true }"/>
                                    </div>  

                                    <textarea rows="4" v-else alternative class="form-control field-input m-2" v-model="field.textContent"></textarea>
                                    <base-button v-if="fields.length > 1 && section.title=='Unordered List' || section.title=='Ordered List'" type="danger" class="ml-1 p-1" @click="removeField(index)"><i class="ni ni-fat-delete"></i></base-button>
                                </div>

                                <div v-if="section.title=='Image'" class="d-flex flex-column w-100 align-items-center">
                                    <base-input alternative class="field-input m-2 w-50" v-model="imageWidth" placeholder="Image Width" type="number" min="0" max="100"></base-input>
                                </div>

                                <div v-else-if="section.title=='GitHub Stats'" class="ml-2">
                                    <base-checkbox v-model="githubStats.summary">Summary</base-checkbox>
                                    <base-checkbox v-model="githubStats.stats">Stats</base-checkbox>
                                    <base-checkbox v-model="githubStats.streak">Streak</base-checkbox>
                                    <base-checkbox v-model="githubStats.languages">Languages</base-checkbox>
                                    <base-checkbox v-model="githubStats.trophy">Trophies</base-checkbox>
                                </div>

                                <div v-else-if="section.title=='Skill Icons'">
                                    <base-input alternative type="text" v-model="searchQuery" @input="scrollToCheckbox" placeholder="Search Skill" />

                                    <div class="skillIcons-list m-2">
                                        <base-checkbox v-for="(icon, key) in skillIcons" :key="key" :id="key+'-mobile'" v-model="skillIcons[key]">{{ key }}</base-checkbox>
                                    </div>
                                </div>

                                <base-input v-else-if="section.title==='Link'" class="field-input m-2" v-model="linkUrl" placeholder="URL link"></base-input>

                                <div v-else-if="section.title==='Repository Badges'" class="m-2">
                                    <base-checkbox v-for="(value, badge) in badges" :key="badge" v-model="badges[badge]" class="badges">{{ badge }}</base-checkbox>
                                </div>

                                <div class="d-flex align-items-center w-50 p-2 justify-content-center w-100">
                                    <base-button v-if="section.title=='Unordered List' || section.title=='Ordered List'" type="default" class="input-button" @click="addField(section)">Add</base-button>
                                    <base-button type="info" class="input-button" @click="saveSection(section)">Save</base-button>
                                    <base-button type="danger" class="input-button" @click="editSection(section)">Cancel</base-button>
                                </div>
                            </div>
                            
                            
                        </li>
                    </transition-group>
                </draggable>
            </div>
        </div>
        
        <modal :show.sync="showTitleModal">
            <template slot="header">
                <h5 class="modal-title" id="exampleModalLabel">Save ReadME</h5>
            </template>
            <div class="p-2">
                <base-input class="field-input" v-model="readmeTitle" placeholder="ReadMe Title"></base-input>
                <textarea class="form-control" v-model="readmeDescription" placeholder="ReadMe Description"></textarea>
                <base-checkbox class="mt-3" v-model="readmePublic">Allow Usage</base-checkbox>
            </div>
            <template slot="footer">
                <base-button type="secondary" @click="showTitleModal = false">Close</base-button>
                <base-button type="primary" @click="saveReadme">Save changes</base-button>
            </template>
        </modal>
    </section>
</template>

<script>
import { db } from '../../firebase';
import { collection, onSnapshot, addDoc, doc, setDoc, getDoc } from 'firebase/firestore';
import draggable from 'vuedraggable';
import TurndownService from 'turndown';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Modal from "@/components/Modal.vue";

export default {
    name: "workbench",
    components: {
        draggable,
        Modal
    },

    watch: {
        '$route.params.id': 'loadReadme',
        'mySections': {
            handler: function() {
                this.loadPreview();
            },
            deep: true
        }
    },

    props: {
        sectionsProp: {
            type: String,
            required: false
        }
    },

    data() {
        return {
            title: "Workbench",
            sections: [],
            mySections: [],
            code: false,
            turndownService: new TurndownService({ headingStyle: 'atx'}),
            editing: false,
            fields: [],
            linkUrl: '',
            user: null,
            githubStats: { summary: true, stats: true, streak: true, languages: true, trophy: true },
            imageWidth: 50,
            imagePreview: false,
            showTitleModal: false,
            readmeTitle: '',
            readmeUser: '',
            readmeDescription: '',
            readmePublic: true,
            skillIcons: { ableton: false, activitypub: false, actix: false, adonis: false, ae: false, aiscript: false,
                alpinejs: false, anaconda: false, androidstudio: false, angular: false, ansible: false,
                apollo: false, apple: false, appwrite: false, arch: false, arduino: false, astro: false,
                atom: false, au: false, autocad: false, aws: false, azul: false, azure: false, babel: false,
                bash: false, bevy: false, bitbucket: false, blender: false, bootstrap: false, bsd: false,
                bun: false, c: false, cs: false, cpp: false, crystal: false, cassandra: false, clion: false,
                clojure: false, cloudflare: false, cmake: false, codepen: false, coffeescript: false, css: true,
                cypress: false, d3: false, dart: false, debian: false, deno: false, devto: false, discord: false,
                discordbots: false, discordjs: false, django: false, docker: true, dotnet: false, dynamodb: false,
                eclipse: false, elasticsearch: false, electron: false, elixir: false, elysia: false, emacs: false,
                ember: false, emotion: false, express: false, fastapi: false, fediverse: false, figma: false,
                firebase: false, flask: false, flutter: false, forth: false, fortran: false, gamemakerstudio: false,
                gatsby: false, gcp: false, git: true, github: true, githubactions: false, gitlab: false, gmail: false,
                gherkin: false, go: false, gradle: false, godot: false, grafana: false, graphql: false, gtk: false,
                gulp: false, haskell: false, haxe: false, haxeflixel: false, heroku: false, hibernate: false, html: true,
                htmx: false, idea: false, ai: false, instagram: false, ipfs: false, java: true, js: true, jenkins: false,
                jest: false, jquery: false, kafka: false, kali: false, kotlin: false, ktor: false, kubernetes: true,
                laravel: false, latex: false, less: false, linkedin: false, linux: false, lit: false, lua: false, md: false,
                mastodon: false, materialui: false, matlab: false, maven: false, mint: false, misskey: false, mongodb: false,
                mysql: false, neovim: false, nestjs: false, netlify: false, nextjs: false, nginx: false, nim: false, nix: false,
                nodejs: true, notion: false, npm: false, nuxtjs: false, obsidian: false, ocaml: false, octave: false,
                opencv: false, openshift: false, openstack: false, p5js: false, perl: false, ps: false, php: false, phpstorm: false,
                pinia: false, pkl: false, plan9: false, planetscale: false, pnpm: false, postgres: false, postman: false,
                powershell: false, pr: false, prisma: false, processing: false, prometheus: false, pug: false, pycharm: false,
                py: false, pytorch: false, qt: false, r: false, rabbitmq: false, rails: false, raspberrypi: false, react: true,
                redux: false, regex: false, remix: false, replit: false, rider: false, robloxstudio: false, rocket: false,
                rollupjs: false, ros: false, ruby: false, rust: false, sass: false, spring: false, sqlite: false,
                stackoverflow: false, styledcomponents: false, sublime: false, supabase: false, scala: false, sklearn: false,
                selenium: false, sentry: false, sequelize: false, sketchup: false, solidity: false, solidjs: false, svelte: false,
                svg: false, swift: false, symfony: false, tailwind: false, tauri: false, tensorflow: false, terraform: false,
                threejs: false, twitter: false, ts: true, ubuntu: false, unity: false, unreal: false, v: false, vala: false,
                vercel: false, vim: false, visualstudio: true, vite: false, vitest: false, vscode: true, vscodium: false,
                vue: true, vuetify: false, wasm: false, webflow: false, webpack: false, webstorm: false, windicss: false,
                windows: false, wordpress: false, workers: false, xd: false, yarn: false, yew: false, zig: false
            },
            badges: { license:false, size:false, release:false, tag:false, commits:false, lastCommit:false, downloads:false, forks:false, stars:false, watchers:false, contributors:false, issues:false, pullRequests:false},
            readmeId: '',
            history: [],
            historyIndex: -1,
            searchQuery: '',
        };
    },

    mounted() {
        const auth = getAuth();
        onAuthStateChanged(auth, user => {
            this.user = user;
        });

        // Event Listener for undo and redo
        window.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'z') {
                this.undo();
            } else if (e.ctrlKey && e.key === 'y') {
                this.redo();
            }
        });

        if (this.sectionsProp) {
            this.mySections = JSON.parse(this.sectionsProp);
        }
    },

    created() {
        // Load default sections from Firestore
        const sectionsRef = collection(db, 'section');
        onSnapshot(sectionsRef, (snapshot) => {
            this.sections = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        });

        // Load Readme if exists
        this.loadReadme();
    },

    methods: {
        // Add a section to the workbench
        addSection(section) {
            this.mySections.push({ title: section.title, content: section.content });
            this.saveHistory();

            // Switch to the mySections view on mobile
            if (window.innerWidth < 991.5) {
                this.switchSections(0);
            } 
        },

        // Delete a section from the workbench
        deleteSection(index) {
            if (index !== -1) {
                this.mySections.splice(index, 1);
            }
            this.saveHistory();
        },

        // Load the readME preview
        loadPreview() {
            if (document.getElementById('preview-display')) {
                document.getElementById('preview-display').innerHTML = "";

                // Convert to markdown if code is selected
                if (this.code) {
                    let markdown = this.getMarkdown();                    

                    document.getElementById('preview-display').innerHTML = '<code class="w-100 h-100 text-break">' + this.escapeHtml(markdown) + '</code>';

                } else {
                    document.getElementById('preview-display').innerHTML = this.getHtml();
                }
            }            
        },

        getHtml() {
            let html = "";

            // Display the content as HTML
            for (let section of this.mySections) {
                if (section.title == 'GitHub Stats') {
                    // Display the github stats
                    html += this.extractStats(section.content);
                } else if (section.title === 'Code' || section.title === 'Command') {
                    // Display the code or text
                    html += '<pre>' + section.content + '</pre>';
                } else if (section.title === 'Image') {
                    // Display the image
                    html += '<p align="center">' + this.extractImg(section.content) + '</p>';
                } else if (section.title === 'Skill Icons'){
                    // Display the skill icons
                    html += '<p align="center"><img src="https://skillicons.dev/icons?i='+ this.extractText(section.content) +'" /></p>';
                } else if (section.title === 'Repository Badges'){
                    // Display the repository badges
                    html += '<p align="center">' + this.extractBadges(section.content) + '</p>';
                } else if (section.title === 'Social Links') {
                    // Display the social links
                    html += '<p align="center">' + this.extractSocialLinks(section.content) + '</p>';
                } else {
                    // Display the content
                    html += section.content;
                }
            }

            return html;
        },

        getMarkdown() {
            let markdown = "";

            for (let section of this.mySections) {

                // Switch for changing the content to markdown
                switch (section.title) {
                    case 'Code':
                        markdown += '```python\n' + this.extractText(section.content) + '\n```' + '\n\n';
                        break;
                    case 'Command':
                        markdown += '```bash\n' + this.extractText(section.content) + '\n```' + '\n\n';
                        break; 
                    case 'Link':
                        markdown += '[' + this.extractText(section.content) + '](' + this.extractLink(section.content) + ')' + '\n\n';
                        break;
                    case 'Table':
                        markdown += this.turndownService.turndown(section.content) + '\n\n';
                        break;
                    case 'GitHub Stats':
                        markdown += '<div align="center">\n' + this.extractStats(section.content) + '\n</div>\n\n';
                        break;
                    case 'Image':
                        markdown += '<div align="center">\n' + this.extractImg(section.content) + '\n</div>\n\n';
                        break;
                    case 'Skill Icons':
                        markdown += '<div align="center">\n' + '<img src="https://skillicons.dev/icons?i='+ this.extractText(section.content) +'" />' + '\n</div>\n\n';
                        break;
                    case 'Repository Badges':
                        markdown += '<div align="center">\n' + this.extractBadges(section.content) + '\n</div>\n\n';
                        break;
                    case 'Social Links':
                        markdown += '<div align="center">\n' + this.extractSocialLinks(section.content) + '\n</div>\n\n';
                        break;
                    default:
                        markdown += this.turndownService.turndown(section.content) + '\n\n';
                        break;
                    }         
            }

            return markdown;
        },

        // Escape HTML characters
        escapeHtml(html) {
            return html
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
        },

        // Switch between preview and code display
        switchDisplay(toggle) {
            if (toggle) {
                document.getElementById('previewTitle').classList.add('unactive');
                document.getElementById('codeTitle').classList.remove('unactive');
                this.code = true;
            } else {
                document.getElementById('previewTitle').classList.remove('unactive');
                document.getElementById('codeTitle').classList.add('unactive');
                this.code = false;
            }

            this.loadPreview();
        },

        // Switch between mySections and addSections
        switchSections(toggle) {
            if (toggle) {              
                document.getElementById('mySectionsTitle').classList.add('unactive');
                document.getElementById('addSectionsTitle').classList.remove('unactive');                  
                document.getElementById('mobile-sections-list').classList.add('d-none');
                document.getElementById('add-sections-list').classList.remove('d-none');             
            } else {
                document.getElementById('mySectionsTitle').classList.remove('unactive');
                document.getElementById('addSectionsTitle').classList.add('unactive'); 
                document.getElementById('mobile-sections-list').classList.remove('d-none');                
                document.getElementById('add-sections-list').classList.add('d-none');  
            }
        },

        // Display the section input for editing
        editSection(section) {
            if (this.editing == section) {
                this.editing = false;
            } else {
                this.editing = section;

                // Get the fields for the section
                let tempDiv = document.createElement('div');
                tempDiv.innerHTML = section.content;

                // Get the link URL
                if (section.title === 'Link') {
                    let link = tempDiv.querySelector('a');
                    if (link) {
                        this.linkUrl = link.getAttribute('href');
                    }
                } else if (section.title === 'GitHub Stats') {
                    // Get the attributes for github stats                    
                    this.githubStats.stats = tempDiv.querySelector('p').getAttribute('stats') === 'true';
                    this.githubStats.streak = tempDiv.querySelector('p').getAttribute('streak') === 'true';
                    this.githubStats.summary = tempDiv.querySelector('p').getAttribute('summary') === 'true';
                    this.githubStats.languages = tempDiv.querySelector('p').getAttribute('languages') === 'true';
                    this.githubStats.trophy = tempDiv.querySelector('p').getAttribute('trophy') === 'true';
                } else if (section.title === 'Image') {
                    // Get the image attributes
                    this.imageWidth = tempDiv.querySelector('p').getAttribute('width');
                    this.imageSrc = tempDiv.querySelector('p').textContent;
                } else if (section.title === 'Skill Icons') {
                    // Get the skill icons
                    let paragraph = tempDiv.querySelector('p');
                    if (paragraph) {
                        // Get the paragraph content
                        let icons = paragraph.textContent.split(',');
                        this.skillIcons = Object.keys(this.skillIcons).reduce((acc, icon) => {
                            acc[icon] = icons.includes(icon);
                            return acc;
                        }, {});
                    }
                } else if (section.title === 'Repository Badges') {
                    // Get the badges
                    let paragraph = tempDiv.querySelector('p');
                    if (paragraph) {
                        // Get the paragraph content
                        let badges = paragraph.getAttribute('badges').split(',');
                        this.badges = Object.keys(this.badges).reduce((acc, badge) => {
                            acc[badge] = badges.includes(badge);
                            return acc;
                        }, {});                   
                    }
                }

                let nodeList = tempDiv.querySelectorAll('.field');
                this.fields = Array.from(nodeList).map(field => {
                    if (section.title === 'Social Links') {
                        return { textContent: field.textContent, id: field.id };
                    } else {
                        return { textContent: field.textContent };
                    }
                });

            }
        },

        // Save the edited section
        async saveSection(section) {
            let tempDiv = document.createElement('div');
            tempDiv.innerHTML = section.content;
            let actualFields = tempDiv.querySelectorAll('.field')

            // Update the fields
            for (let i = 0; i < actualFields.length || i < this.fields.length; i++) {
                if (this.fields[i]){
                    if (actualFields[i]){
                        actualFields[i].textContent = this.fields[i].textContent;
                    } else {
                        let field = document.createElement('li');
                        field.classList.add('field');
                        field.innerHTML = this.fields[i].textContent;
                        if (section.title == 'Ordered List') {
                            tempDiv.querySelector('ol').appendChild(field);
                        } else {
                            tempDiv.querySelector('ul').appendChild(field);
                        }   
                    }
                    
                } else {
                    actualFields[i].remove();
                }
            }

            // Update the link URL
            if (section.title === 'Link') {
                // Get the link element
                let link = tempDiv.querySelector('a');
                if (link) {
                    // Update the link URL
                    link.setAttribute('href', this.linkUrl);
                }
            } else if (section.title === 'GitHub Stats') {
                // Update the attributes for github stats
                let paragraph = tempDiv.querySelector('p');
                if (paragraph) {
                    // Update the paragraph attributes                    
                    paragraph.setAttribute('stats', this.githubStats.stats);
                    paragraph.setAttribute('streak', this.githubStats.streak);
                    paragraph.setAttribute('summary', this.githubStats.summary);
                    paragraph.setAttribute('languages', this.githubStats.languages);
                    paragraph.setAttribute('trophy', this.githubStats.trophy);
                }
            } else if (section.title === 'Image') {
                // Update the image attributes
                let paragraph = tempDiv.querySelector('p');
                if (paragraph) {
                    // Update the paragraph attributes
                    paragraph.setAttribute('width', this.imageWidth);
                    // Get the file from the input element
                    let file = document.querySelector('.image-input').files[0];
                    
                    if (!file) {
                        file = document.querySelector('.image-input-mobile').files[0];
                    }

                    if (file && file.type.startsWith('image/')) {
                        // Create a storage reference
                        const storage = getStorage();
                        const storageRef = ref(storage, 'images/' + file.name);

                        // Upload the file to Firebase Storage
                        await uploadBytes(storageRef, file);

                        // Get the download URL of the uploaded file
                        const downloadURL = await getDownloadURL(storageRef);

                        // Save the link to the section
                        paragraph.textContent = downloadURL;
                    }
                }
            } else if (section.title === 'Skill Icons') {
                // Update the skill icons
                let paragraph = tempDiv.querySelector('p');
                if (paragraph) {
                    // Update the paragraph content
                    let icons = Object.keys(this.skillIcons).filter(icon => this.skillIcons[icon]);
                    paragraph.textContent = icons.join(',');
                }
            } else if (section.title === 'Repository Badges') {
                // Update the badges
                let paragraph = tempDiv.querySelector('p');
                if (paragraph) {
                    // Update the paragraph content
                    let badges = Object.keys(this.badges).filter(badge => this.badges[badge]);
                    paragraph.setAttribute('badges', badges.join(','));
                }
            }

            section.content = tempDiv.innerHTML;

            this.editing = false;
            this.saveHistory();
        },

        // Extract text from HTML content
        extractText(htmlContent) {
            let tempDiv = document.createElement('div');
            tempDiv.innerHTML = htmlContent;

            return tempDiv.textContent;
        },

        // Extract link from HTML content
        extractLink(htmlContent) {
            let tempDiv = document.createElement('div');
            tempDiv.innerHTML = htmlContent;

            let link = tempDiv.querySelector('a');
            if (link) {
                return link.getAttribute('href');
            }

            return '';
        },  

        // Extract the stats from the content
        extractStats(htmlContent) {
            let summary = false;
            let stats = false;
            let streak = false;
            let languages = false;
            let trophy = false;

            let statsContent = "";

            let tempDiv = document.createElement('div');
            tempDiv.innerHTML = htmlContent;

            let paragraph = tempDiv.querySelector('p');
            if (paragraph) {
                summary = paragraph.getAttribute('summary') === 'true';
                stats = paragraph.getAttribute('stats') === 'true';
                streak = paragraph.getAttribute('streak') === 'true';
                languages = paragraph.getAttribute('languages') === 'true';
                trophy = paragraph.getAttribute('trophy') === 'true';

                if (summary) {
                statsContent += '<p align="center"><img src="http://github-profile-summary-cards.vercel.app/api/cards/profile-details?username='+this.extractText(htmlContent)+'&show_icons=true&locale=en&theme=transparent" alt="'+this.extractText(htmlContent)+'" /></p>';
                }
                if (stats) {
                    statsContent += '<p align="center"><img src="https://github-readme-stats.vercel.app/api?username='+this.extractText(htmlContent)+'&show_icons=true&locale=en&rank_icon=github&theme=transparent" alt="'+this.extractText(htmlContent)+'" /></p>';
                }
                if (streak) {
                    statsContent += '<p align="center"><img src="https://github-readme-streak-stats.herokuapp.com/?user='+this.extractText(htmlContent)+'&theme=transparent" alt="'+this.extractText(htmlContent)+'" /></p>';
                }
                if (languages) {
                    statsContent += '<p align="center"><img src="https://github-readme-stats.vercel.app/api/top-langs?username='+this.extractText(htmlContent)+'&show_icons=true&locale=en&layout=pie" alt="'+this.extractText(htmlContent)+'" /></p>';
                }
                if (trophy) {
                    statsContent += '<p align="center"><img src="https://github-profile-trophy.vercel.app/?username='+this.extractText(htmlContent)+'&theme=flat&column=7" alt="'+this.extractText(htmlContent)+'" /></p>';
                }
            }

            

            return statsContent;
        },

        // Extract the image from the content
        extractImg(htmlContent) {
            let tempDiv = document.createElement('div');
            tempDiv.innerHTML = htmlContent;

            let img = tempDiv.querySelector('p');
            if (img) {
                return '<img src="' + img.textContent + '" style="width: ' + img.getAttribute('width') + '%;" />';
            }

            return '';
        },

        extractBadges(htmlContent) {
            let tempDiv = document.createElement('div');
            tempDiv.innerHTML = htmlContent;

            let paragraph = tempDiv.querySelector('p');
            let span = tempDiv.querySelector('span');
            if (paragraph && span) {
                let badges = paragraph.getAttribute('badges').split(',');
                let badgesContent = "";
                let text = paragraph.innerHTML+"/"+span.innerHTML;

                badges.forEach(badge => {
                    switch (badge){
                        case 'license':
                            badgesContent += '<img src="https://img.shields.io/github/license/'+text+'?style=flat&color=%2311cdef" />';
                            break;
                        case 'size':
                            badgesContent += '<img src="https://img.shields.io/github/repo-size/'+text+'?style=flat&color=%2311cdef" />';
                            break;
                        case 'release':
                            badgesContent += '<img src="https://img.shields.io/github/v/release/'+text+'?style=flat&color=%2311cdef" />';
                            break;
                        case 'tag':
                            badgesContent += '<img src="https://img.shields.io/github/v/tag/'+text+'?style=flat&color=%2311cdef" />';
                            break;
                        case 'commits':
                            badgesContent += '<img src="https://img.shields.io/github/commits-since/'+text+'/latest?style=flat&color=%2311cdef" />';
                            break;
                        case 'lastCommit':
                            badgesContent += '<img src="https://img.shields.io/github/last-commit/'+text+'?style=flat&color=%2311cdef" />';
                            break;
                        case 'downloads':
                            badgesContent += '<img src="https://img.shields.io/github/downloads/'+text+'/total?style=flat&color=%2311cdef" />';
                            break;
                        case 'forks':
                            badgesContent += '<img src="https://img.shields.io/github/forks/'+text+'?style=flat&color=%2311cdef" />';
                            break;
                        case 'stars':
                            badgesContent += '<img src="https://img.shields.io/github/stars/'+text+'?style=flat&color=%2311cdef" />';
                            break;
                        case 'watchers':
                            badgesContent += '<img src="https://img.shields.io/github/watchers/'+text+'?style=flat&color=%2311cdef" />';
                            break;
                        case 'contributors':
                            badgesContent += '<img src="https://img.shields.io/github/contributors/'+text+'?style=flat&color=%2311cdef" />';
                            break;
                        case 'issues':
                            badgesContent += '<img src="https://img.shields.io/github/issues/'+text+'?style=flat&color=%2311cdef" />';
                            break;
                        case 'pullRequests':
                            badgesContent += '<img src="https://img.shields.io/github/issues-pr/'+text+'?style=flat&color=%2311cdef" />';
                            break;
                    }
                });

                return badgesContent;
            }

            return '';
        },

        // Extract the social links from the content
        extractSocialLinks(htmlContent) {
            let tempDiv = document.createElement('div');
            tempDiv.innerHTML = htmlContent;

            let fields = tempDiv.querySelectorAll('.field');

            let socialLinksContent = "";

            fields.forEach(field => {
                if (field.textContent != '') {
                    switch (field.id) {
                        case 'Instagram':
                            socialLinksContent += '<a href="https://instagram.com/' + field.textContent + '"><img src="https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white"/></a>';
                            break;
                        case 'Twitter':
                            socialLinksContent += '<a href="https://twitter.com/' + field.textContent + '"><img src="https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white"/></a>';
                            break;
                        case 'LinkedIn':
                            socialLinksContent += '<a href="https://linkedin.com/in/' + field.textContent + '"><img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white"/></a>';
                            break;
                        case 'Facebook':
                            socialLinksContent += '<a href="https://facebook.com/' + field.textContent + '"><img src="https://img.shields.io/badge/Facebook-1877F2?style=for-the-badge&logo=facebook&logoColor=white"/></a>';
                            break;
                        case 'Email':
                            socialLinksContent += '<a href="mailto:' + field.textContent + '"><img src="https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white"/></a>';
                            break;
                        case 'Website':
                            socialLinksContent += '<a href="' + field.textContent + '"><img src="https://img.shields.io/badge/Website-4285F4?style=for-the-badge&logo=google-chrome&logoColor=white"/></a>';
                            break;
                        case 'Discord':
                            socialLinksContent += '<a href="https://discord.gg/' + field.textContent + '"><img src="https://img.shields.io/badge/Discord-7289DA?style=for-the-badge&logo=discord&logoColor=white"/></a>';
                            break;
                        case 'Telegram':
                            socialLinksContent += '<a href="https://t.me/' + field.textContent + '"><img src="https://img.shields.io/badge/Telegram-2CA5E0?style=for-the-badge&logo=telegram&logoColor=white"/></a>';
                            break;
                        case 'WhatsApp':
                            socialLinksContent += '<a href="https://wa.me/' + field.textContent + '"><img src="https://img.shields.io/badge/WhatsApp-25D366?style=for-the-badge&logo=whatsapp&logoColor=white"/></a>';
                            break;
                        case 'YouTube':
                            socialLinksContent += '<a href="https://youtube.com/channel/' + field.textContent + '"><img src="https://img.shields.io/badge/YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white"/></a>';
                            break;
                        case 'Twitch':
                            socialLinksContent += '<a href="https://twitch.tv/' + field.textContent + '"><img src="https://img.shields.io/badge/Twitch-9146FF?style=for-the-badge&logo=twitch&logoColor=white"/></a>';
                            break;
                        case 'Spotify':
                            socialLinksContent += '<a href="https://open.spotify.com/user/' + field.textContent + '"><img src="https://img.shields.io/badge/Spotify-1ED760?style=for-the-badge&logo=spotify&logoColor=white"/></a>';
                            break;
                        case 'WeChat':
                            socialLinksContent += '<a href="https://open.spotify.com/user/' + field.textContent + '"><img src="https://img.shields.io/badge/WeChat-07C160?style=for-the-badge&logo=wechat&logoColor=white"/></a>';
                            break;
                    }
                }
            });

            return socialLinksContent;
        },

        // Save ReadME to Firestore or LocalStorage
        async saveReadme() {
            if (this.user) {
                if (this.readmeId == 'NewReadMe' || this.readmeUser !== this.user.uid) {
                    // Add a new document with a generated ID
                    const docRef = await addDoc(collection(db, 'readme'), {
                        title: this.readmeTitle ? this.readmeTitle : 'New ReadME',
                        description: this.readmeDescription ? this.readmeDescription : '',
                        public: this.readmePublic,
                        user: this.user.uid,
                        sections: JSON.stringify(this.mySections),
                        content: this.getHtml(),
                    });

                    this.readmeId = docRef.id;
                    this.readmeUser = this.user.uid;
                    this.$route.params.id = docRef.id;
                } else {
                    // Update the document
                    const readmeRef = doc(db, "readme", this.readmeId);
                    await setDoc(readmeRef, {
                        title: this.readmeTitle ? this.readmeTitle : 'New ReadME',
                        description: this.readmeDescription ? this.readmeDescription : '',
                        public: this.readmePublic,
                        user: this.user.uid,
                        sections: JSON.stringify(this.mySections),
                        content: this.getHtml(),
                    });
                }

                // Clear the localStorage data
                localStorage.removeItem('mySections');
            } else {
                // Save the readme to localStorage
                localStorage.setItem('mySections', JSON.stringify(this.mySections));
                localStorage.setItem('readmeTitle', this.readmeTitle);
            }

            this.showTitleModal = false;
        },

        // Load the readme from Firestore or LocalStorage
        async loadReadme() {
            if (this.$route.params.id){
                this.readmeId = this.$route.params.id;
            } else {
                this.readmeId = 'NewReadMe';
            }
            

            if (this.readmeId == 'NewReadMe') {
                // Load the readme from LocalStorage
                if (localStorage.getItem('mySections')) {
                    this.mySections = JSON.parse(localStorage.getItem('mySections'));
                    this.readmeTitle = localStorage.getItem('readmeTitle');
                } else {
                    this.mySections = [];
                }
            } else {
                // Load the readme from Firestore
                const readmeRef = doc(db, "readme", this.$route.params.id);
                const readmeSnap = await getDoc(readmeRef);
                if (readmeSnap.exists()) {
                    this.mySections = JSON.parse(readmeSnap.data().sections);
                    this.readmeTitle = readmeSnap.data().title;
                    this.readmeDescription = readmeSnap.data().description;
                    this.readmePublic = readmeSnap.data().public ? readmeSnap.data().public : true;
                    this.readmeUser = readmeSnap.data().user;
                } else {
                    console.log("No such readme document!");
                }
                
            }

            this.saveHistory();
        },

        // Remove a field by index
        removeField(index) {
            // Remove the field from the fields array
            this.fields.splice(index, 1);
        },

        // Add a field to the section
        addField(section) {
            this.fields.push({ textContent: "New field" });
        },

        // Handle image change
        onImageChange(event) {
            const file = event.target.files[0];
            if (file && file.type.startsWith('image/')) {
                document.querySelector('.image-preview').parentNode.style.border= '2px dashed #cccc';
                document.querySelector('.image-preview-mobile').parentNode.style.border= '2px dashed #cccc';
                const reader = new FileReader();
                reader.onload = (e) => {
                    document.querySelector('.image-preview').src = e.target.result;
                    document.querySelector('.image-preview-mobile').src = e.target.result;
                };
                reader.readAsDataURL(file);
            } else {
                document.querySelector('.image-preview').parentNode.style.border= '2px dashed red';
                document.querySelector('.image-preview-mobile').parentNode.style.border= '2px dashed red';
            }
        },

        // Download the readme
        downloadReadme() {
            let markdown = this.getMarkdown();
            let blob = new Blob([markdown], { type: 'text/markdown' });
            let url = window.URL.createObjectURL(blob);
            let a = document.createElement('a');
            a.href = url;
            a.download = 'README.md';
            a.click();
        },

        // Save the history of the workbench
        saveHistory() {
            // Remove the future history
            if (this.historyIndex < this.history.length - 1) {
                this.history = this.history.slice(0, this.historyIndex + 1);
            }
            // Add the current sections to the history
            this.history.push(JSON.parse(JSON.stringify(this.mySections)));
            this.historyIndex++;
        },

        // Undo the last action
        undo() {
            if (this.historyIndex > 0) {
                this.historyIndex--;
                this.mySections = JSON.parse(JSON.stringify(this.history[this.historyIndex]));
            } 
        },

        // Redo the last action
        redo() {
            if (this.historyIndex < this.history.length - 1) {
                this.historyIndex++;
                this.mySections = JSON.parse(JSON.stringify(this.history[this.historyIndex]));
            }
        },

        // Scroll to the Skill Icons checkbox
        scrollToCheckbox() {
            const query = this.searchQuery.toLowerCase();
            const matchedKey = Object.keys(this.skillIcons).find(key => key.toLowerCase().startsWith(query));
            if (matchedKey) {
                const checkbox = document.getElementById(matchedKey);
                checkbox.scrollIntoView({ behavior: 'smooth', block: 'center' });
                const checkboxMobile = document.getElementById(matchedKey+'-mobile');
                checkboxMobile.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        },

    },
    computed: {
        // Draggable options
        dragOptions() {
            return {
                animation: 200,
                group: "description",
                disabled: false,
                ghostClass: "fade",
                axis: "y",
            };
        },
    },
}
</script>

<style scoped>
#sections, #addSections{
    width: 20vw;
}

#preview{
    width: 50vw;
    padding: 0 2rem 0 2rem;
}

.section-shaped{
    height: 100vh;
}

/* Style for list of sections */
.section-list{
    overflow-y: auto;
    height: 100%;
    scrollbar-color: var(--info) transparent;
    scrollbar-width: thin;
    transition: all 0.5s ease-in-out;
}

/* Style for section container */
.section-container{
    height: max-content;
}

/* Style for section card */
.section-card{
    transition: all 0.5s ease-in-out;
    border: 2px solid gainsboro;
    font-weight: bold;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.section-card:last-child, .section-container:last-child{
    margin-bottom: 0 !important;
}

.section-card:hover, .section-card-active{
    cursor: pointer;
    border: 2px solid var(--info);
}

.section-card i{
    opacity: 0;
}

.section-card i:hover, .handle:hover{
    cursor: pointer;
    color: var(--info);
}

.section-card:hover i, .section-card-active i{
    opacity: 1;
}

.section-card:hover small, .section-card-active small{
    opacity: 0;
}

.section-title{
    white-space: nowrap;
    overflow: hidden;
    text-overflow: hidden;
}

.section-actions i{
    left: 0;
    background-color: white;
    padding: 0.1rem;
}

.my-section .section-actions {
    right: 1rem;
    z-index: 1;
    padding: 0.5rem;
}

/* Style for my sections */
.my-section {
    transition: all 0.5s ease;
    width: 100%;  
}

/* Style for section input */
.input-button {
    padding: 5%;
    width: 60px!important;
    font-size: 0.6rem;
}

.image-input-container {
    position: relative;
    border: 2px dashed #cccc;
    border-radius: 10%;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    transition: all 0.5s ease;
}

.image-input-container:hover {
    border-color: var(--info);
}

.image-input, .image-input-mobile {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
}

.image-placeholder {
    padding: 3rem;
    font-size: 3rem;
    color: #cccc;
    transition: all 0.5s ease;
}

.image-input-container:hover .image-placeholder{
    color: var(--info) !important;
}

.image-preview, .image-preview-mobile {
    width: 10rem;
    height: 10rem;
    object-fit: contain;
}

.skillIcons-list{
    overflow-y: auto;
    height: 10rem;
}

.badges {
    text-transform: capitalize;
}

.socialLinks-label{
    font-size: 0.8rem;
    font-weight: bold;
}

/* Style for section ghost when dragging */
.ghost{
    opacity: 1 !important;
}

/* Style for dragging handler */
.handle{
    cursor: pointer;
}

.section-container:hover .handle{
    display: block;
}

/* Style for preview container */
.preview-display {
    height: 100%;
    overflow-y: auto;
    scrollbar-color: var(--info) transparent;
    scrollbar-width: thin;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" !important;
    word-wrap: break-word;
    overflow-wrap: break-word;
    border: 2px solid gainsboro;
    color: black;
}

.preview-display>>>*{
    max-width: 100%!important;
    font-weight: 400;
}

.preview-display>>>code{
    white-space: pre-wrap!important;
    word-wrap: break-word!important;
    overflow-wrap: break-word!important;
    color: var(--default)!important;
}

/* Style for preview/code and mySections/addSections toggles */
h2 span{
    transition: all 0.5s ease;
}

.unactive{
    color: gray!important;
    font-size: 70%;
    cursor: pointer;
}

#mySectionsTitle{
    display: none;
}

/* Style to make it look like GitHub */
.preview-display>>>h1, .preview-display>>>h2{
    font-weight: bold;
    border-bottom: 1px solid gainsboro;
    margin-bottom: 2rem;
}

.preview-display>>>h1{
    font-size: 2rem;
}

.preview-display>>>h2{
    font-size: 1.5rem;
    font-weight: 500;
}

.preview-display>>>a{
    color: var(--primary);
    text-decoration: underline;
    font-weight: 400;
}

.preview-display>>>pre{
    background-color: #f6f8fa;
    border-radius: 5px;
    padding: 1rem;
    margin: 1rem 0;    
}

.preview-display>>>pre p{
    font-size: 0.8rem!important;
}


/* Media Query for 991px screens */
@media screen and (max-width: 991.5px){
    .content{
        flex-direction: column!important;
        justify-content: space-between!important;
        align-items: center!important;
        width: 110%!important;
        margin-left: -5vw!important;
        padding-top: 0%!important;
    }

    .content>div{
        width: 100%!important;
    }

    .section-shaped{
        height: max-content!important;
    }

    #sections{
        display: none!important;
    }

    #preview{
        padding: 0!important;
        margin-bottom: 5rem !important;
    }

    #preview>.preview-display{
        height: 70vh;
        padding: 1rem!important;
    }

    #preview .buttons {
        display: none!important;
    }

    #preview>.buttons-mobile{
        display: flex!important;
    }

    .title-toggle{
        margin-bottom: 1rem!important;
    }

    #mySectionsTitle{
        display: inline;
    }

    .section-card i{
        opacity: 1;
        font-size: 1.5rem;
    }

    .my-section .section-actions{
        background-color: white;
    }

}

</style>