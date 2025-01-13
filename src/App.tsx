import { useMachine } from '@xstate/react';
import { todoMachine } from './machine/todoMachine';
import { useState } from 'react';

function App() {
  const [state, send] = useMachine(todoMachine);
  const [text, setText] = useState('');

  const handleAdd = () => {
    if (text.trim()) {
      send({ type: 'ADD', input: text });
      setText('');
    }
  };

  const onToggle = todoId => {
    send({ type: 'TOGGLE', id: todoId });
  };

  const onDelete = todoId => {
    send({ type: 'DELETE', id: todoId });
  };

  if (state.matches('fetchUserLoading')) return <p>Loading...</p>;
  if (state.matches('error')) return <p>Error: {state.context.error}</p>;
  return (
    <>
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
    </>
  );
}

export default App;
