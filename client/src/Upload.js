import React from 'react';

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

    this.state = { imageURL: ''};

    this.handleUploadImage = this.handleUploadImage.bind(this);
  }

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
    await window.ipfs.files.add(this.state.buffer, (err, res) => {
      this.setState({imageURL: res[0].hash})
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
      </form>
    );
  }
}

export default Upload;