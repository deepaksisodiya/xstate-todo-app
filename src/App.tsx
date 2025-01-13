import Navigation from './Navigation';
import { Outlet } from 'react-router-dom';
import Logo from './assets/react.svg';
import Todos from './modules/todos/Todos';
import { useMachine } from '@xstate/react';
import { todoMachine } from './machine/todoMachine';
import { useState } from 'react';

function App() {
  const [state, send] = useMachine(todoMachine);
  const [text, setText] = useState('');

  const handleAdd = () => {
    if (text.trim()) {
      send({ type: 'ADD_TODO', text });
      setText('');
    }
  };

  const onToggle = todoId => {
    send({ type: 'TOGGLE_TODO', id: todoId });
  };

  const onDelete = todoId => {
    send({ type: 'DELETE_TODO', id: todoId });
  };

  if (state.value === 'loading') return <p>Loading... {JSON.stringify(state.context.todos)}</p>;
  if (state.value === 'error') return <p>Error: {state.context.error}</p>;

  return (
    <>
      <Navigation />

      {JSON.stringify(state.context.todos)}
      <div>
        <input type="text" value={text} onChange={e => setText(e.target.value)} placeholder="Add a todo" />
        <button onClick={handleAdd}>Add</button>
      </div>

      <ul>
        {state.context.todos.map(todo => (
          <li key={todo.id} style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
            <span onClick={() => onToggle(todo.id)}>{todo.text}</span>
            <button onClick={() => onDelete(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>

      <h2>API End Point: {JSON.stringify(import.meta.env.VITE_APP_API_URL)}</h2>
      <Logo />
      <h1>React Template</h1>
      <div id="detail">
        <Outlet />
      </div>

      <Todos />
    </>
  );
}

export default App;
