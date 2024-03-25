<template>
    <div class="header">
      <Sidebar/>
      <h1>Dashboard</h1>
    
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
    display: flex;
    border-bottom: 2px solid;
  }
  .header  h1{
   padding-left: 200px;
   margin: auto;
   padding-right: 50px;
  font-family: "Inter";
  }
  
  
 
  </style>
  