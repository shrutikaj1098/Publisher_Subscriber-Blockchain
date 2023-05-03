import web3 from "./web3";

const abi = [
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "PersonDetails",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_userID",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_topicID",
                "type": "uint256"
            }
        ],
        "name": "deleteTopic",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_pubid",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_topicid",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_eventid",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "hash",
                "type": "string"
            }
        ],
        "name": "publishData",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_userID",
                "type": "uint256"
            }
        ],
        "name": "registerPerson",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_userID",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_topicID",
                "type": "uint256"
            }
        ],
        "name": "registerTopic",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_subs",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_pub",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_topicid",
                "type": "uint256"
            }
        ],
        "name": "removeSubs",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_pubid",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_topicid",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_eventid",
                "type": "uint256"
            }
        ],
        "name": "retHash",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_subs",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_pub",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_topicid",
                "type": "uint256"
            }
        ],
        "name": "subscription",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "topicRegList",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

const addr = '0x9B951BC3aa17B25Cc45083B1deA825eBA50Cb0a8'; // write the deployed address here

export default new web3.eth.Contract(abi, addr);
