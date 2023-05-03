import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import "./login1.css"

export default function Login() {

    // navigator to move around the pages
    const navigate = useNavigate();

    // state to verify login details
    const [userData, setUserData] = useState({
        email: "",
        password: "",
    });

    // fn to handle from field
    const handleChangeOfFileds = (event) => {
        setUserData({ ...userData, [event.target.name]: event.target.value });
    }

    // fn to handle logi nverification
    const handleSubmission = async (event) => {
        event.preventDefault();

        const res = await fetch("http://localhost:4000/login", {
            method: "POST",
            body: JSON.stringify(userData),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = JSON.parse(await res.text());

        if (data.pass) {
            navigate("/mainpage", {
                state: {
                    id: data.id,
                    name: data.name,
                }
            });
        }

        else {
            console.log("Invalid Email or Password");
        }


    }

    return (
        <><br></br>
     <h2 class=" log89 h-100 d-flex align-items-center justify-content-center text-center k">Login Page</h2><br></br>
            <div class="log h-100 d-flex align-items-center justify-content-center">
               
                <form onSubmit={handleSubmission}>
                <label class="kl"for="fname">Enter Email :</label><br></br>
                <input name="email" class="login"onChange={handleChangeOfFileds} type="text" value={userData.email}></input><br></br>
                <label class="kl" for="fname">Enter password : </label><br></br>
                <input name="password" class="login" onChange={handleChangeOfFileds} type="password" value={userData.password}></input><br></br>
                <input  class="sub kl"type="submit"></input><br></br>
                <a  class="kt"href="/signup">SignUp?</a>
                </form>
                <br></br>
                
            </div>
            
            
            
            
        </>
    );
}