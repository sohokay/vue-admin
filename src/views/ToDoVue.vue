<template>
  <div class="app-container">
    <div style="width: 800px;margin: 0 auto;">
      <el-input
        v-model="newTodo"
        class="new-todo"
        autofocus
        autocomplete="off"
        placeholder="输入待办事项"
        @keyup.enter.native="addTodo"
      />
      <ul class="todo-list">
        <li
          v-for="todo in filteredTodos"
          :key="todo.id"
          class="todo"
          :class="{ completed: todo.completed, editing: todo === editedTodo }"
        >
          <div class="view">
            <label>
              <el-checkbox v-model="todo.completed" style="margin-right: 5px;" />
            </label>
            <label @dblclick="editTodo(todo)">
              {{ todo.title }}</label>

            <el-button class="destroy" type="danger" @click="removeTodo(todo)">删除</el-button>
            <!--            <el-button class="destroy" type="primary" style="margin-right: 8px;" @click="editTodo(todo)">编辑</el-button>-->
          </div>
        </li>
      </ul>
      <footer v-show="todos.length" v-cloak class="footer" style="margin-top: 8px;">
        <span class="todo-count">
          还有<el-tag type="danger">{{ remaining }}</el-tag> 条代办
        </span>
        <!--        <ul class="filters">-->
        <span style="margin-left: 15px; margin-right: 5px;">
          <el-link type="warning" @click="visibility='all'">All</el-link>
        </span>
        <span style="margin-left: 15px; margin-right: 5px;">
          <el-link type="primary" @click="visibility='active'">未完成</el-link>
        </span>
        <span style="margin-left: 15px; margin-right: 5px;">
          <el-link type="success" @click="visibility='completed'">已完成</el-link>
        </span>

        <el-button
          v-show="todos.length > remaining"
          class="clear-completed"
          type="danger"
          style="margin-left: 15px;"
          @click="removeCompleted"
        >
          清除已完成
        </el-button>
      </footer>
      <pre v-show="todos.length" class="" style="float: left;">
           <h1>Todos 数据</h1>
        <code v-html="todos" />
      </pre>

      <pre v-show="filteredTodos.length" class="" style="float: left;margin-left: 15px;">
      <h1>filter Todos 数据</h1>
      <code v-html="filteredTodos" />
      </pre>
    </div>

  </div>
</template>

<script>
// Full spec-compliant TodoMVC with localStorage persistence
// and hash-based routing in ~120 effective lines of JavaScript.

// localStorage persistence
const STORAGE_KEY = 'vue-todo'
const todoStorage = {
  fetch: function() {
    const todos = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    todos.forEach(function(todo, index) {
      todo.id = index
    })
    todoStorage.uid = todos.length
    return todos
  },
  save: function(todos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }
}

// visibility filters
const filters = {
  all: function(todos) {
    return todos
  },
  active: function(todos) {
    return todos.filter(function(todo) {
      return !todo.completed
    })
  },
  completed: function(todos) {
    return todos.filter(function(todo) {
      return todo.completed
    })
  }
}
export default {
  name: 'ToDoVue',

  // app initial state
  data: function() {
    return {
      // todos: todoStorage.fetch(),
      todos: [
        {
          'id': 0,
          'title': '吃饭',
          'completed': false
        },
        {
          'id': 1,
          'title': '睡觉',
          'completed': false
        },
        {
          'id': 2,
          'title': '打豆豆',
          'completed': false
        }
      ],
      newTodo: '',
      editedTodo: null,
      visibility: 'all'
    }
  },

  computed: {
    filteredTodos: function() {
      return filters[this.visibility](this.todos)
    },
    remaining: function() {
      return filters.active(this.todos).length
    },
    allDone: {
      get: function() {
        return this.remaining === 0
      },
      set: function(value) {
        this.todos.forEach(function(todo) {
          todo.completed = value
        })
      }
    }
  },
  watch: {
    todos: {
      handler: function(todos) {
        todoStorage.save(todos)
      },
      deep: true
    }
  },
  created() {

  },
  methods: {
    addTodo: function() {
      var value = this.newTodo && this.newTodo.trim()
      if (!value) {
        return
      }
      this.todos.push({
        id: todoStorage.uid++,
        title: value,
        completed: false
      })
      this.newTodo = ''
    },

    removeTodo: function(todo) {
      this.todos.splice(this.todos.indexOf(todo), 1)
    },

    editTodo: function(todo) {
      this.beforeEditCache = todo.title
      this.editedTodo = todo
    },

    doneEdit: function(todo) {
      if (!this.editedTodo) {
        return
      }
      this.editedTodo = null
      todo.title = todo.title.trim()
      if (!todo.title) {
        this.removeTodo(todo)
      }
    },

    removeCompleted: function() {
      this.todos = filters.active(this.todos)
    }
  }
}
//
// function onHashChange() {
//   var visibility = window.location.hash.replace(/#\/?/, '')
//   if (filters[visibility]) {
//     app.visibility = visibility
//   } else {
//     window.location.hash = ''
//     app.visibility = 'all'
//   }
// }
//
// window.addEventListener('hashchange', onHashChange)
// onHashChange()
</script>

<style scoped lang="scss">
ul, li {
  list-style: none;
  padding: 0;
  margin: 0;
}

.todo-list {
  li {
    padding: 12px 12px;

    .view {
      width: 100%;
    }

    .el-button {
      float: right;
    }
  }

  //.filters {
  //  li {
  //    float: left;
  //  }
  //}
}
</style>
