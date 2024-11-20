
# Token API

A Node.js API to interact with an Ethereum smart contract using **web3.js**. This project provides endpoints to fetch data from getter functions and perform a token transfer from a predefined source address.

---

## Features

- Retrieve values from getter functions of a deployed smart contract.
- Execute a `transfer` function to send tokens from a predefined source address.
- Handles both argument-less and argument-requiring getter functions dynamically.

---

## Prerequisites

1. **Node.js**: Ensure Node.js is installed. [Download here](https://nodejs.org/).
2. **Smart Contract**: Deploy the [DemoToken](#smart-contract-example) Solidity contract and note the deployed contract's address and ABI.
3. **Infura/Alchemy Account**: Get an Ethereum node URL for interacting with the blockchain.

---

## Setup

1. Clone the repository or create the project structure.
2. Create a `.env` file in the root directory:
   ```plaintext
   INFURA_URL=https://<your-infura-or-alchemy-url>
   PRIVATE_KEY=<your-private-key>
   CONTRACT_ADDRESS=<your-deployed-contract-address>
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

---

## Endpoints

### 1. Get Data from a Getter Function

**GET** `/get/:field/:arg?`

- **Description**: Calls a getter function by name, with an optional argument if required.
- **Parameters**:
  - `field` (required): The name of the getter function (e.g., `name`, `balanceOf`).
  - `arg` (optional): The argument for the getter function (e.g., an address for `balanceOf`).
- **Examples**:
  - `GET /get/name` → Fetches the token name.
  - `GET /get/balanceOf/0xRecipientAddress` → Fetches the balance of a specific address.

---

### 2. Transfer Tokens

**POST** `/transfer/:to/:amount`

- **Description**: Transfers tokens from the configured source address to the specified recipient.
- **Parameters**:
  - `to` (required): The recipient's address.
  - `amount` (required): The amount of tokens to transfer.
- **Example**:
  - `POST /transfer/0xRecipientAddress/100` → Sends 100 tokens to the specified address.

---

## Response Format

- **Success**: Returns the result of the transaction or the value from the getter.
- **Error**: Returns an error message with details.

---

## Example Usage

1. **Start the Server**:
   ```bash
   npm start
   ```

2. **Test the Endpoints**:
   - Use a tool like [Postman](https://www.postman.com/) or `curl` to interact with the API.
   - Example using `curl`:
     ```bash
     curl http://localhost:3000/get/name
     curl http://localhost:3000/get/balanceOf/0xRecipientAddress
     curl -X POST http://localhost:3000/transfer/0xRecipientAddress/100
     ```

---

## Smart Contract Example

Deploy this Solidity contract before using the API:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DemoToken {
    string public name = "DemoToken";
    string public symbol = "DTK";
    uint8 public decimals = 18;
    uint256 public totalSupply;
    mapping(address => uint256) private balances;

    event Transfer(address indexed from, address indexed to, uint256 value);

    constructor(uint256 initialSupply) {
        totalSupply = initialSupply * (10 ** uint256(decimals));
        balances[msg.sender] = totalSupply;
    }

    function balanceOf(address account) public view returns (uint256) {
        return balances[account];
    }

    function transfer(address recipient, uint256 amount) public returns (bool) {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        balances[recipient] += amount;
        emit Transfer(msg.sender, recipient, amount);
        return true;
    }
}
```

---

## Project Structure

```
.
├── Premapitest.js   # Main application file
├── package.json     # Node.js package file
├── .env             # Environment variables
├── README.md        # Project documentation
```

---

## Dependencies

- **express**: Web framework for Node.js.
- **web3**: Library to interact with the Ethereum blockchain.
- **dotenv**: To manage environment variables securely.

---

## Run the Application

1. Start the server:
   ```bash
   npm start
   ```
2. The server will run on `http://localhost:3000`.

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.
