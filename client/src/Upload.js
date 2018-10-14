import React from 'react';
import SimpleStorageContract from "./contracts/TokenTracking.json";
import getWeb3 from "./utils/getWeb3";
import truffleContract from "truffle-contract";

class Upload extends React.Component {
  constructor(props) {
    super(props);

    const ipfsScript = document.createElement("script");
    ipfsScript.src = "https://unpkg.com/ipfs-api/dist/index.js";
    ipfsScript.async = true;

    ipfsScript.addEventListener('load', function () {
      window.ipfs = window.IpfsApi('ipfs.infura.io', '5001', {protocol: 'https'})
      console.log("COMPLETED");
    });
  
    document.body.appendChild(ipfsScript);

    this.state = { storageValue: 0, web3: null, accounts: null, contract: null, value: '', imageURL: '', ethVal: ''};
    this.handleUploadImage = this.handleUploadImage.bind(this);
  }

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();
      
      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      
      // Get the contract instance.
      const Contract = truffleContract(SimpleStorageContract);
      Contract.setProvider(web3.currentProvider);
      const instance = await Contract.deployed();
      
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
        );
      console.log(error);
    }
  };

  captureFile =(event) => {
    event.stopPropagation()
    event.preventDefault()
    const file = event.target.files[0]
    let reader = new window.FileReader()

    reader.readAsArrayBuffer(file)
    reader.onloadend = () => this.convertToBuffer(reader)
  };

  //Convert the file to buffer to store on IPFS
  convertToBuffer = async(reader) => {
      //file is converted to a buffer for upload to IPFS
      const buffer = await Buffer.from(reader.result);
      //set this buffer-using es6 syntax
      this.setState({buffer});
  };

  handleUploadImage = async (event) => {
    event.preventDefault();
    this.setState({imageURL: "uploading file..."})
    //save document to IPFS,return its hash#, and set hash# to state
    await window.ipfs.files.add(this.state.buffer, async (err, res) => {
      var ipfsHash = res[0].hash
      this.setState({imageURL: ipfsHash})
      var val = "tes"
      const { accounts, contract } = this.state;
      
      // Stores a given value, 5 by default.
      var txVal = await contract.createFile.sendTransaction(ipfsHash, val, { from: accounts[0] });
      console.log("OK", txVal);

      // // Get the value from the contract to prove it worked.
      var response = await contract.getFile(val, { from: accounts[0] });
      console.log("BOB", response);
      // Update state with the result.
      this.setState({ethVal: response });
      console.log(err,res);
    })
  };

  render() {
    return (
      <form onSubmit={this.handleUploadImage}>
        <div>
          <input type="file" onChange = {this.captureFile} />
        </div>
        <div>
          <input ref={(ref) => { this.fileName = ref; }} type="text" placeholder="Enter the desired name of file" />
        </div>
        <div>
          <button>Upload</button>
        </div>
        <p> {this.state.imageURL} </p>
        <p> {this.state.ethVal} </p>
      </form>
    );
  }
}

export default Upload;