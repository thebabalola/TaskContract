import { ethers } from 'ethers';
import { useState, useEffect } from 'react';
import abi from './abi.json';
import { ToastContainer } from 'react-toastify';
import './App.css';

const App = () => {
  const [taskTitle, setTaskTitle] = useState("");
  const [taskText, setTaskText] = useState("");  
  const [tasks, setTasks] = useState([]);
  const myContractAddress = "0x2e7e2f04285Ae3D08ec78836107715EE49E8885e";

  const requestAccounts = async () => { 
    await window.ethereum.request({ method: "eth_requestAccounts" });
  };

  const getTasks = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const coreContract = new ethers.Contract(myContractAddress, abi, signer);
        const taskList = await coreContract.getMyTask();
        setTasks(taskList);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    }
  };

  const addTask = async () => {
    if (window.ethereum) {
      await requestAccounts();
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const coreContract = new ethers.Contract(myContractAddress, abi, signer);

        console.log("Adding Task:", { taskText, taskTitle });

        const tx = await coreContract.addTask(taskText, taskTitle, false);
        await tx.wait();

        setTaskText("");
        setTaskTitle("");

        getTasks();
      } catch (error) {
        console.error("Error adding task:", error);
      }
    }
  };

  const deleteTask = async (taskId) => {
    if (window.ethereum) {
      await requestAccounts();
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const coreContract = new ethers.Contract(myContractAddress, abi, signer);

        console.log("Deleting Task ID:", taskId);

        const tx = await coreContract.deleteTask(taskId);
        await tx.wait();

        getTasks();
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    }
  };

  useEffect(() => {
    getTasks();
  }, []);

  return (
    <div>
      <h1>Task Contract</h1>
      <input type='text' placeholder='Task Title' value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} />
      <input type='text' placeholder='Task Description' value={taskText} onChange={(e) => setTaskText(e.target.value)} />
      <button onClick={addTask}>Add Task</button>

      <h2>My Tasks</h2>
      <ul>
        {tasks.map((task, index) => (
          <li key={index}>
            <strong>{task.taskTitle}:</strong> {task.taskText}
            <button onClick={() => deleteTask(task.id)}> X </button>
          </li>
        ))}
      </ul>

      <ToastContainer />
    </div>
  );
};

export default App;