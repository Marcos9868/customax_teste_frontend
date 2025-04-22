'use client'
import { useState, useEffect, FormEvent } from 'react';
import { fetchTasks, createTask, updateTask, deleteTask } from '../../services/TaskService';

type Task = {
  id: number;
  name: string;
  content: string;
  userId: number;
};

export default function TaskPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskName, setNewTaskName] = useState<string>('');
  const [newTaskContent, setNewTaskContent] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const data = await fetchTasks();
      setTasks(data);
    } catch (err) {
      setError('Erro ao carregar as tarefas.');
      console.error(err);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!newTaskName || !newTaskContent) {
      setError('Preencha todos os campos.');
      return;
    }

    try {
      if (editingTaskId !== null) {
        await updateTask(editingTaskId, { name: newTaskName, content: newTaskContent, userId: 1 });
      } else {
        await createTask({ name: newTaskName, content: newTaskContent, userId: 1  });
      }

      setNewTaskName('');
      setNewTaskContent('');
      setIsModalOpen(false);
      setEditingTaskId(null);

      await loadTasks();
    } catch (err) {
      setError('Erro ao salvar a tarefa.');
      console.error(err);
    }
  };


  const handleEditTask = (task: Task) => {
    setNewTaskName(task.name);
    setNewTaskContent(task.content);
    setEditingTaskId(task.id);
    setIsModalOpen(true);
  };

  const handleDeleteTask = async (id: number) => {
    try {
      await deleteTask(id);
      await loadTasks();
    } catch (err) {
      setError('Erro ao excluir a tarefa.');
      console.error(err);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md px-8 py-10 flex flex-col items-center">
      <h1 className="text-xl font-bold text-center text-gray-700 dark:text-gray-200 mb-8">Task Manager</h1>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {/* Lista de Tarefas */}
      <div className="w-full mb-8">
        <h2 className="text-lg font-medium text-gray-700 dark:text-gray-200">Minhas Tarefas</h2>
        <ul className="space-y-4">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <li key={task.id} className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md shadow-sm flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200">{task.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{task.content}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEditTask(task)} className="text-blue-500 hover:text-blue-600">Editar</button>
                  <button onClick={() => handleDeleteTask(task.id)} className="text-red-500 hover:text-red-600">Excluir</button>
                </div>
              </li>
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400">Nenhuma tarefa disponível.</p>
          )}
        </ul>
      </div>

      {/* Botão para abrir o modal */}
      <button onClick={() => { setIsModalOpen(true); setEditingTaskId(null); }} className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md shadow-sm mb-8">
        Nova Tarefa
      </button>

      {/* Modal para adicionar/editar tarefa */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-10">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg w-96">
            <h2 className="text-xl font-bold text-gray-700 dark:text-gray-200 mb-6">{editingTaskId ? 'Editar Tarefa' : 'Nova Tarefa'}</h2>
            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
              <div>
                <label htmlFor="name" className="text-sm text-gray-700 dark:text-gray-200">Nome:</label>
                <input 
                  type="text" 
                  id="name" 
                  value={newTaskName} 
                  onChange={(e) => setNewTaskName(e.target.value)} 
                  className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label htmlFor="content" className="text-sm text-gray-700 dark:text-gray-200">Conteúdo:</label>
                <textarea 
                  id="content" 
                  value={newTaskContent} 
                  onChange={(e) => setNewTaskContent(e.target.value)} 
                  className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500" 
                />
              </div>
              <div className="flex justify-between gap-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-md">Cancelar</button>
                <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
