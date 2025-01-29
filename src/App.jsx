
import { useState } from 'react';
import { ethers } from 'ethers';
import abi from './abi.json';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState('');
  const contractAddress = '0xd29cB566b7ea69c60920183444ddAf4835C5d818';

  async function requestAccounts() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  async function getBalance() {
    if (typeof window.ethereum !== 'undefined') {
      await requestAccounts();
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, abi, provider);
      try {
        const contractBalance = await contract.getBalance();
        setBalance(ethers.formatEther(contractBalance));
        toast.success('Balance fetched successfully!');
      } catch (err) {
        toast.error('Error fetching balance: ' + err.message);
      }
    }
  }

  async function deposit() {
    if (typeof window.ethereum !== 'undefined') {
      await requestAccounts();
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);
      try {
        const tx = await contract.deposit({ value: ethers.parseEther(amount) });
        toast.info('Depositing...');
        await tx.wait();
        toast.success('Deposit successful!');
        setAmount('');
        getBalance();
      } catch (err) {
        toast.error('Error depositing: ' + err.message);
      }
    }
  }

  async function withdraw() {
    if (typeof window.ethereum !== 'undefined') {
      await requestAccounts();
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);
      try {
        const tx = await contract.withdraw(ethers.parseEther(amount));
        toast.info('Withdrawing...');
        await tx.wait();
        toast.success('Withdrawal successful!');
        setAmount('');
        getBalance();
      } catch (err) {
        toast.error('Error withdrawing: ' + err.message);
      }
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <ToastContainer position="top-right" autoClose={5000} />
      
      <h1>Ethereum Wallet</h1>
      <p>Contract Balance: {balance} ETH</p>
      
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Amount in ETH"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{ margin: '5px' }}
        />
        <button onClick={deposit} style={{ margin: '5px' }}>Deposit</button>
        <button onClick={withdraw} style={{ margin: '5px' }}>Withdraw</button>
      </div>
      <button onClick={getBalance} style={{ margin: '5px' }}>Refresh Balance</button>
    </div>
  );
}

export default App;
