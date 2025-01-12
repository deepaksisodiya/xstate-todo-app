import { createMachine, assign } from 'xstate';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

interface Context {
  todos: Todo[];
}

interface AddTodoEvent {
  type: 'ADD_TODO';
  text: string;
}

type Event = AddTodoEvent;

export const todoMachine = createMachine<Context, Event>(
  {
    id: 'todo',
    initial: 'idle',
    context: {
      todos: []
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
      }
    }
  },
  {
    actions: {
      addTodo: assign({
        todos: ({ context, event }) => [
          ...context.todos,
          { id: new Date().getTime(), text: event.text, completed: false }
        ]
      }),
      toggleTodo: assign({
        todos: ({ context, event }) =>
          context.todos.map(todo => (todo.id === event.id ? { ...todo, completed: !todo.completed } : todo))
      }),
      deleteTodo: assign({
        todos: ({ context, event }) => context.todos.filter(todo => todo.id !== event.id)
      })
    }
  }
);
