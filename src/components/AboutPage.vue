<template>
<div class="about">
    <h1>Welcome to the WebEditor!</h1>
    <p>
        The service is used to collaborate on editing text documents online with your colleagues.
    </p>
    <h3>To get started:</h3>
    <ol>
        <li>Upload an existing file from your PC.</li>
        <li>Share a link to your colleague useing the 'share' button on the navbar.</li>
        <li>Edit your document together.</li>
        <li>Save and download the edited file!</li>
    </ol>
</div>
</template>

  
<script>
export default {
    name: 'AboutPage',
}
</script>

  <!-- Add "scoped" attribute to limit CSS to this component only -->
  
<style scoped>
.about {
    margin: 60px;
}

h1 {
    text-align: center;
}

h3 {
    margin: 40px 0 0;
    text-align: center;
}

ol {
    margin: auto;
    padding-left: 16 px;
    width: 532px;
}

li {
    margin-top: 20px;
}

a {
    color: #42b983;
}

p {
    text-align: center;
}
</style>
