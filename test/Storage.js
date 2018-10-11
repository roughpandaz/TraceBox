var TokenTracking = artifacts.require("TokenTracking.sol");
var jsSha3 = require("js-sha3");

const testData = {
  file1: {
    url: "www.longurl.com/1231231",
    name: "name1",
    fileID: ""
  },
  file2: {
    url: "www.longurl.com/1231231",
    name: "name2",
    fileID: ""
  }
}

const toBytes = (hexString) => (new String("0x" + hexString)).valueOf();

contract('TokenTracking contract', async () => {

  it("should create successful transaction", async () => {
    let instance = await TokenTracking.deployed();
    let transaction = await instance.createFile(testData.file1.url,testData.file1.name);
    
    assert.ok(transaction.tx.includes("0x"));
  })

  it("should create the correct hash", async () => {
    let instance = await TokenTracking.deployed();
    let transaction = await instance.createFile.call(testData.file2.url,testData.file2.name);

    let expect = toBytes(jsSha3.keccak256(testData.file2.name));
  
    assert.equal(transaction.valueOf(), expect);
  })

  it("should get the correct URL from file ID", async () => {
    let instance = await TokenTracking.deployed();
    let fileUrl = await instance.getFile.call(testData.file1.name);

    let expect = testData.file1.url;

    assert.equal(fileUrl, expect);
  })

})
