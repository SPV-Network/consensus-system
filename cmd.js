const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
// geth attach --exec clique.proposals()
// const child = spawn('geth',['attach','--exec','clique.propose("0xdb739e252e913267b07b79bbcff772e6507a7e4b",true)']);
const child = spawn('geth',['attach','--exec','clique.getProposals()']);
let data = "";
// use child.stdout.setEncoding('utf8'); if you want text chunks
child.stdout.on('data', (chunk) => {
    data+=chunk;
});

// since these are streams, you can pipe them elsewhere
child.stderr.on('data',chunk=>{
    data+=chunk
})

child.on('close', (code) => {
  console.log(data);
});