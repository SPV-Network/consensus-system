// const express = require('express');
// const { addSigner, removeSigner } = require('./controllers/commands');
// const app = express();

// app.use(express.json());
// app.get('/',(req,res)=>{
//     res.send("Home Page!")
// })
// app.post('/add-validator',addSigner)
// app.post('/remove-validator',removeSigner)
// app.listen(8080)

const SignerOptions = require("./controllers/commands");
var Web3 = require('web3');
var Web3Extended = require('./controllers/web3Extended');
var LINK = require("./controllers/constants");

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
    }
    subscribe()
    {
        let LogsOptions = {
            address: '0x33A3f9F68624d8A031BBb807be45DD2411C19507' //paste contract address here 300000000000000
        }
        let web3 = new Web3(this.ws_link);
        return web3.eth.subscribe('logs', LogsOptions)
        // let web3 = new Web3(this.ws_link);
        // return web3.eth.subscribe('newBlockHeaders')
        
    }
    start()
    {
        let subscription = this.subscribe()
        .on("connected", function(subscriptionId){
            console.log("ID ", subscriptionId);
        })
        .on("data", async(log)=>{
            await this.decodeLogs(log)
            console.log(log);
        });
        /**Test code block starts */
        // let subscription = this.subscribe()
        // .on("connected", function (subscriptionId) {
        //     console.log("ID:", subscriptionId);
        // })
        // .on("data", async (blockHeader) => {
        //     console.log("New Block : ", blockHeader.number);
        //     let web3 = new Web3(this.rpc_link);
        //     let e = await web3.eth.getTransactionReceipt('0x609b28d8b917edd3ec46130c06c7da4c3415a13d56e69c5f946f689b694ce749');
        //     await this.decodeLogs(e.logs[0]);
        // })
        // .on("error", console.error);
         /**Test code block ends */
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
