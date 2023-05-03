import { useState } from "react";
import pubsub from "../contracts/pubsub";
import { sha256 } from 'js-sha256';

function Publish(props) {

    const [publishData, setPublishData] = useState([]);

    // create topic form values
    const [createTopicData, setCreateTopicData] = useState({
        userid: -1,
        name: "",

    });

    // delete topic form values
    const [deleteTopicData, setDeleteTopicData] = useState({
        topicid: -1,
        userid: -1,

    })

    // publish data form values
    const [pubTopicData, setPubTopicData] = useState({
        topicid: -1,
        data: "",
        userid: -1,
    });


    // handle form for create data
    const handleChangeOfFiledsForCreateData = (event) => {
        setCreateTopicData({ ...createTopicData, [event.target.name]: event.target.value });
    }

    // handle form for delete data
    const handleChangeOfFiledsForDeleteData = (event) => {
        setDeleteTopicData({ ...deleteTopicData, [event.target.name]: parseInt(event.target.value) });
    }

    // register topic in solidity
    const regTopicSol = async (_userid, _topicid, _addr) => {
        await pubsub.methods.registerTopic(_userid, _topicid).send({ from: _addr, gas: 1000000 });
    }

    // register new topic
    const CreateTopic = async (event) => {
        event.preventDefault();
        createTopicData.userid = props.id;
        const res = await fetch("http://localhost:4000/registertopic", {
            method: "POST",
            body: JSON.stringify(createTopicData),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = JSON.parse(await res.text());

        regTopicSol(props.id, data.topicid, data.addr);
    }

    // delete topic from solidity
    const delTopicSol = async (_userid, _topicid, _addr) => {
        await pubsub.methods.deleteTopic(_userid, _topicid).send({ from: _addr, gas: 1000000 });
    }

    // delete a topic
    const DeleteTopic = async (event) => {
        event.preventDefault();
        deleteTopicData.userid = props.id;

        const res = await fetch("http://localhost:4000/deletetopic", {
            method: "POST",
            body: JSON.stringify(deleteTopicData),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = JSON.parse(await res.text());
        if (data.val == -1) {
            console.log("No such topic to be deleted");
        }

        else {
            delTopicSol(props.id, deleteTopicData.topicid, data.addr);
            console.log("Deleted Successfully");
        }

    }

    // fn to get all the topics user is publishing
    const getPublishedData = async () => {
        const publishmentData = await fetch("http://localhost:4000/getpublishedtopics", {
            method: "POST",
            body: JSON.stringify({ userid: props.id }),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = JSON.parse(await publishmentData.text());

        setPublishData(data);

    }

    // publish data in solidity
    const pubDataSol = async (_pubid, _topicid, _eventid, _hash, _addr) => {
        await pubsub.methods.publishData(_pubid, _topicid, _eventid, _hash).send({ from: _addr, gas: 1000000 });
    }

    // publish some data in some topic
    const PublishMe = async (event) => {
        event.preventDefault();

        pubTopicData.userid = props.id;

        const res = await fetch("http://localhost:4000/publishdata", {
            method: "POST",
            body: JSON.stringify(pubTopicData),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = (await res.text());
        const data1 = JSON.parse(data);

        console.log(data1);
        if (data1.val == -1) {
            console.log("Invalid PubID/TopicID");
        }
        else {
            console.log(sha256(pubTopicData.data));

            pubDataSol(props.id, pubTopicData.topicid, data1.eventid, sha256(pubTopicData.data), data1.addr);

        }

    }

    return (<>

        

    


<h2 class="h-100 d-flex align-items-center justify-content-center">Publish</h2><br></br>
<table>
                
                <tr>
                  <td> Enter Topic Name :</td>
                  <td><input type="text" name="name" onChange={handleChangeOfFiledsForCreateData} value={createTopicData.name}></input></td>
                  <td><button class="sub1" onClick={CreateTopic}>Create a New Topic</button></td>
                 
                </tr>
                <tr>
                    <td>Enter Topic ID to be deleted : </td>
                    <td> <input type="number" name="topicid" onChange={handleChangeOfFiledsForDeleteData} value={deleteTopicData.topicid}></input></td>
                    <td><button class="sub1" onClick={DeleteTopic}>Delete Topic</button></td>
                  </tr>
                  <tr>
                    <td>Enter Topic ID to publish: </td>
                    <td colspan="1">   <input type="number" name="topicid" onChange={(event) => { setPubTopicData({ ...pubTopicData, topicid: parseInt(event.target.value) }); }} value={pubTopicData.topicid}></input>
        </td>
        <td></td>
                   </tr> 
                  
                  <tr>
                    <td> Enter Data to publish :</td>
                    <td><input type="text" name="topicid" onChange={(event) => { setPubTopicData({ ...pubTopicData, data: event.target.value }); }} value={pubTopicData.data}></input></td>
                    <td><button class="sub1" onClick={PublishMe}>Publish Data</button></td>
                  </tr>
                  <tr>
                    <td><button class="sub1" onClick={getPublishedData}>GET MY TOPICS</button></td>
                    <td colspan="2">{publishData.map((d, idx) => {
            return (<h5 key={idx}>{d.topicID}   ---------------------       {d.name}</h5>);
        })}</td>
                  </tr>

                  
                
            </table>

       
        

        

        <br /><br /><br />

        

    </>);
}

export default Publish;