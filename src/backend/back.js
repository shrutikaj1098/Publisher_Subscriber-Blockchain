// find acc addr of user
const findAddr = async (_id) => {
    return await userData.findOne({ "id": _id }).select("addr -_id");
}

// id to be given for user creation and topic creation
var USERID = 1;
var TOPICID = 1;

// express to run the server
const express = require('express');
server = express();

// start server to listen in port 4000
server.listen(4000, () => {
    console.log("Server is HOT!!!");
});

// cors for cross origin access 
const cors = require('cors');
server.use(cors());

// parser to parse the input request to readable format
const parser = require('body-parser');
server.use(parser.json());

// mongoose to work with DB
const mongoose = require('mongoose');

// function to connect with DB
const DBConnect = async () => {
    // local mongodb connection
    await mongoose.connect("mongodb://127.0.0.1:27017/pubsub");
    console.log("DB is HOT!!!");

    let query;

    // setting USERID to max USER ID in DB + 1
    query = await userData.find().select('id -_id').sort({ "id": -1 }).limit(1);

    if (query.length == 0) USERID = 1;

    else USERID = query[0].id + 1;

    // setting TOPICID to max TOPIC ID in DB + 1
    query = await topic.find().select('topicID -_id').sort({ "topicID": -1 }).limit(1);

    if (query.length) TOPICID = query[0].topicID + 1;

    else TOPICID = 1;
}

// calling the function to connect to the DB
DBConnect().catch((err) => { console.log(err); });

// user data table
// has basic details and address
const userDataSchema = new mongoose.Schema({
    id: Number,
    name: String,
    email: String,
    password: String,
    addr: String,
});

const userData = mongoose.model('userData', userDataSchema);

// topic table
// if some publisher registered for some new topic
// the registration is done here
const topicSchema = new mongoose.Schema({
    name: String,
    topicID: Number,
    pubID: Number,
});

const topic = mongoose.model('topic', topicSchema);

// any publishment by any user under any topic
// is recorded here
const publishmentSchema = new mongoose.Schema({
    userID: Number,
    topicID: Number,
    eventID: Number,
    data: String
});

const publishment = mongoose.model('publishment', publishmentSchema);

// any subscription by anyone is recorded here
const subscriptionSchema = new mongoose.Schema({
    userID: Number,
    topicID: Number,
    pubID: Number,
    lastSeen: Number,
});

const subscription = mongoose.model('subscription', subscriptionSchema);

/* ALL server.post ARE THE SERVER SIDE CODE LISTENING FOR FRONTEND */

// file => SignUP.js
// signup user
// details are sent from fontend
// they are added to the DB
// USERID is also updated for next user
server.post('/signup', async (req, res) => {

    let data = new userData();

    data.email = req.body.email;
    data.password = req.body.password;
    data.id = USERID;
    data.name = req.body.name;
    data.addr = req.body.addr;

    await data.save();

    res.send(JSON.stringify({ id: USERID }));

    console.log(USERID.toString() + " ID details added to DB");

    USERID += 1;
});

// file => Login.js
// login verification
server.post('/login', async (req, res) => {

    const query = await userData.findOne({ 'email': req.body.email, 'password': req.body.password });

    console.log(query);

    if (query) res.send(({ pass: true, id: query.id, name: query.name }));

    else res.send(JSON.stringify({ pass: false }));
});

// file => Publish.js
// registering topic by adding value in topic DB
server.post('/registertopic', async (req, res) => {

    let data = new topic();
    data.name = req.body.name;
    data.topicID = TOPICID;
    data.pubID = req.body.userid;

    await data.save();


    console.log(TOPICID.toString() + " topic registered");


    const val = await findAddr(req.body.userid);
    res.send(JSON.stringify({ topicid: TOPICID, addr: val.addr }));
    TOPICID += 1;



});


// file => Publish.js
// delete a topic
// remove the entry from topic DB
// remove all publishments under the topic from publishments DB
server.post('/deletetopic', async (req, res) => {

    let query = await topic.deleteOne({ "topicID": req.body.topicid, "pubID": req.body.userid });

    if (query.deletedCount != 0) {

        await publishment.deleteMany({ "userID": req.body.userid, "topicID": req.body.topicid });

        const data = await findAddr(req.body.userid);
        res.send(JSON.stringify({ val: 0, addr: data.addr }));

        console.log(req.body.topicid + " has been deleted");
    }

    else {
        console.log(req.body.topicid + " not found");
        res.send(JSON.stringify({ val: -1 }));
    }

});

// file => Publish.js
// view all my published topics list
server.post("/getpublishedtopics", async (req, res) => {

    const query = await topic.find({ "pubID": req.body.userid }).select('topicID name -_id')

    res.send(JSON.stringify(query));
});

// file => Publish.js
// publish a data string into some topic created by the user
// the data is stored in publishment DB
server.post("/publishdata", async (req, res) => {

    var eventID;

    // check if the topic is registered by the user to publish
    var query = await topic.find({ "topicID": req.body.topicid, "pubID": req.body.userid }).select('pubID topicID -_id');
    console.log(query);
    if (query.length == 0) {
        res.send(JSON.stringify({ val: -1 }));
    }

    else {

        // find the highest data eventID
        // to enter the current one with right eventID
        query = await publishment.find({ "topicID": req.body.topicid, "userID": req.body.userid })
            .select('eventID -_id').sort({ "eventID": -1 }).limit(1);


        if (query.length == 0) {
            eventID = 1;
        }

        else {
            eventID = query[0].eventID + 1;
        }

        // push data in DB
        let data = new publishment();
        data.eventID = eventID;
        data.topicID = req.body.topicid;
        data.userID = req.body.userid;
        data.data = req.body.data;

        await data.save();

        const val = await findAddr(req.body.userid);

        console.log(val);

        console.log(eventID.toString() + " data published successfully");
        console.log(JSON.stringify({ val: 1, addr: val.addr, eventid: eventID }));
        res.send(JSON.stringify({ val: 1, addr: val.addr, eventid: eventID }));
    }
});

