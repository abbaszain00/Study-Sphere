<template>
  <div v-if="isToDoListVisible" class="todo-container">
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
      <transition-group name="fade" tag="div" class="task-list">
        <div class="task" v-for="(task, index) in tasks" :key="task.id">
          <input
            type="checkbox"
            v-model="task.done"
            @change="() => prepareToRemoveTask(task.id)"
          />
          <span :class="{ 'task-done': task.done }">{{ task.text }}</span>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  data() {
    return {
      newTask: "",
      isDragging: false,
      dragStartX: 0,
      dragStartY: 0,
    };
  },
  computed: {
    ...mapState(["tasks", "isToDoListVisible"]), // Use Vuex state for visibility
  },
  methods: {
    ...mapActions(["addNewTask", "removeTaskById", "toggleTaskDone"]),
    addTask() {
      if (this.newTask.trim()) {
        this.addNewTask({ id: Date.now(), text: this.newTask, done: false });
        this.newTask = "";
      }
    },
    prepareToRemoveTask(taskId) {
      this.toggleTaskDone(taskId);
      setTimeout(() => this.removeTaskById(taskId), 500);
    },
    dragStart(event) {
      this.isDragging = true;
      this.dragStartX = event.clientX - this.$el.offsetLeft;
      this.dragStartY = event.clientY - this.$el.offsetTop;
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
.task-list {
  transition: all 0.5s ease;
}

.task-done {
  text-decoration: line-through;
  color: #bbb;
  transition: color 0.5s ease-out, opacity 0.5s ease-out;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter,
.fade-leave-to /* <= For Vue 2.1.8+ */ {
  opacity: 0;
  max-height: 0;
}
</style>
