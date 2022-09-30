const web3 = require("./web3Extended")

async function addSigner(address){
    web3.clique.propose(address,true).then(resp=>{
        console.log("addSigner ", address);
        return true;
    })
}

async function removeSigner(address){
    web3.clique.propose(address,false).then(resp=>{
        console.log("removeSigner ", address);
        return true;
    })
}

async function getSigners(){
    try{

    }catch{

    }
}

async function getSigner(){
    
}

module.exports = {
    addSigner,removeSigner,getSigners,getSigner
}