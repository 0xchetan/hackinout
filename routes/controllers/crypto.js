var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/JMhe5RjDDwCnEVoSPLLL '));
const EthereumTx = require('ethereumjs-tx');
var util = require('ethereumjs-util');

var abiArray = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"bytes32"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"stop","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"guy","type":"address"},{"name":"wad","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"owner_","type":"address"}],"name":"setOwner","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"src","type":"address"},{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"dst","type":"address"},{"name":"wad","type":"uint128"}],"name":"push","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"name_","type":"bytes32"}],"name":"setName","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"wad","type":"uint128"}],"name":"mint","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"src","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"stopped","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"authority_","type":"address"}],"name":"setAuthority","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"src","type":"address"},{"name":"wad","type":"uint128"}],"name":"pull","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"wad","type":"uint128"}],"name":"burn","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"bytes32"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"start","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"authority","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"src","type":"address"},{"name":"guy","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[{"name":"symbol_","type":"bytes32"}],"payable":false,"type":"constructor"},{"anonymous":true,"inputs":[{"indexed":true,"name":"sig","type":"bytes4"},{"indexed":true,"name":"guy","type":"address"},{"indexed":true,"name":"foo","type":"bytes32"},{"indexed":true,"name":"bar","type":"bytes32"},{"indexed":false,"name":"wad","type":"uint256"},{"indexed":false,"name":"fax","type":"bytes"}],"name":"LogNote","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"authority","type":"address"}],"name":"LogSetAuthority","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"}],"name":"LogSetOwner","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"}]

// The minimum ABI to get ERC20 Token balance
// Get ERC20 Token contract instance
let tokenAddress = "0xB8c77482e45F1F44dE1745F52C74426C631bDD52";
let walletAddress = "0xaeec6f5aca72f3a005af1b3420ab8c8c7009bac8";


var crypto  ={
    daiBalance: function(addr){
        // The minimum ABI to get ERC20 Token balance
            console.log('Getting contract tokens balance.....');
            var contractAddr = ('F2fa7469A7115800065F8faEF9bFA3688D8e6670');
            var tknAddress = (addr).substring(2);
            var contractData = ('0x40e624d93110a8324920f011b80c6db0fab2b85b' + tknAddress);
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

    transact: function(addr, privateKey, amount){
        var contractAddress = '0x543ff227f64aa17ea132bf9886cab5db55dcaddf';
        const privateKeytoHex = Buffer.from(privateKey, 'hex')
        const myAddress = util.privateToAddress(privateKey)
        var contract = new web3.eth.Contract(abiArray, contractAddress, {from: '0x' + myAddress.toString('hex')})
        const txParams = {
          nonce: '0x21',
          gasPrice: web3.utils.toHex(210000), 
          gasLimit: web3.utils.toHex(210000),
          to: contractAddress, //ERC-20 Token Contract 
          value: '0x00',    
          data: contract.methods.transfer(addr, amount).encodeABI(),
          // EIP 155 chainId - mainnet: 1, ropsten: 3
          chainId: 4
        }

        const tx = new EthereumTx(txParams)
        tx.sign(privateKeytoHex)
        console.log(tx.hash().toString('hex'))
        const serializedTx = tx.serialize()
        web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))

    },
};

module.exports = crypto;


