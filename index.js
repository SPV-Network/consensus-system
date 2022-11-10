const SignerOptions = require("./controllers/commands");
var Web3 = require('web3');
var Web3Extended = require('./controllers/web3Extended');
var LINK = require("./controllers/constants");
const  axios = require("axios");

//abi
const LogAbi = [{
    "indexed": true,
    "internalType": "address",
    "name": "validator",
    "type": "address"
},
{
    "indexed": false,
    "internalType": "uint256",
    "name": "timestamp",
    "type": "uint256"
},
{
    "indexed": false,
    "internalType": "uint256",
    "name": "stakedAmount",
    "type": "uint256"
}];



class LogScanner{
    rpc_link;
    ws_link;
    web3;
    constructor(rpc_link = LINK.RPC_LINK, ws_link = LINK.WS_LINK)
    {
        this.rpc_link = rpc_link;
        this.ws_link = ws_link;
        this.web3 = new Web3(rpc_link);
    }
    subscribe()
    {
        let web3 = new Web3(this.ws_link);
        return web3.eth.subscribe('newBlockHeaders');
    }
    async start()
    {
        console.log("Starting Consensus...");
        this.subscribe()
        .on("connected", function(subscriptionId){
            console.log("ID ", subscriptionId);
        })
        .on("data", async(data)=>{
            // await this.decodeLogs(log)
            // console.log(log);
            let block = await this.web3.eth.getBlock(data.number);
            let sendData = JSON.stringify({
                address: (await this.web3.eth.getAccounts())[0],
                blockNumber: data.number
            })
            // console.log(sendData);
            axios.post(LINK.LINK_ON_URI,sendData,{
                headers:{
                    "Content-Type":"application/json"
                }
            }).then(res=>{
                
            }).catch(e=>{
                // Do nothing
            });
            // console.log("Working on..",block);
            for(let txHash of block.transactions){
                let txData = await this.web3.eth.getTransactionReceipt(txHash);
                // console.log(txData);
                for(let log of txData.logs){
                    if(log.address == '0x0C7afd91c6F3F926a00bFdf4B56716D5Db59Cd27'){
                        await this.decodeLogs(log);
                    }
                }
            }
        });
    }

    async decodeLogs(logs){
        console.log("Log topics[0]", logs.topics[0]);
        let web3 = Web3Extended;
        let topicAdded = "0x6fac2cbdfc6014aeb742f8d066481595055698c3a27d92455d9a4944f3608850";
        let topicRemoved = "0x2197aab07adab5361edb74a7f3ecf4ba176c89f4cd896f45ca0a0313b12a157a";
        if(logs.topics[0] == topicAdded)
        {
            try {
                let decodeData = web3.eth.abi.decodeLog(LogAbi,logs.data,[logs.topics[1]]);
                console.log("Log topic validator added ", decodeData);
                SignerOptions.addSigner(decodeData.validator);
            } catch (error) {
                console.log(error);
            }
        }
        if(logs.topics[0] == topicRemoved)
        {
            try {
                let decodeData = web3.eth.abi.decodeLog(LogAbi,logs.data,[logs.topics[1]]);
                console.log("Log topic validator Removed", decodeData);
                SignerOptions.removeSigner(decodeData.validator)
            } catch (error) {
                console.log(error);
            }
        }
    }
}

let scanner = new LogScanner();
scanner.start();
