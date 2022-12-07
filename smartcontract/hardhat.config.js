//https://eth-goerli.g.alchemy.com/v2/Eiv2S95xpSodfle-hAjU6-m6AZMhLWVr
//0x6aBFe92d7B94cd4D0339204b29A883CE868c27b0

require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks:{
    goerli: {
      url: 'https://eth-goerli.g.alchemy.com/v2/Eiv2S95xpSodfle-hAjU6-m6AZMhLWVr',
      accounts: [ '9ca5fdd093f6dc39896b26a66d95c9eab60cb11f7e8d9d8f5ee9c524744ca546' ]
    }
  }
};
