import { api } from "./Api";

export async function fetchTasks() {
  const res = await fetch(`http://localhost:8000/tasks`);
  return res.json();
}

export async function createTask(task: { name: string; content: string, userId: number }) {
  const res = await fetch(`http://localhost:8000/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  });
  return res.json();
}

export async function updateTask(id: number, task: { name: string; content: string, userId: number }) {
  const res = await fetch(`http://localhost:8000/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  });
  return res.json();
}

export async function deleteTask(id: number) {
  const res = await fetch(`http://localhost:8000/tasks/${id}`, {
    method: 'DELETE',
  });
  return res.ok;
}
