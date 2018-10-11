var MyToken = artifacts.require('TokenTracking')

module.exports = function(deployer) {
  deployer.deploy(MyToken)
}
