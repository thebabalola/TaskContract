// import { useState, useEffect, useCallback } from "react";
// import { ethers } from "ethers";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import abi from "./abi.json";

// const contractAddress = "0x89A2C29B55Fb31E5739682f5b9aE3a004E7a1a54";

// function App() {
//   const [account, setAccount] = useState(null);
//   const [title, setTitle] = useState("");
//   const [taskText, setTaskText] = useState("");
//   const [tasks, setTasks] = useState([]);

//   // Connect wallet function
//   async function connectWallet() {
//     if (window.ethereum) {
//       try {
//         const provider = new ethers.BrowserProvider(window.ethereum);
//         const signer = await provider.getSigner();
//         setAccount(await signer.getAddress());
//         toast.success("Wallet connected successfully!");
//       } catch (err) {
//         toast.error("Failed to connect wallet: " + err.message);
//       }
//     } else {
//       toast.error("MetaMask not detected!");
//     }
//   }

//   // Fetch tasks from contract
//   const getTasks = useCallback(async () => {
//     if (!account) return toast.error("Connect your wallet first!");
//     try {
//       const provider = new ethers.BrowserProvider(window.ethereum);
//       const contract = new ethers.Contract(contractAddress, abi, provider);
//       const myTasks = await contract.getMyTask();
//       console.log(myTasks); // Debugging - to check the raw data returned
//       setTasks(myTasks);
//       toast.success("Tasks fetched successfully!");
//     } catch (err) {
//       toast.error("Error fetching tasks: " + err.message);
//     }
//   }, [account]);

//   // Add a new task
//   async function addTask() {
//     if (!account) return toast.error("Connect your wallet first!");
//     if (!title || !taskText) return toast.error("Please fill all fields!");

//     try {
//       const provider = new ethers.BrowserProvider(window.ethereum);
//       const signer = await provider.getSigner();
//       const contract = new ethers.Contract(contractAddress, abi, signer);
//       const tx = await contract.addTask(taskText, title, false);
//       toast.info("Adding task...");
//       await tx.wait();
//       toast.success("Task added successfully!");
//       setTitle("");
//       setTaskText("");
//       getTasks(); // Fetch updated tasks
//     } catch (err) {
//       toast.error("Error adding task: " + err.message);
//     }
//   }

//   // Delete a task
//   async function deleteTask(taskId) {
//     if (!account) return toast.error("Connect your wallet first!");

//     try {
//       const provider = new ethers.BrowserProvider(window.ethereum);
//       const signer = await provider.getSigner();
//       const contract = new ethers.Contract(contractAddress, abi, signer);
//       const tx = await contract.deleteTask(taskId);
//       toast.info("Deleting task...");
//       await tx.wait();
//       toast.success("Task deleted successfully!");
//       getTasks(); // Fetch updated tasks
//     } catch (err) {
//       toast.error("Error deleting task: " + err.message);
//     }
//   }

//   // Fetch tasks when the account changes
//   useEffect(() => {
//     if (account) getTasks();
//   }, [account, getTasks]); // Add getTasks to dependencies

//   return (
//     <div style={{ padding: "20px", fontFamily: "Arial" }}>
//       <ToastContainer position="top-right" autoClose={3000} />
      
//       <h1 style={{ textAlign: "center" }}>Task Manager</h1>
      
//       {!account ? (
//         <button onClick={connectWallet} style={{ padding: "10px", cursor: "pointer", marginBottom: "10px" }}>
//           Connect Wallet
//         </button>
//       ) : (
//         <p>Connected: {account}</p>
//       )}

//       <div style={{ marginBottom: "10px" }}>
//         <input
//           type="text"
//           placeholder="Task Title"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           style={{ padding: "5px", marginRight: "5px" }}
//         />
//         <input
//           type="text"
//           placeholder="Task Description"
//           value={taskText}
//           onChange={(e) => setTaskText(e.target.value)}
//           style={{ padding: "5px", marginRight: "5px" }}
//         />
//         <button onClick={addTask} style={{ padding: "5px", cursor: "pointer" }}>
//           Add Task
//         </button>
//       </div>

//       <button onClick={getTasks} style={{ padding: "5px", cursor: "pointer", marginBottom: "10px" }}>
//         Refresh Tasks
//       </button>

//       <div>
//         <h2>My Tasks</h2>
//         {tasks.length === 0 ? <p>No tasks found</p> : null}
//         {tasks.map((task) => (
//           <div key={task.id.toString()} style={{ padding: "10px", border: "1px solid #ccc", marginBottom: "5px" }}>
//             <h3>{task.taskTitle}</h3>
//             <p>{task.taskText}</p>
//             <button onClick={() => deleteTask(task.id)} style={{ padding: "5px", cursor: "pointer" }}>
//               Delete
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default App;
