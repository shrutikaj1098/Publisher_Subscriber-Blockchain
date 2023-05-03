import { useState } from "react";
import pubsub from "../contracts/pubsub";


function Subscribe(props) {

    // state that has all the topics available to subscribe
    const [toSub, setToSub] = useState([]);

    // data to handle form to subscribe
    const [sub, setSub] = useState({});

    // get all topics available that user hasnt subscribed yet 
    const getAllTopics = async (event) => {
        event.preventDefault();

        const res = await fetch("http://localhost:4000/gettopicstosubscribe", {
            method: "POST",
            body: JSON.stringify({ userid: props.id }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        setToSub(JSON.parse(await res.text()));

        console.log(toSub);


    }

    // add subscription in solidity
    const subsSol = async (_subs, _pub, _topicid, _addr) => {
        await pubsub.methods.subscription(_subs, _pub, _topicid).send({ from: _addr, gas: 1000000 });
    }

    // subscribe to a topic
    const subscribeMe = async (event) => {
        event.preventDefault();
        sub.userid = props.id;
        const res = await fetch("http://localhost:4000/subscribe", {
            method: "POST",
            body: JSON.stringify(sub),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = JSON.parse(await res.text());
        // console.log(data);
        if (data.val == -1) {
            console.log("No such topic");
        }

        else if (data.val == 0) {
            console.log("Already Subscribed");
        }

        else {
            subsSol(props.id, sub.pubid, sub.topicid, data.addr);
        }

    }

    // delete subscription in solidity
    const deleteSubSol = async (_subs, _pub, _topicid, _addr) => {
        await pubsub.methods.removeSubs(_subs, _pub, _topicid).send({ from: _addr, gas: 1000000 });
    }

    // delete subscription
    const unSubscribeMe = async (event) => {
        event.preventDefault();
        sub.userid = props.id;
        const res = await fetch("http://localhost:4000/unsubscribe", {
            method: "POST",
            body: JSON.stringify(sub),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = JSON.parse(await res.text());

        if (data.val == -1) {
            console.log("No such subscription");
        }

        else {
            deleteSubSol(props.id, sub.pubid, sub.topicid, data.addr);
        }
    }
    return (<>


        

       
<h2 class="h-100 d-flex align-items-center justify-content-center">Subscribe</h2><br></br>
<table>
                
                <tr>
                  <td>Enter PubID :</td>
                  <td><input type="number" name="pubid" onChange={(event) => { setSub({ ...sub, pubid: parseInt(event.target.value) }) }} value={sub.pubid}></input>
        </td>
        
                 
                </tr>
                <tr>
                    <td>Enter TopicID :</td>
                    <td><input type="number" name="topicid" onChange={(event) => { setSub({ ...sub, topicid: parseInt(event.target.value) }) }} value={sub.topicid}></input>
       </td>
                    
                  </tr>
                  <tr>
                    <td><button class="sub1" onClick={subscribeMe}>Subscribe</button></td>
                    <td> <button class="sub1"onClick={unSubscribeMe}>Delete Subscription</button></td>
                   </tr> 
                  
                  <tr>
                    <td> <button class="sub1" onClick={getAllTopics}>Get Topics to Subscribesss</button></td>
                    <td> {toSub.map((d, idx) => {
            return (<h5 key={idx}>{d.pubID}   ------------------   {d.topicID}   ------------------   {d.name}</h5>);
        })}</td>
                    
                  </tr>

                  
                
            </table>
        
       

        

    </>);
}

export default Subscribe;