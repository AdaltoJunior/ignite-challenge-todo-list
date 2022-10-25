import { ChangeEvent, FormEvent, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { PlusCircle, Trash } from 'phosphor-react';

import { Header } from './components/Header';
import imageClipboard from './assets/image-clipboard.png';

import styles from './App.module.css';

import './styles/global.css';

interface Task {
  id: string;
  text: string;
  isCompleted: boolean;
}

export function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [inputText, setInputText] = useState('');

  function handleAddTask(event: FormEvent) {
    event.preventDefault();

    if (!inputText.trim()) {
      setInputText('');
      return;
    }

    const newTask: Task = {
      id: uuidv4(),
      text: inputText,
      isCompleted: false
    };

    setTasks((state) => [newTask, ...state]);
    setInputText('');
  }
  
  function handleRemoveTask(id: string) {
    const filteredTasks = tasks.filter(task => task.id !== id);
    setTasks(filteredTasks);
  }

  function handleCompleteTask(id: string) {
    const modifiedTasks = tasks.map(task => {
      if (task.id === id) task.isCompleted = !task.isCompleted;
      return task;
    });

    setTasks(modifiedTasks);
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    setInputText(event.target.value);
  }

  const completedTasksCounter = tasks.reduce((acc, task) => {
    return task.isCompleted ? acc + 1 : acc;
  }, 0);

  return (
    <div>
      <Header />
      <div className={styles.container}>
        <form className={styles.tasksForm} onSubmit={handleAddTask}>
          <input placeholder='Adicione uma tarefa' onChange={handleInputChange} value={inputText} />
          <button type='submit'>
            Criar
            <PlusCircle size={18} />
          </button>
        </form>

        <div className={styles.tasks}>
          <div className={styles.tasksInfo}>
            <div className={styles.tasksCreated}>
              <p>Tarefas criadas</p>
              <span className={styles.tasksInfoCounter}>{tasks.length}</span>
            </div>
            <div className={styles.tasksDone}>
              <p>Concluídas</p>
              <span className={styles.tasksInfoCounter}>
                {completedTasksCounter} {tasks.length > 0 && `de ${tasks.length}`}
              </span>
            </div>
          </div>
          {tasks.length === 0 && (
            <div className={styles.tasksEmpty}>
              <img src={imageClipboard} alt="" />
              <p>Você ainda não tem tarefas cadastradas</p>
              <p>Crie tarefas e organize seus itens a fazer</p>
            </div>
          )}
          {tasks.length > 0 && (
            <ul className={styles.tasksList}>
              {tasks.map(task => (
                <li key={task.id} className={styles.tasksList__task}>
                  <input type="checkbox" onChange={() => handleCompleteTask(task.id)} />
                  <p>{task.text}</p>
                  <button onClick={() => handleRemoveTask(task.id)}>
                    <Trash size={20} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}