# Getting Started

First go into the root directory and run the following command:

```bash

npm install --legacy-peer-deps

```

Then go into the `web3` directory and run the following command:

```bash

npm install

```

Start hardhat node:

```bash

npx hardhat node

```

this will start the hardhat node on `http://localhost:8545/`

Go back to the root directory and run start the local development server:

```bash

npm run dev

```

this will start the local development server on `http://localhost:3000/`

# Testing

You can test the smart contract by isntalling remix IDE and change the workspace to localhost and open the web3 directory.

The `RealEstate.sol` is the smart contract.

After pressing `Ctrl + S` the smart contract will be compiled.

Then you can deploy the smart contract on the local hardhat node by going into `Deploy & Run Transactions` tab and selecting the `Dev - Hardhat Provider` environment.

Then you can deploy the smart contract by pressing the `Deploy` button.

## Be careful!!

After changin the smart contract you have to deploy it again to see the changes, and modify the smart contract address in the .env.local file, then change the contract ABI in `src/abi/RealEstateTokenAbi.json` file.

You can copy the abi from remix of the compiled contract under the solidity compiler tab.

# Features

Right now only the token creation and the asset listing works, since I had to change a lot in the smart contract and changes some tools on the client side as well (wagmi, OrbitDb, etc.)
