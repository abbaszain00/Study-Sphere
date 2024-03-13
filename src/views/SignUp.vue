<template>
   <div class ="signup-container">
    <div id="navbar">
      <Navbar />

    </div>
    <div class ="signup-section">
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue';
export default {
  name: 'SignUp',
  components: {
    Navbar,
  }
}
</script>

<style>
.signup-container {
  background: linear-gradient(white, #D3D0D0,#A1A1A1);
  height: 100vh;
  margin: 0px;
  overflow: hidden;
  font-family: 'Inter', sans-serif;  
}

.signup-section {
  height: 100vh;
  overflow: hidden;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 28px;
  margin-top: 30px;
}
</style>
