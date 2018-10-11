const HDWalletProvider = require('truffle-hdwallet-provider')
// const mnemonic = "FAKE PHRASES"

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*" // Match any network id
    }
    // thunder: {
    //   provider: () => new HDWalletProvider(mnemonic, "https://testnet-rpc.thundercore.com:8544"),
    //   network_id: "*",
    //   gas: 3000000,
    //   gasPrice: 50000000000
    // }
  }
};
