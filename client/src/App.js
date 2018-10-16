import React, { Component } from "react";
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';

import SimpleStorageContract from "./contracts/TokenTracking.json";
import getWeb3 from "./utils/getWeb3";
import truffleContract from "truffle-contract";

// import Upload from "./Upload";

import "./App.css";

class App extends Component {

  constructor(){
    super();

    this.state = {
      storageValue: 0,
      web3: null,
      accounts: null, 
      contract: null, 
      value: '', 
      imageURL: '', 
      ethVal: '',
      showResults: false
    };

    const ipfsScript = document.createElement("script");
    ipfsScript.src = "https://unpkg.com/ipfs-api/dist/index.js";
    ipfsScript.async = true;

    ipfsScript.addEventListener('load', function () {
      window.ipfs = window.IpfsApi('ipfs.infura.io', '5001', {protocol: 'https'})
      console.log("COMPLETED");
    });
  
    document.body.appendChild(ipfsScript);
    
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

    console.log("BOB", this.state.showResults);
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

  captureFileName = (event) =>{
    this.setState({fileName: event.target.value});
  }

  //Convert the file to buffer to store on IPFS
  convertToBuffer = async(reader) => {
      //file is converted to a buffer for upload to IPFS
      const buffer = await Buffer.from(reader.result);
      //set this buffer-using es6 syntax
      this.setState({buffer});
  };

  handleUploadImage = async (event) => {
    event.preventDefault();

    //save document to IPFS,return its hash#, and set hash# to state
    await window.ipfs.files.add(this.state.buffer, async (err, res) => {
      const { accounts, contract } = this.state;

      if (err){
        this.setState({imageURL: "Issue uploading IPFS HASH"});
        console.error(err);
        return;
      }

      this.setState({showResults: true})
      // Set IPFS hash
      var ipfsHash = res[0].hash
      this.setState({imageURL: ipfsHash})

      var fileName = this.state.fileName
      
      // Stores a given value, 5 by default.
      var response = await contract.createFile.sendTransaction(ipfsHash, fileName, { from: accounts[0] });
      console.log(response.tx)
      // Update state with the result.
      this.setState({ethVal: response.tx });
    })
  };

  render() {
    let results = <div id="results">
                    <p class="heading">File Hash:</p>
                    <p> {this.state.imageURL} </p>
                    <p class="heading"> Transaction ID: </p>
                    <p> {this.state.ethVal} </p>
                  </div>
    let upload = <form>
              <div>
                <Button
                  id="file-upload"
                  // fullWidth="true"
                  variant="flat">
                  <span><i class="icon-attachment"></i>Upload File</span>
                  <input type="file" onChange={this.captureFile}/>
                </Button>
              </div>
              <Input
                id="file-name-input"
                placeholder="File Id"
                onChange = {this.captureFileName}>
              </Input>
              <Button
                id="upload-button"
                variant="raised"
                color="primary"
                fullWidth
                onClick={this.handleUploadImage}>
                Upload
              </Button>
        </form>

    if (!this.state.showResults){
      results = null;
      // upload = upload;
    } else {
      // upload = null;
    }

    return (
      <div className="App">
        <div class="wrapper">
           {upload}
        </div>
        {results}
      </div>
    );
  }
}

// class Results extends Component {
//   render(){
//     return(
//     )
//   }
// }

export default App;
