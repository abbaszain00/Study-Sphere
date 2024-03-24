<template>
    <div class="header">
      <div>
        <Sidebar/>
      </div>
    </div>
  </template>
  
  <script>
  import Sidebar from './Sidebar.vue';
  export default {
    name: 'Top',
    components: {
      Sidebar,
    }
  };
  </script>
  
  <style>
  .header {
    background-color: white; /* Light grey background */
    height: 50px;
  }
  
  
 
  </style>
  