const Web3 = require("web3");
const { RPC_LINK } = require("./constants");
// const web3 = new Web3(new Web3.providers.IpcProvider('/app/geth.ipc'));
const web3 = new Web3(RPC_LINK);
web3.extend({
    property: 'clique',
    methods: [{
        name: 'getSigners',
        call: 'clique_getSigners',
        params: 1,
        inputFormatter: [web3.extend.formatters.inputDefaultBlockNumberFormatter]
    },{
        name: 'status',
        call: 'clique_status',
        params: 0
    },
    {
        name: 'propose',
        call: 'clique_propose',
        params: 2,
        inputFormatter: [web3.extend.formatters.inputAddressFormatter,null]
    }]
});

module.exports = web3;