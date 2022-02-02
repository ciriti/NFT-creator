import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./getWeb3";
import ipfs from './ipfs'
import bs58 from 'bs58'
import { useState } from "react";
import ReactDOM from 'react-dom';

import "./App.css";

class App extends Component {
  state = { 
    ipfsHash: '',
    storageValue: 0, 
    web3: null,
    buffer: null, 
    accounts: null, 
    contract: null ,
    ipfsToEncode: null,
    ipfsEncoded: null,
    bs58ToDecode: null,
    bs58Decoded: null
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  captureFile = (event) => {
    event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) })
      console.log('buffer', this.state.buffer)
    }
  }

  onSubmit = async (event) => {
    const { accounts, contract, web3 } = this.state;
    event.preventDefault()
    console.log("start add");
    
    let result = await ipfs.add(this.state.buffer);
    console.log("result", result.path)
    
    let bs58ifpsHash = this.getBytes32FromIpfsHash(result.path)
    console.log("into bs58ifpsHash", bs58ifpsHash)
    console.log("reverse bs58ifpsHash", this.getIpfsHashFromBytes32(bs58ifpsHash));
    
    
    console.log("ifpsHash", bs58ifpsHash);

    // Stores a given value, 5 by default.
    
    await contract.methods.save(bs58ifpsHash).send({ from: accounts[0] });
    // await contract.methods.set(result).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    // const response = await contract.methods.get().call();

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.getOwner(bs58ifpsHash).call();

    console.log("getOwner", response);

    let back2ifpsHash = this.getIpfsHashFromBytes32(bs58ifpsHash)
    this.setState({ ipfsHash:  back2ifpsHash})
    console.log("out bs58ifpsHash", back2ifpsHash)
  }

  encode = (event) => {
    console.log(event);
  }

  decode = (event) => {
    console.log(event);
  }

  getBytes32FromIpfsHash = (ipfsListing) => {
    return "0x"+bs58.decode(ipfsListing).slice(2).toString('hex')
  }
  
  // Return base58 encoded ipfs hash from bytes32 hex string,
  // E.g. "0x017dfd85d4f6cb4dcd715a88101f7b1f06cd1e009b2327a0809d01eb9c91f231"
  // --> "QmNSUYVKDSvPUnRLKmuxk9diJ6yS96r1TrAXzjTiBcCLAL"
  
  getIpfsHashFromBytes32 = (bytes32Hex) => {
    // Add our default ipfs values for first 2 bytes:
    // function:0x12=sha2, size:0x20=256 bits
    // and cut off leading "0x"
    const hashHex = "1220" + bytes32Hex.slice(2)
    const hashBytes = Buffer.from(hashHex, 'hex');
    const hashStr = bs58.encode(hashBytes)
    return hashStr
  }

  handleSubmitDec = (event) => {
    event.preventDefault();
    console.log(this.state.bs58ToDecode);
    try{
      this.setState({
        bs58Decoded: this.getIpfsHashFromBytes32(this.state.bs58ToDecode)
      });
    }catch (error) {
      alert("The bs58 value is not valid!");
        console.error(error);
    }
  }

  handleSubmitEnc = (event) => {
    event.preventDefault();
    console.log(this.state.ipfsToEncode);
    try{
      this.setState({
        ipfsEncoded: this.getBytes32FromIpfsHash(this.state.ipfsToEncode)
      });
    }catch (error) {
        alert("The IPFS value is not valid!");
        console.error(error);
    }
  }

  updateInputValue(evt) {
    // const val = evt.target.value;
    
    // ...
    this.setState({
      ipfsToEncode: evt.target.value
    });
    console.log(this.state.ipfsToEncode);
  }

  updateDecodedInputValue(evt) {
    // const val = evt.target.value;
    // ...
    this.setState({
      bs58ToDecode: evt.target.value
    });
    console.log(this.state.bs58ToDecode);
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Your Image</h1>
              <p>This image is stored on IPFS & The Ethereum Blockchain!</p>
              <img src={`https://ipfs.io/ipfs/${this.state.ipfsHash}`} alt=""/>
              <h2>Upload Image</h2>
              <form onSubmit={this.onSubmit} >
                <input type='file' onChange={this.captureFile} />
                <input type='submit' />
              </form>
              <h4>Your Address: {this.state.accounts[0]}</h4>
              <h4>Your IPFS: {this.state.ipfsHash}</h4>
              <h4><a href={`https://ipfs.io/ipfs/${this.state.ipfsHash}`} target="_blank">Your IPFS Link</a></h4>
              
              <br></br><br></br>
              <h1>Bs58 converter</h1>

              <br></br><br></br><br></br>
              <form onSubmit={this.handleSubmitEnc}>
                <label>IPFS Id:
                <input onChange={evt => this.updateInputValue(evt)}/>
                </label>
                <input type="submit" />
              </form>
              <h4>IPFS encoded to bs58: </h4> {this.state.ipfsEncoded}

              <br></br><br></br><br></br><br></br>
              <form onSubmit={this.handleSubmitDec}>
                <label>bs58:
                <input  onChange={evt => this.updateDecodedInputValue(evt)}/>
                </label>
                <input type="submit" />
              </form>
              <h4>bs58 decoded to IPFS: </h4> {this.state.bs58Decoded}
      </div>
    );
  }
}

export default App;