// file => Home.js
// view all the topics I have subscribed to
server.post("/getsubscriptions", async (req, res) => {

    var query = await subscription.find({ "userID": req.body.userid }).select("pubID topicID -_id");

    if (query.length == 0) {
        res.send(JSON.stringify([{ data: "No subscriptions yet" }]));
    }

    else {
        var ret = [];

        for (let i = 0; i < query.length; i++) {
            var x = await topic.find({ "pubID": query[i].pubID, "topicID": query[i].topicID }).select("pubID topicID name -_id");
            ret.push(x[0]);
        }
        console.log("RET");
        console.log(ret);
        res.send(JSON.stringify(ret));
    }

});

// file => Subscribe.js
// find all the topics available in the environment
// that the user hasn't subscribed to
server.post("/gettopicstosubscribe", async (req, res) => {

    // find all the topics user has already subscribed to
    var query1 = await subscription.find({ "userID": req.body.userid }).select("pubID topicID -_id");

    // find all available topics in the environment
    var query = await topic.find().select("pubID topicID name -_id");

    // rearrange to perform JSON array subtraction

    // the subtraction process

    filteredArr = [];
    for (i = 0; i < query.length; i += 1) {
        flag = false;
        for (j = 0; j < query1.length; j += 1) {
            if (query[i].topicID == query1[j].topicID) {
                if (query[i].pubID == query1[j].pubID) {
                    flag = true;
                    break;
                }
            }
        }

        if (flag == false) {
            filteredArr.push(query[i]);
        }
    }

    console.log(filteredArr);
    res.send(JSON.stringify(filteredArr));

});

// file => Subscribe.js
// subscribe to some topic
server.post("/subscribe", async (req, res) => {

    // check if its a valid subscription
    var query = await topic.find({ "pubID": req.body.pubid, "topicID": req.body.topicid }).select("pubID topicID -_id");

    if (query.length == 0) {
        console.log("No such topic");
        res.send(JSON.stringify({ val: -1 }));
    }

    else {
        // check if its already subscribed
        query = await subscription.find({ "userID": req.body.userid, "topicID": req.body.topicid, "pubID": req.body.pubid }).select("userID topicID pubID-_id");

        if (query.length != 0) {
            console.log("Already Subscribed");
            res.send(JSON.stringify({ val: 0 }));
        }

        else {

            // add data to the subscription DB
            const data = new subscription();
            data.userID = req.body.userid;
            data.pubID = req.body.pubid;
            data.topicID = req.body.topicid;
            data.lastSeen = 0;

            await data.save();

            const val = await findAddr(req.body.userid);

            console.log("Successfully subscribed");
            res.send(JSON.stringify({ val: 1, addr: val.addr }));
        }
    }
});

// file => Home.js
// in some topic subscribed
// get all the data that havent been seen yet by the user
server.post("/getpublisheddata", async (req, res) => {
    // check if the user is subscribed to the topic
    const query = await subscription.find({ "userID": req.body.userid, "pubID": req.body.pubid, "topicID": req.body.topicid });


    if (query.length == 0) {
        // res.send(JSON.parse({ data: "No subscription" }));
        console.log("No Subscription");
        res.send(JSON.stringify([{ data: "No Subscription" }]));
    }

    else {

        // last seen eventID
        var ls = query[0].lastSeen;

        // get all the publishments
        // greater than last seen value

        console.log(req.body);

        console.log(ls);
        // const query1 = await publishment.find({ "topicID": req.body.topicid, "userID": req.body.pubid })
        //     .select('eventID -_id');



        const query1 = await publishment.find({
            "userID": req.body.pubid, "topicID": req.body.topicid, "eventID": { $gt: ls }
        }).select("eventID data -_id");

        console.log(query1);

        // find the highest value in the publishment table of the topic
        // to update the last seen of the user
        const query3 = await publishment.find({
            "userID": req.body.pubid, "topicID": req.body.topicid, "eventID": { $gt: ls }
        }).select("eventID data -_id").sort({ "eventID": -1 }).limit(1);;

        // update the lastseen of the user
        // if they have seen some new data
        if (query3.length != 0) {
            const query2 = await subscription.findOneAndUpdate({ "userID": req.body.userid, "topicID": req.body.topicid, "pubID": req.body.pubid }, { "lastSeen": query3[0].eventID });
        }

        const val = await findAddr(req.body.userid);

        console.log(query1);

        query1.push({ addr: val.addr, eventID: -1 });

        res.send(JSON.stringify(query1));
    }
});

server.post("/unsubscribe", async (req, res) => {

    const query = await subscription.deleteOne({ "topicID": req.body.topicid, "pubID": req.body.pubid, "userID": req.body.userid });

    if (query.deletedCount == 0) {
        console.log("No such subscription");
        res.send(JSON.stringify({ val: -1 }));
    }
    else {
        console.log("Subscription revoked successfully");
        const val = await findAddr(req.body.userid);
        res.send(JSON.stringify({ val: 1, addr: val.addr }));
    }

})