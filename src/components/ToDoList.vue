<template>
  <div v-if="isToDoListVisible" class="todo-container">
    <div
      class="todo-header"
      @mousedown="dragStart"
      @mousemove="dragging"
      @mouseup="dragEnd"
    >
      To-Do List
      <button class="minimize-button" @click="toggleToDoListVisibility">
        -
      </button>
    </div>
    <div class="todo-body">
      <input
        type="text"
        v-model="newTask"
        @keyup.enter="addTask"
        placeholder="Add a new task..."
      />
      <div class="task-list">
        <div
          v-for="(task, index) in tasks"
          :key="task.id"
          :class="{ 'task-done': task.done }"
          class="task"
        >
          <input
            type="checkbox"
            v-model="task.done"
            @change="() => prepareToRemoveTask(task.id)"
          />
          <template v-if="task.isEditing">
            <input
              v-model="task.text"
              @blur="disableEditing(task)"
              @keyup.enter="disableEditing(task)"
              class="task-edit-input"
              autofocus
            />
          </template>
          <template v-else>
            <span
              @dblclick="enableEditing(task)"
              :class="{ 'task-done': task.done }"
              >{{ task.text }}</span
            >
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from "vuex";

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
    ...mapState(["tasks", "isToDoListVisible"]),
  },
  methods: {
    ...mapMutations(["toggleToDoListVisibility"]),
    ...mapActions(["addNewTask", "removeTaskById", "toggleTaskDone"]),
    addTask() {
      if (this.newTask.trim()) {
        this.addNewTask({
          id: Date.now(),
          text: this.newTask,
          done: false,
          isEditing: false,
        });
        this.newTask = "";
      }
    },
    enableEditing(task) {
      task.isEditing = true;
    },
    disableEditing(task) {
      task.isEditing = false;
      // Optionally, dispatch an action to update the task in the store
    },
    prepareToRemoveTask(taskId) {
      this.toggleTaskDone(taskId);
      setTimeout(() => this.removeTaskById(taskId));
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
  font-family: "Inter";
}

.todo-header {
  background-color: black;
  color: white;
  padding: 10px;
  cursor: move; /* Indicate the header is draggable */
  text-align: center;
}
.todo-body {
  padding: 10px;
  overflow: auto;
}
.todo-body input[type="text"] {
  margin-bottom: 10px;
  border: 2px solid black;
  border-radius: 10px;
}

.minimize-button {
  background-color: transparent;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 30px;
  position: absolute;
  right: 10px;
  top: 0px;
}
.task-edit-input {
  width: 90%;
  box-sizing: border-box;
  border: black 10px;
}
</style>
