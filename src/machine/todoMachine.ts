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
    }),
    addTodo: fromPromise(async event => {
      const response = await fetch('http://localhost:3000/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: event.input, completed: false }) // Use event.input instead of event.text
      });
      if (!response.ok) throw new Error('Failed to add todo');
      return response.json();
    })
  }
}).createMachine({
  id: 'todos',
  initial: 'fetchUserLoading',
  context: {
    todos: [],
    error: null
  },
  states: {
    idle: {
      on: {
        ADD: {
          target: 'addingTodo'
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
        RETRY: 'fetchUserLoading'
      }
    },
    fetchUserLoading: {
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
    },
    addingTodo: {
      invoke: {
        src: 'addTodo',
        input: data => data.event.input,
        onDone: {
          target: 'fetchUserLoading'
        }
      }
    }
  }
});
