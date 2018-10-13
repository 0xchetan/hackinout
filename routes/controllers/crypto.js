var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/JMhe5RjDDwCnEVoSPLLL '));
const EthereumTx = require('ethereumjs-tx')


// The minimum ABI to get ERC20 Token balance
// Get ERC20 Token contract instance
let tokenAddress = "0xB8c77482e45F1F44dE1745F52C74426C631bDD52";
let walletAddress = "0xaeec6f5aca72f3a005af1b3420ab8c8c7009bac8";


var crypto  ={
    daiBalance: function(addr){
        // The minimum ABI to get ERC20 Token balance
            console.log('Getting contract tokens balance.....');
            var contractAddr = ('0xB8c77482e45F1F44dE1745F52C74426C631bDD52');
            var tknAddress = (addr).substring(2);
            var contractData = ('0x70a08231000000000000000000000000' + tknAddress);
            web3.eth.call({
                to: contractAddr, 
                data: contractData  
                }, function(err, result) {
                if (result) { 
                    var tokens = web3.utils.toBN(result).toString(); 
                    console.log('Tokens Owned: ' + web3.utils.fromWei(tokens, 'ether'));
                }
                else {
                    console.log(err); // Dump errors here
                }
            });
        },
    transact: function(addr, privateKey){
        //const privateKey = Buffer.from(privateKey, 'hex')
        const txParams = {
          nonce: '0x00',
          gasPrice: '0x09184e72a000', 
          gasLimit: '0x2710',
          to: addr, 
          value: '0x00', 
          data: '0x7f7465737432000000000000000000000000000000000000000000000000000000600057',
          // EIP 155 chainId - mainnet: 1, ropsten: 3
          chainId: 3
        }
        
        const tx = new EthereumTx(txParams)
        tx.sign(privateKey)
        const serializedTx = tx.serialize()
        console.log()
    },
};

module.exports = crypto;


