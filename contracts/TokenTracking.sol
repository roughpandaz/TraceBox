pragma solidity ^0.4.24;
// NOTE: This must be included in order for abi.encodePacked() to work
// https://blog.ricmoo.com/solidity-abiv2-a-foray-into-the-experimental-a6afd3d47185
pragma experimental ABIEncoderV2;

contract TokenTracking {

  address owner;

  struct Property {
    string url;
    string name;
  }

  mapping (bytes32 => Property) properties;

  constructor() public {
    owner = msg.sender;
  }

  modifier onlyOwner {
    require(msg.sender == owner, "Must be owner");
    _;
  }

  function createFile(string url, string name) public returns(bytes32){
    // Create hash
    bytes32 key = keccak256(abi.encodePacked(name));

    require(bytes(url).length > 0, "url cannot be empty");
    require(bytes(properties[key].url).length == 0, "property already exists");

    properties[key].url = url;
    properties[key].name = name;

    return key;
  }

  function getFile(string name) public view returns(string){

    bytes32 key = keccak256(abi.encodePacked(name));

    return properties[key].url;
  }

}
