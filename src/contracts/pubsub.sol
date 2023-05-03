// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract PubSub{

    struct PubData{
        uint eventID;
        bytes32 hash;
    }

    // register persons
    uint  []  public  PersonDetails;

    // registering topics created by a person
    mapping(uint => uint []) public topicRegList;

    // registering publishment data
    mapping(uint => mapping(uint => PubData [])) pubData;

    // subscription mapping
    mapping(uint => mapping(uint => uint [])) subData;

    // fn to register a person
    function registerPerson(uint _userID) public{
        PersonDetails.push(_userID);
    }

    // fn to register a topic
    function registerTopic(uint _userID, uint _topicID) public{
        topicRegList[_userID].push(_topicID);
    }

    // fn to delete a topic registration
    function deleteTopic(uint _userID, uint _topicID) public{
        for(uint i = 0; i < topicRegList[_userID].length; i+= 1){
            if(topicRegList[_userID][i] == _topicID){
                delete topicRegList[_userID][i];
                break;
            }
        }

        delete pubData[_userID][_topicID];
    }

    // fn to publish data
    function publishData(uint _pubid, uint _topicid, uint _eventid, bytes32 hash) public{
        pubData[_pubid][_topicid].push(PubData(_eventid, hash));
    }

    // suscription
    function subscription(uint _subs, uint _pub, uint _topicid) public {
        subData[_subs][_pub].push(_topicid);
    }

    // remove subscription
    function removeSubs(uint _subs, uint _pub, uint _topicid) public {
        for(uint i = 0; i < subData[_subs][_pub].length; i+= 1){
            if(subData[_subs][_pub][i] == _topicid){
                delete subData[_subs][_pub][i];
                break;
            }
        }
    }

    function retHash(uint _pubid, uint _topicid, uint _eventid) public view returns(bytes32) {
        for(uint i = 0; i < pubData[_pubid][_topicid].length; i+= 1){
            if(pubData[_pubid][_topicid][i].eventID == _eventid){
                return pubData[_pubid][_topicid][i].hash;
            }
        }

        bytes32 d;
        return d;
    }

}