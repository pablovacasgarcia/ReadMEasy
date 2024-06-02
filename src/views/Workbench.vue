<template>
    <section class="section section-shaped section-lg my-0">
        <div class="shape shape-style-1 bg-white">
        </div>

        <!-- Content -->
        <div class="content container-fluid w-100 h-75 d-flex p-5 justify-content-center">

            <!-- My Sections -->
            <div id="sections">
                <h2 class="mb-5">My Sections</h2>

                <!-- Draggable Sections -->
                <draggable v-model="mySections" group="sections" class="list-unstyled section-list pr-1 w-100" v-bind="dragOptions" handle=".handle" :end="loadPreview()">
                    <transition-group type="transition">
                        <li v-for="(section, index) in mySections" :id="`section_${index}`" :key="`section_${index}`" class="section-container w-100 mb-4 h-max-content d-flex align-items-center flex-column">
                            
                            <!-- Section Card -->
                            <div :class="['section-card', 'my-section', 'bg-white', 'p-4', 'rounded', 'd-flex', 'justify-content-between', 'align-items-center', 'display-5', 'mw-100', { 'section-card-active' : editing == section }]">
                                <div class="d-flex align-items-center position-relative w-100">   
                                    <div class="d-flex position-absolute handle"> 
                                        <i class="fa fa-arrows-v"></i>
                                    </div>
                                    
                                    <div class="section-title ml-1 w-100">
                                        {{ section.title }}
                                        <small class="ml-2 text-muted">{{ extractText(section.content) }}</small>
                                    </div>
                                    
                                </div> 
                                <div class="section-actions d-flex">
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
                                    <base-checkbox v-model="githubStats.trophy">Trophy</base-checkbox>
                                </div>

                                <div v-else-if="section.title=='Skill Icons'" class="skillIcons-list m-2">
                                    <base-checkbox v-for="(icon, key) in skillIcons" :key="key" v-model="skillIcons[key]">{{ key }}</base-checkbox>
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
                        <base-button type="warning" @click="loadSectionsFromLocalStorage()"><i class="fa fa-undo" @click="loadSectionsFromLocalStorage()"></i></base-button>                        
                        <base-button type="info" @click="showTitleModal = true"><i class="fa fa-floppy-o"></i></base-button>
                        <base-button type="success" @click="downloadReadme"><i class="fa fa-download"></i></base-button>
                    </div>
                </header>

                <!-- Preview Display -->
                <div class="w-100 h-100 bg-white rounded preview-display p-5" id="preview-display"></div>

                <!-- Mobile Buttons -->
                <div class="buttons-mobile d-none justify-content-start mt-3">
                        <base-button type="warning" @click="loadSectionsFromLocalStorage()"><i class="fa fa-undo"></i></base-button>                        
                        <base-button type="info" @click="showTitleModal = true"><i class="fa fa-floppy-o"></i></base-button>
                        <base-button type="success" @click="downloadReadme()"><i class="fa fa-download"></i></base-button>
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
                <draggable id="mobile-sections-list" v-model="mySections" group="sections" class="d-none list-unstyled section-list" v-bind="dragOptions" handle=".handle" :end="loadPreview()">
                    <transition-group type="transition">
                        <li v-for="(section, index) in mySections" :id="`section_${index}`" :key="`section_${index}`" class="section-container w-100 mb-4 h-max-content d-flex align-items-center flex-column">
                            
                            <!-- Section Card -->
                            <div :class="['section-card', 'my-section', 'bg-white', 'p-4', 'rounded', 'd-flex', 'justify-content-between', 'align-items-center', 'display-5', 'w-100', { 'section-card-active' : editing == section }]">
                                <div class="d-flex align-items-center position-relative w-100">   
                                    <div class="d-flex position-absolute handle"> 
                                        <i class="fa fa-arrows-v"></i>
                                    </div>
                                    
                                    <div class="section-title ml-1 w-100">
                                        {{ section.title }}
                                        <small class="ml-2 text-muted">{{ extractText(section.content) }}</small>
                                    </div>
                                    
                                </div> 
                                <div class="section-actions">
                                    <i class="fa fa-pencil mr-2" @click="editSection(section)"></i>
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
                                    <base-checkbox v-model="githubStats.trophy">Trophy</base-checkbox>
                                </div>

                                <div v-else-if="section.title=='Skill Icons'" class="skillIcons-list m-2">
                                    <base-checkbox v-for="(icon, key) in skillIcons" :key="key" v-model="skillIcons[key]">{{ key }}</base-checkbox>
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
            <div>
                <base-input class="field-input m-2" v-model="readmeTitle" placeholder="ReadME Title"></base-input>
            </div>
            <template slot="footer">
                <base-button type="secondary" @click="showTitleModal = false">Close</base-button>
                <base-button type="primary" @click="saveReadme">Save changes</base-button>
            </template>
        </modal>
    </section>
