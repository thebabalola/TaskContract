import { ethers } from "ethers"
import { useState, useEffect } from "react"
import abi from "./abi.json"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "./App.css"

const App = () => {
  const [taskTitle, setTaskTitle] = useState("")
  const [taskText, setTaskText] = useState("")
  const [tasks, setTasks] = useState([])
  const [walletConnected, setWalletConnected] = useState(false)
  const contractAddress = "0x2e7e2f04285Ae3D08ec78836107715EE49E8885e"

  async function connectWallet() {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" })
        setWalletConnected(true)
        toast.success("Wallet connected successfully!")
        getMyTask()
      } catch {
        toast.error("Failed to connect wallet.")
      }
    } else {
      toast.error("Please install MetaMask!")
    }
  }

  async function getMyTask() {
    if (window.ethereum && walletConnected) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        const coreContract = new ethers.Contract(contractAddress, abi, signer)

        const taskList = await coreContract.getMyTask()
        setTasks(taskList)
      } catch {
        toast.error("Failed to fetch tasks")
      }
    }
  }

  async function addTask() {
    if (window.ethereum && walletConnected) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        const coreContract = new ethers.Contract(contractAddress, abi, signer)

        const addTasksTx = await coreContract.addTask(taskTitle, taskText, false)
        await addTasksTx.wait()
        toast.success("Task added successfully!")
        getMyTask()
        setTaskTitle("")
        setTaskText("")
      } catch {
        toast.error("Failed to add task")
      }
    } else {
      toast.error("Please connect your wallet first")
    }
  }

  async function deleteTask(taskId) {
    if (window.ethereum && walletConnected) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        const coreContract = new ethers.Contract(contractAddress, abi, signer)

        const deleteTasksTx = await coreContract.deleteTask(taskId)
        await deleteTasksTx.wait()
        toast.success("Task deleted successfully!")
        getMyTask()
      } catch {
        toast.error("Failed to delete task")
      }
    }
  }

  useEffect(() => {
    if (walletConnected) {
      getMyTask()
    }
  }, [walletConnected, getMyTask]) // Added getMyTask to dependencies

  return (
    <div className="app-container">
      <ToastContainer />
      <h1>Task Contract</h1>
      {!walletConnected ? (
        <button onClick={connectWallet} className="connect-wallet-btn">
          Connect Wallet
        </button>
      ) : (
        <>
          <div className="input-container">
            <input
              type="text"
              placeholder="Task Title"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
            />
            <input
              type="text"
              placeholder="Task Description"
              value={taskText}
              onChange={(e) => setTaskText(e.target.value)}
            />
            <button onClick={addTask}>Add Task</button>
          </div>
          <h2>My Tasks</h2>
          <ul className="task-list">
            {tasks.map((task, index) => (
              <li key={index} className="task-item">
                <span>{task.taskText}</span>
                <button onClick={() => deleteTask(task.id)} className="delete-btn">
                  X
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}

export default App

