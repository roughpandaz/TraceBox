# TraceBox

Decentralized tool that allows users to store files on IPFS and to store a tamper proof reference on the Thunder Blockchain.

## Interface
![Demo](https://user-images.githubusercontent.com/3782456/46992252-25787f00-d0d7-11e8-8476-08257b513ee3.gif)

Processes:
1. Upload file to IPFS
2. Store Hash and FileID to Smart Contract
3. Display Hash and Successful Transaction in U.I

## Development
You will need to install metamask, and import the private keys from ganache test blockchain.

```sh

# Run ganache-cli in separate terminal
npm run ganache

# Deploy storage contract
npm run devDeploy

# Deploy storage contract
cd client

# Start interface
npm start
```
