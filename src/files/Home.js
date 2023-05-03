import { useState } from "react";
import { sha256 } from 'js-sha256';
import pubsub from "../contracts/pubsub";

function Home(props) {

    // data to be sent to view all subscriptions
    const [mySubs, setMySubs] = useState([]);

    // data to be sent to get the data of a topic
    const [dataVals, setDataVals] = useState({});

    // holds the data published in a topic to be seen
    // const [dispVal, setDispVal] = useState([]);

    const [varToDisp, setVarToDisp] = useState([])

    const [getBack, setGetBack] = useState([]);

    const viewSubs = async (event) => {
        event.preventDefault();

        // get a list of all topics available to be subscribed
        const res = await fetch("http://localhost:4000/getsubscriptions", {
            method: "POST",
            body: JSON.stringify({ userid: props.id }),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        setMySubs(JSON.parse(await res.text()));
        console.log(mySubs);
    }

    // // get hash of a publishment in solidity
    const getHashSol = async (_pubid, _topicid, data) => {


        var dummy = [];
        await data.map(async (d, id) => {
            if (d.eventID != -1) {
                await pubsub.methods.retHash(_pubid, _topicid, d.eventID).call().then((res) => {
                    var hash = sha256(d.data);
                    if (hash == res) {
                        console.log("______________HASH IS CORRECT______________");
                        console.log(hash);
                        dummy.push(d);
                        // console.log("HASH RIGHT")
                        // console.log(dummy);
                        setVarToDisp([...varToDisp, d]);
                    }
                    else {
                        console.log("HASH MISMATCH")
                    }
                }).catch((err) => {
                    console.error(err);
                });
            }
        });


        setVarToDisp((dummy) => {
            const newCount = dummy;
            // Perform any synchronous actions that depend on the updated state here
            return newCount;
        });


    }


    // get the unseen data in the topic registered
    const getPublishments = async (event) => {
        event.preventDefault();

        setVarToDisp([]);

        dataVals.userid = props.id;

        // console.log(dataVals);

        const res = await fetch("http://localhost:4000/getpublisheddata", {
            method: "POST",
            body: JSON.stringify(dataVals),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        var data = await res.text();

        var data1 = JSON.parse(data)

        setGetBack(data1);

        // console.log("getBcak")
        // console.log(getBack);

        await getHashSol(dataVals.pubid, dataVals.topicid, data1);



        // console.log(dispVal);
    }

    return (<>

       



<h2 class="h-100 d-flex align-items-center justify-content-center ">My Subcribed Channels</h2><br></br>
            
            <table class="">
                
                <tr>
                  <td>Enter PubID :</td>
                  <td>< input type="number" name="pubid" onChange={(event) => { setDataVals({ ...dataVals, pubid: parseInt(event.target.value) }) }} value={dataVals.pubid} />
        </td>
                 
                </tr>
                <tr>
                    <td>Enter TopicID :</td>
                    <td><input type="number" name="topicid" onChange={(event) => { setDataVals({ ...dataVals, topicid: parseInt(event.target.value) }) }} value={dataVals.topicid} />
        </td>
                    
                  </tr>
                  <tr>
                    <td><button class="sub1" onClick={getPublishments}>Get Latest Data</button></td>
                    <td> {getBack.map((d, idx) => {
            if (d.eventID != -1) {
                return (<h5 key={idx}>{d.eventID}   ------------------   {d.data}</h5>);
            }
        })}</td>
                   </tr> 
                  
                  <tr>
                    <td> <button class="sub1"onClick={viewSubs} >View my Subscriptions</button></td>
                    <td>
        {mySubs.map((d, idx) => {
            return (<h5 key={idx}>{d.pubID}   ---------------------   {d.topicID}   ---------------------   {d.name}</h5>);
        })}</td>
                    
                  </tr>

                  
                
            </table>
            
       
        

        

    </>);
}

export default Home;