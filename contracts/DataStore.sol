pragma solidity ^0.5.0;

contract DataStore {
    mapping (address => string) medical_historical;

    constructor() public {
        medical_historical[tx.origin] = "HASH";
    }

    function getHistorical(address addr) public view returns(string memory) {
        return medical_historical[addr];
    }

    function setHistorical(address addr, string memory hash) public returns(bool success) {
        medical_historical[addr] = hash;
        return true;
    }
}
