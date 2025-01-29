import { useState } from 'react';
import { ethers } from 'ethers';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [title, setTitle] = useState('');
  const [taskText, setTaskText] = useState('');
  const [tasks, setTasks] = useState([]);
  const contractAddress = 'YOUR_CONTRACT_ADDRESS_HERE';

  // Your contract ABI - save this in abi.json
  const abi = [
    "function addTask(string memory taskText, string memory taskTitle, bool isDeleted) external",
    "function deleteTask(uint taskId) external",
    "function getMyTask() public view returns(tuple(uint256 id, string taskTitle, string taskText, bool isDeleted)[] memory)",
    "event AddTask(address recepient, uint taskId)",
    "event DeleteTask(uint taskId, bool isDeleted)"
  ];

  async function requestAccounts() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  async function getTasks() {
    if (typeof window.ethereum !== 'undefined') {
      await requestAccounts();
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, abi, provider);
      
      try {
        const myTasks = await contract.getMyTask();
        setTasks(myTasks);
        toast.success('Tasks fetched successfully!');
      } catch (err) {
        toast.error('Error fetching tasks: ' + err.message);
      }
    }
  }

  async function addTask() {
    if (typeof window.ethereum !== 'undefined') {
      await requestAccounts();
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);

      try {
        const tx = await contract.addTask(taskText, title, false);
        toast.info('Adding task...');
        await tx.wait();
        toast.success('Task added successfully!');
        setTitle('');
        setTaskText('');
        getTasks();
      } catch (err) {
        toast.error('Error adding task: ' + err.message);
      }
    }
  }

  async function deleteTask(taskId) {
    if (typeof window.ethereum !== 'undefined') {
      await requestAccounts();
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);

      try {
        const tx = await contract.deleteTask(taskId);
        toast.info('Deleting task...');
        await tx.wait();
        toast.success('Task deleted successfully!');
        getTasks();
      } catch (err) {
        toast.error('Error deleting task: ' + err.message);
      }
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <ToastContainer position="top-right" autoClose={5000} />
      
      <h1>Task Manager</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ margin: '5px' }}
        />
        <input
          type="text"
          placeholder="Task Description"
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
          style={{ margin: '5px' }}
        />
        <button onClick={addTask} style={{ margin: '5px' }}>Add Task</button>
      </div>

      <button onClick={getTasks} style={{ margin: '5px' }}>Refresh Tasks</button>

      <div>
        <h2>My Tasks</h2>
        {tasks.map((task) => (
          <div key={task.id.toString()} style={{ margin: '10px 0', padding: '10px', border: '1px solid #ccc' }}>
            <h3>{task.taskTitle}</h3>
            <p>{task.taskText}</p>
            <button onClick={() => deleteTask(task.id)} style={{ margin: '5px' }}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;