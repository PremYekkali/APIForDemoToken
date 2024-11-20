const express = require('express');
const Web3 = require('web3');
require('dotenv').config();

const app = express();
const port = 3000;

// Load environment variables
const INFURA_URL = process.env.INFURA_URL; // Infura/Alchemy endpoint
const PRIVATE_KEY = process.env.PRIVATE_KEY; // Private key of the sender account
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS; // Deployed contract address
// ABI of the contract.
const ABI = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "recipient",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "transfer",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "initialSupply",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "decimals",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "isTokenHolder",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "name",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "symbol",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalSupply",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

// Configure web3
const web3 = new Web3(new Web3.providers.HttpProvider(INFURA_URL));

// Contract instance
const contract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);

// Source address and wallet configuration
const sourceAddress = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY).address;

// Middleware to parse JSON
app.use(express.json());

// Endpoint 1: GET /get/:field
app.get('/get/:field/:arg?', async (req, res) => {
  try {
    const { field, arg } = req.params;

    if (typeof contract.methods[field] === 'function') {
      // If the method expects an argument
      const result = arg
        ? await contract.methods[field](arg).call()
        : await contract.methods[field]().call();

      res.json({ field, result });
    } else {
      res.status(400).json({ error: 'Invalid field name or incorrect method usage' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint 2: POST /transfer/:to/:amount
app.post('/transfer/:to/:amount', async (req, res) => {
  try {
    const { to, amount } = req.params;

    const data = contract.methods.transfer(to, amount).encodeABI();
    const tx = {
      from: sourceAddress,
      to: CONTRACT_ADDRESS,
      gas: 2000000,
      data
    };

    const signedTx = await web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

    res.json({ receipt });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
