import { fromPromise, assign, setup } from 'xstate';

export const todoMachine = setup({
  types: {
    context: {} as {
      todos: [];
      error: null;
    }
  },
  actors: {
    fetchUser: fromPromise(async () => {
      const response = await fetch('http://localhost:3000/todos');
      if (!response.ok) throw new Error('Failed to fetch todos');
      return response.json();
    })
  }
}).createMachine({
  id: 'todos',
  initial: 'loading',
  context: {
    todos: [],
    error: null
  },
  states: {
    idle: {
      on: {
        ADD_TODO: {
          actions: ['addTodo']
        },
        TOGGLE_TODO: {
          actions: ['toggleTodo']
        },
        DELETE_TODO: {
          actions: ['deleteTodo']
        }
      }
    },
    error: {
      on: {
        RETRY: 'loading'
      }
    },
    loading: {
      invoke: {
        src: 'fetchUser',
        onDone: {
          target: 'idle',
          actions: assign({
            todos: data => {
              return data.event.output;
            }
          })
        },
        onError: {
          target: 'error',
          actions: assign({
            error: (_, event) => event.data
          })
        }
      }
    }
  }
});
