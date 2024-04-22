<template>
  <div class="faq-container">
    <!--Navbar-->
    <div id="navbar">
      <Navbar />
    </div>
    <!-- Main FAQ section -->
    <div class="faq-section">
      <h1>Frequently Asked Questions</h1>
      <!-- Container for individual FAQ items -->
      <div class="faq-container">
        <!-- Loop over the FAQs array, creating a div for each FAQ item -->
        <div v-for="(faq, index) in faqs" :key="index" class="faq-item">
          <!-- Button to toggle the visibility of the FAQ answer -->
          <button @click="toggleFaq(index)" class="faq-question">
            <!-- Toggle symbol changes based on whether the FAQ is open or not -->
            <span class="faq-toggle">{{ faq.open ? "-" : "+" }}</span>
            {{ faq.question }}
          </button>
          <!-- FAQ answer displayed only if the 'open' property is true -->
          <div v-if="faq.open" class="faq-answer">
            {{ faq.answer }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue"; //Import Navbar component

export default {
  name: "FaqView",
  components: {
    //Component declarations
    Navbar,
  },
  data() {
    //Array of FAQ objects, each containing a question, answer, and open state
    return {
      faqs: [
        {
          question: "What is Study Sphere?",
          answer:
            "An all-in-one productivity tool for students. Whether you like digital or traditional note-taking, study-sphere is the place for you. You can create notes, listen to some deep focus ambient noise, or even put on a nice background video for your revision.",
          open: false, // Initially, the answer is not visible
        },
        {
          question: "How do I sign up?",
          answer:
            "You can sign up by clicking on the Sign Up button and filling out the form.",
          open: false,
        },
        {
          question: "Is there a fee to register?",
          answer: "No, registration is completely free.",
          open: false,
        },
        {
          question: "Can I change my account details later?",
          answer:
            "Yes, you can update your account details at any time from your account settings.",
          open: false,
        },
      ],
    };
  },
  methods: {
    // Method to toggle the 'open' state of an FAQ item
    toggleFaq(index) {
      this.faqs[index].open = !this.faqs[index].open;
    },
  },
};
</script>

<style>
.faq-container {
  background: linear-gradient(white, #d3d0d0, #a1a1a1);
  height: 100vh;
  margin: 0px;
  overflow: visible;
  font-family: "Inter", sans-serif;
  width: 100%;
}

.faq-section {
  text-align: center;
  font-size: 18px;
  width: 100%;
}

.faq-item {
  width: 100%;
}

.faq-question {
  width: 100%;
  padding: 10px;
  font-size: 20px;
  text-align: left;
  background-color: #f2f2f2;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  display: flex;
  align-items: center;
  font-family: "Inter", sans-serif;
}

.faq-toggle {
  margin-right: 10px;
  font-weight: bold;
  color: #333;
}

.faq-answer {
  margin-top: 5px;
  text-align: left;
  font-size: 16px;
  background-color: #c4c2c2;
  padding: 10px;
  border-radius: 5px;
  font-family: "Inter", sans-serif;
  border: 1px solid black;
  width: 100%;
}
.navbar {
  width: 100%;
}
</style>
