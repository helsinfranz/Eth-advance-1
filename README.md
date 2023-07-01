# Eth-Advance Assignment

In this project we are going to deploy the contract and then use it in the frontend using Ethers.js

## Description

TokenVesting.sol is the contract which needs to be deployed to any testnet of your choice and then update the contract abi and address in the frontend code, thats it.

## Getting Started

## Initialize

1. Run ``npm i``
2. Go to remix or use hardhat and run the script provided to deploy it :-)
3. Now change the abi in the artifact folder and change the address in the js files.

### Executing program

1. Run ``npm run dev``
2. go to admin pages and use the applications as per the details and go in this order as it was in the question
   ```org_register -> org_enlist -> org_token_allocate -> org_whitelist```
3. After executing all the above steps you can go to the client page and use your client account in metamast (Their will be 2 accounts org and client account for this question).
4. And you can withdraw the tokens from there, if you have selected the client to be True in whitelist.
