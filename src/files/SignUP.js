import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import pubsub from '../contracts/pubsub';
import "./login1.css"

export default function SignUP() {

    // navigator to move around the pages
    const navigate = useNavigate();

    // user data state to handle submission
    const [userData, setUserData] = useState({
        name: "",
        email: "",
        password: "",
        addr: "",
    });

    // fn handle form fields
    const handleChangeOfFileds = (event) => {
        setUserData({ ...userData, [event.target.name]: event.target.value });
    }

    // register person in BC
    const regPubSol = async (_userid, _addr) => {
        await pubsub.methods.registerPerson(_userid).send({ from: _addr, gas: 1000000 });
    }

    // fn to handle submission process
    const handleSubmission = async (event) => {
        event.preventDefault();

        const res = await fetch("http://localhost:4000/signup", {
            method: "POST",
            body: JSON.stringify(userData),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = JSON.parse(await res.text());

        console.log(data.id);
        console.log(userData.addr);

        regPubSol(data.id, userData.addr);

        navigate('/login');

    }

    return (
        <>
        <br></br>
     <h2 class=" log89 h-100 d-flex align-items-center justify-content-center text-center k">SignUp Page</h2><br></br>
            <div class="log h-100 d-flex align-items-center justify-content-center">
               
                <form onSubmit={handleSubmission}>
                <label class="kl" for="fname">Enter name :</label><br></br>
                <input name="name" class="login"onChange={handleChangeOfFileds} type="text" value={userData.name}></input><br></br>
                <label class="kl" for="fname">Enter email : </label><br></br>
                <input name="email" class="login"onChange={handleChangeOfFileds} type="text" value={userData.email}></input><br></br>
                
                <label class="kl" for="fname">Enter password :  </label><br></br>
                <input name="password" class="login"onChange={handleChangeOfFileds} type="password" value={userData.password}></input><br></br>
                <label class="kl" for="fname">Enter Acc Addr : </label><br></br>
                <input name="addr" class="login"onChange={handleChangeOfFileds} type="text" value={userData.addr}></input><br></br>
                <input class="sub kl"type="submit"></input><br></br>
                <a class="kt"href="/login">Login?</a>
                </form>
                
            </div>
            
            
            
               
        </>
    );
}