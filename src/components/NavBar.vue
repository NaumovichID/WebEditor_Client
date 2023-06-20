<template>
<nav class="navbar navbar-expand-md navbar-light bg-light">
    <ul class="navbar-nav">
        <li class="nav-item">
            <router-link class="nav-link" to="/">Home</router-link>
        </li>
        <li class="nav-item">
            <router-link class="nav-link" to="/about">About</router-link>
        </li>
    </ul>
</nav>
</template>

  
<script>
export default {
    name: 'NavBar'
}
</script>

  
<style scoped>
li {
    display: inline;
}

/* .custom-navbar {
    display: inline-block;
    padding: 10px 20px;
    margin: 8px;
    background-color: #2976c2;
    color: white;
    border: none;
    border-radius: 8px;
  } */
/* CSS styles for the navbar component */
</style>
