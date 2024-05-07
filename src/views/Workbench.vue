<template>
    <section class="section section-shaped section-lg my-0">
        <div class="shape shape-style-1 bg-gradient-gray">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
        </div>
        <div class="container-fluid w-100 h-100 d-flex p-5 justify-content-center">
            <div id="sections" class="h-100 w-25 mx-5">
                <h2>Sections</h2>
            </div>

            <div id="preview" class="h-75 w-50 mx-5">
                <header class="d-flex w-100 justify-content-between alignn-items-center">
                    <h2>Preview
                        <small class="text-muted">Code</small>
                    </h2>
                    <div class="buttons">
                        <base-button type="warning">Restart</base-button>                        
                        <base-button type="info">Save</base-button>
                        <base-button type="success">Download</base-button>
                    </div>
                </header>
                <div class="w-100 h-100 bg-secondary mt-5" name="" id=""></div>
            </div>

            <div id="addSections" class="h-100 w-25 mx-5">
                <h2>Add Sections</h2>
            </div>
        </div>
    </section>
</template>

<script>
 export default{
    name: "workbench",
    data(){
        return{
            title: "Workbench"
        }
    }
 }
</script>

<style>

</style>