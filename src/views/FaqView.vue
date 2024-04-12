<template>
  <div class="signup-container">
    <div id="navbar">
      <Navbar />
    </div>
    <div class="signup-section">
      <h1>Frequently Asked Questions</h1>
      <div class="faq-container">
        <div v-for="(faq, index) in faqs" :key="index" class="faq-item">
          <button @click="toggleFaq(index)" class="faq-question">
            <span class="faq-toggle">{{ faq.open ? "-" : "+" }}</span>
            {{ faq.question }}
          </button>
          <div v-if="faq.open" class="faq-answer">
            {{ faq.answer }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";

export default {
  name: "SignUp",
  components: {
    Navbar,
  },
  data() {
    return {
      faqs: [
        {
          question: "What is Study Sphere?",
          answer:
            "An all-in-one productivity tool for students. Whether you like digital or traditional note-taking, study-sphere is the place for you. You can create notes, listen to some deep focus ambient noise, or even put on a nice background video for your revision.",
          open: false,
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
    toggleFaq(index) {
      this.faqs[index].open = !this.faqs[index].open;
    },
  },
};
</script>

<style>
.signup-container {
  background: linear-gradient(white, #d3d0d0, #a1a1a1);
  height: 100vh;
  margin: 0px;
  overflow: hidden;
  font-family: "Inter", sans-serif;
}

.signup-section {
  padding: 20px;
  text-align: center;
  font-size: 18px;
}

.faq-container {
  margin-top: 20px;
  text-align: left;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: "Inter", sans-serif;
}

.faq-item {
  margin: 10px;
  width: 80%;
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
  background-color: #c4c2c2; /* Darker shade for the answer */
  padding: 10px;
  border-radius: 5px;
  font-family: "Inter", sans-serif;
  border: 1px solid black;
}
</style>
