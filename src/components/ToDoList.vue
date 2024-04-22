<template>
  <div v-if="isToDoListVisible" class="todo-container">
    <!-- Header of the to-do list which includes draggable functionality and minimize button -->
    <div
      class="todo-header"
      @mousedown="dragStart"
      @mousemove="dragging"
      @mouseup="dragEnd"
    >
      To-Do List
      <!-- Button to minimise or hide the to-do list -->
      <button class="minimize-button" @click="toggleToDoListVisibility">
        -
      </button>
    </div>
    <div class="todo-body">
      <!-- Input for adding new tasks, creates task on enter key -->
      <input
        type="text"
        v-model="newTask"
        @keyup.enter="addTask"
        placeholder="Add a new task..."
      />
      <!-- List container for tasks -->
      <div class="task-list">
        <div
          v-for="(task, index) in tasks"
          :key="task.id"
          :class="{ 'task-done': task.done }"
          class="task"
        >
          <!-- Checkbox to toggle task completion -->
          <input
            type="checkbox"
            v-model="task.done"
            @change="() => prepareToRemoveTask(task.id)"
          />
          <template v-if="task.isEditing">
            <!-- Allow editing of task when it's in edit mode -->
            <input
              v-model="task.text"
              @blur="disableEditing(task)"
              @keyup.enter="disableEditing(task)"
              class="task-edit-input"
              autofocus
            />
          </template>
          <!-- Display task text, allow double click to edit -->
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
import { mapActions, mapState, mapMutations } from "vuex"; //importing states, actions and mutations from vuex store

export default {
  data() {
    return {
      newTask: "", // Model for new task input
      isDragging: false, //Flag to track if element is being dragged
      dragStartX: 0, // Initial drag X position
      dragStartY: 0, // Initial drag Y position
    };
  },
  computed: {
    ...mapState(["tasks", "isToDoListVisible"]), // Maps Vuex state to local computed properties
  },
  methods: {
    ...mapMutations(["toggleToDoListVisibility"]), // maps vuex mutations to local methods
    ...mapActions(["addNewTask", "removeTaskById", "toggleTaskDone"]), //maps vuex actions to local methods
    //Method to add task to list
    addTask() {
      if (this.newTask.trim()) {
        this.addNewTask({
          id: Date.now(),
          text: this.newTask,
          done: false,
          isEditing: false,
        });
        this.newTask = ""; // Resets the new task input after adding
      }
    },
    //Sets task to editing mode
    enableEditing(task) {
      task.isEditing = true;
    },
    //Removes task from editing mode
    disableEditing(task) {
      task.isEditing = false;
    },
    prepareToRemoveTask(taskId) {
      this.toggleTaskDone(taskId); // Marks task as done before removing it
      setTimeout(() => this.removeTaskById(taskId)); //delays task removal
    },
    //Sets component to begin dragging
    dragStart(event) {
      this.isDragging = true;
      this.dragStartX = event.clientX - this.$el.offsetLeft;
      this.dragStartY = event.clientY - this.$el.offsetTop;
    },
    //Moves element if dragging is active
    dragging(event) {
      if (this.isDragging) {
        this.$el.style.left = `${event.clientX - this.dragStartX}px`;
        this.$el.style.top = `${event.clientY - this.dragStartY}px`;
      }
    },
    //Stops dragging
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
  cursor: move;
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
