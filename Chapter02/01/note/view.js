const getTodoElement = todo => {
  const { text, completed } = todo;
  return `
  <li ${completed ? 'class="completed"' : ''}>
    <div class="view">
      <input type="checkbox"
      ${completed ? 'checked' : ''}
      class='toggle'>
      <label>${text}</label>
      <button class="destroy"></button>
    </div>
    <input type="text" class="edit" value='${text}'>
  </li>`;
};

const getTodoCount = todos => {
  const notCompleted = todos.filter(todo => !todo.completed);

  const { length } = notCompleted;
  if (length === 1) {
    return '1 Item left';
  } // why?

  return `${length} Items left.`;
};

export default (targetElement, state) => {
  const { currentFilter, todos } = state;
};
