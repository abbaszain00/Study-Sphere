<template>
  <div v-if="isVisible" class="todo-container">
    <!-- Draggable Header -->
    <div
      class="todo-header"
      @mousedown="dragStart"
      @mousemove="dragging"
      @mouseup="dragEnd"
    >
      To-Do List
    </div>

    <div class="todo-body">
      <input
        type="text"
        v-model="newTask"
        @keyup.enter="addTask"
        placeholder="Add a new task..."
      />
      <div class="task" v-for="(task, index) in tasks" :key="index">
        <input type="checkbox" v-model="task.done" />
        <span :class="{ done: task.done }">{{ task.text }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      newTask: "",
      tasks: [],
      isVisible: false,
      isDragging: false,
      dragStartX: 0,
      dragStartY: 0,
    };
  },
  methods: {
    addTask() {
      if (this.newTask.trim()) {
        this.tasks.push({ text: this.newTask, done: false });
        this.newTask = "";
      }
    },
    toggleVisibility() {
      this.isVisible = !this.isVisible;
    },
    dragStart(event) {
      this.isDragging = true;
      const chatbox = this.$el; // This should reference the chatbot container now
      this.dragStartX = event.clientX - chatbox.offsetLeft;
      this.dragStartY = event.clientY - chatbox.offsetTop;
    },
    dragging(event) {
      if (this.isDragging) {
        this.$el.style.left = `${event.clientX - this.dragStartX}px`;
        this.$el.style.top = `${event.clientY - this.dragStartY}px`;
      }
    },
    dragEnd() {
      this.isDragging = false;
    },
  },
  props: {
    isVisible: Boolean,
  },
};
</script>

<style>
.todo-container {
  width: 400px;
  height: 200px;
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #fff;
  border: 1px solid #ccc;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  z-index: 1000;
}

.todo-header {
  background-color: black;
  color: white;
  padding: 10px;
  cursor: move; /* Indicate the header is draggable */
}
.todo-body {
  padding: 10px;
}

.task {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}

.task .done {
  text-decoration: line-through;
}
</style>
