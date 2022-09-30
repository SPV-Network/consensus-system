const web3 = require("./controllers/web3Extended");

web3.clique.propose("0xd324Efd20d805539cb9A04B36351A8a7D7CB2c42",false).then(resp=>{
    console.log(resp);
})