</template>

<script>
import { db } from '../../firebase'; // Ruta al archivo de configuración de Firebase
import { collection, onSnapshot, addDoc } from 'firebase/firestore';
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
        };
    },

    mounted() {
        const auth = getAuth();
        onAuthStateChanged(auth, user => {
            this.user = user;
        });
    },

    created() {
        // Load default sections from Firestore
        const sectionsRef = collection(db, 'section');
        onSnapshot(sectionsRef, (snapshot) => {
            this.sections = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        });

        // Load sections from localStorage
        this.loadSectionsFromLocalStorage();
    },

    methods: {
        // Add a section to the workbench
        addSection(section) {
            this.mySections.push({ title: section.title, content: section.content });
            this.loadPreview();

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
            this.loadPreview();
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

                    // Display the content as HTML
                    for (let section of this.mySections) {
                        if (section.title == 'GitHub Stats') {
                            // Display the github stats
                            document.getElementById('preview-display').innerHTML += this.extractStats(section.content);
                        } else if (section.title === 'Code') {
                            // Display the code or text
                            document.getElementById('preview-display').innerHTML += '<pre>' + section.content + '</pre>';
                        } else if (section.title === 'Image') {
                            // Display the image
                            document.getElementById('preview-display').innerHTML += '<p>' + this.extractImg(section.content) + '</p>';
                        } else if (section.title === 'Skill Icons'){
                            // Display the skill icons
                            document.getElementById('preview-display').innerHTML += '<p><img src="https://skillicons.dev/icons?i='+ this.extractText(section.content) +'" /></p>';
                        } else if (section.title === 'Repository Badges'){
                            // Display the repository badges
                            document.getElementById('preview-display').innerHTML += '<p>' + this.extractBadges(section.content) + '</p>';
                        } else if (section.title === 'Social Links') {
                            // Display the social links
                            document.getElementById('preview-display').innerHTML += '<p>' + this.extractSocialLinks(section.content) + '</p>';
                        } else {
                            // Display the content
                            document.getElementById('preview-display').innerHTML += section.content;
                        }
                    }
                }
            }            
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
                        markdown += this.turndownService.turndown(this.extractStats(section.content)) + '\n\n';
                        break;
                    case 'Image':
                        markdown += this.extractImg(section.content) + '\n\n';
                        break;
                    case 'Skill Icons':
                        markdown += '<img src="https://skillicons.dev/icons?i='+ this.extractText(section.content) +'" />' + '\n\n';
                        break;
                    case 'Repository Badges':
                        markdown += this.extractBadges(section.content) + '\n\n';
                        break;
                    case 'Social Links':
                        markdown += this.turndownService.turndown(this.extractSocialLinks(section.content)) + '\n\n';
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
                    this.githubStats.languages = tempDiv.querySelector('p').getAttribute('languages') === 'true';
                    this.githubStats.stats = tempDiv.querySelector('p').getAttribute('stats') === 'true';
                    this.githubStats.streak = tempDiv.querySelector('p').getAttribute('streak') === 'true';
                    this.githubStats.summary = tempDiv.querySelector('p').getAttribute('summary') === 'true';
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
                    paragraph.setAttribute('languages', this.githubStats.languages);
                    paragraph.setAttribute('stats', this.githubStats.stats);
                    paragraph.setAttribute('streak', this.githubStats.streak);
                    paragraph.setAttribute('summary', this.githubStats.summary);
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

                    if (file) {
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
            this.loadPreview();
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
                statsContent += '<p><img src="http://github-profile-summary-cards.vercel.app/api/cards/profile-details?username='+this.extractText(htmlContent)+'&show_icons=true&locale=en&theme=transparent" alt="'+this.extractText(htmlContent)+'" /></p>';
                }
                if (stats) {
                    statsContent += '<p><img src="https://github-readme-stats.vercel.app/api?username='+this.extractText(htmlContent)+'&show_icons=true&locale=en&rank_icon=github&theme=transparent" alt="'+this.extractText(htmlContent)+'" /></p>';
                }
                if (streak) {
                    statsContent += '<p><img src="https://github-readme-streak-stats.herokuapp.com/?user='+this.extractText(htmlContent)+'&theme=transparent" alt="'+this.extractText(htmlContent)+'" /></p>';
                }
                if (languages) {
                    statsContent += '<p><img src="https://github-readme-stats.vercel.app/api/top-langs?username='+this.extractText(htmlContent)+'&show_icons=true&locale=en&layout=pie&theme=transparent" alt="'+this.extractText(htmlContent)+'" /></p>';
                }
                if (trophy) {
                    statsContent += '<p><img src="https://github-profile-trophy.vercel.app/?username='+this.extractText(htmlContent)+'&theme=flat&column=7" alt="'+this.extractText(htmlContent)+'" /></p>';
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
            if (paragraph) {
                let badges = paragraph.getAttribute('badges').split(',');
                let badgesContent = "";

                badges.forEach(badge => {
                    switch (badge){
                        case 'license':
                            badgesContent += '<img src="https://img.shields.io/github/license/'+this.extractText(htmlContent)+'?style=flat&color=%2311cdef" />';
                            break;
                        case 'size':
                            badgesContent += '<img src="https://img.shields.io/github/repo-size/'+this.extractText(htmlContent)+'?style=flat&color=%2311cdef" />';
                            break;
                        case 'release':
                            badgesContent += '<img src="https://img.shields.io/github/v/release/'+this.extractText(htmlContent)+'?style=flat&color=%2311cdef" />';
                            break;
                        case 'tag':
                            badgesContent += '<img src="https://img.shields.io/github/v/tag/'+this.extractText(htmlContent)+'?style=flat&color=%2311cdef" />';
                            break;
                        case 'commits':
                            badgesContent += '<img src="https://img.shields.io/github/commits-since/'+this.extractText(htmlContent)+'/latest?style=flat&color=%2311cdef" />';
                            break;
                        case 'lastCommit':
                            badgesContent += '<img src="https://img.shields.io/github/last-commit/'+this.extractText(htmlContent)+'?style=flat&color=%2311cdef" />';
                            break;
                        case 'downloads':
                            badgesContent += '<img src="https://img.shields.io/github/downloads/'+this.extractText(htmlContent)+'/total?style=flat&color=%2311cdef" />';
                            break;
                        case 'forks':
                            badgesContent += '<img src="https://img.shields.io/github/forks/'+this.extractText(htmlContent)+'?style=flat&color=%2311cdef" />';
                            break;
                        case 'stars':
                            badgesContent += '<img src="https://img.shields.io/github/stars/'+this.extractText(htmlContent)+'?style=flat&color=%2311cdef" />';
                            break;
                        case 'watchers':
                            badgesContent += '<img src="https://img.shields.io/github/watchers/'+this.extractText(htmlContent)+'?style=flat&color=%2311cdef" />';
                            break;
                        case 'contributors':
                            badgesContent += '<img src="https://img.shields.io/github/contributors/'+this.extractText(htmlContent)+'?style=flat&color=%2311cdef" />';
                            break;
                        case 'issues':
                            badgesContent += '<img src="https://img.shields.io/github/issues/'+this.extractText(htmlContent)+'?style=flat&color=%2311cdef" />';
                            break;
                        case 'pullRequests':
                            badgesContent += '<img src="https://img.shields.io/github/issues-pr/'+this.extractText(htmlContent)+'?style=flat&color=%2311cdef" />';
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
                // Save the readme to Firestore
                await addDoc(collection(db, 'readme'), {
                    title: this.readmeTitle,
                    user: this.user.uid,
                    readme: JSON.stringify(this.mySections)
                });
            } 

            // Save the readme to localStorage
            localStorage.setItem('mySections', JSON.stringify(this.mySections));
            localStorage.setItem('readmeTitle', this.readmeTitle);

            this.showTitleModal = false;
        },

        // Load the sections from localStorage
        loadSectionsFromLocalStorage() {
            if (localStorage.getItem('mySections')) {
                this.mySections = JSON.parse(localStorage.getItem('mySections'));
                this.readmeTitle = localStorage.getItem('readmeTitle');
            }
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
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    document.querySelector('.image-preview').src = e.target.result;
                    document.querySelector('.image-preview-mobile').src = e.target.result;
                };
                reader.readAsDataURL(file);
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
        }

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
        }
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
}

.my-section .section-actions {
    margin-left: -2rem;
    z-index: 1;
    background-color: white;
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
    object-fit: cover;
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
    left: -20;
    height: 4.5rem;
    border-radius: 2px 0 0 2px;
    width: 1.5rem;
    align-items: center!important;
    justify-content: center!important;
    transition: all 0.5s ease;  
}

.section-container:hover .handle{
    display: inline;
}

/* Style for preview container */
.preview-display {
    overflow-y: auto;
    scrollbar-color: var(--info) transparent;
    scrollbar-width: thin;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" !important;
    word-wrap: break-word;
    overflow-wrap: break-word;
    border: 2px solid gainsboro;
}

.preview-display>>>*{
    max-width: 100%!important;
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
        height: 70vh!important;
        padding: 1rem!important;
    }

    #preview .buttons{
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
    }

}

</style>