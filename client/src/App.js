import React, { Component } from "react";
import SimpleStorageContract from "./contracts/TokenTracking.json";
import getWeb3 from "./utils/getWeb3";
import truffleContract from "truffle-contract";

import "./App.css";

// class Form extends Component{
//   constructor(props){
//     super(props);
//     this.state = {value: ''};

//     this.handleChange = this.handleChange.bind(this);
//     this.handleSubmit = this.handleSubmit.bind(this);
//   }

// }

class App extends Component {

  constructor(){
    super();

    this.state = { storageValue: 0, web3: null, accounts: null, contract: null, value: '' };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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
  
  runExample = async (val) => {
    console.log("BOB");
    
    const { accounts, contract } = this.state;
    console.log(contract);
    
    // Stores a given value, 5 by default.
    var response1 = await contract.createFile.sendTransaction(val, val, { from: accounts[0] });
    console.log("OK", response1);
    
    // Get the value from the contract to prove it worked.
    var response = await contract.getFile(val, { from: accounts[0] });
    console.log("BOB", response);
    
    // Update state with the result.
    this.setState({ storageValue: response });
  };

  handleChange(event) {
    
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    
    alert('A name was submitted: ' + this.state.value);

    this.runExample(this.state.value);
    
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Add a file</h1>

        <form onSubmit={this.handleSubmit}>
          <label>
            Name:
            <input type="text" value={this.state.value} onChange={this.handleChange} />
          </label>
          <input type="submit" value="Submit" />
        </form> 

      <div>Url of file: {this.state.storageValue}</div>

      </div>
    );
  }
}

export default App;
