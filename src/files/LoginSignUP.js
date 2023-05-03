import { useNavigate } from 'react-router-dom';
import "./login1.css"

function LoginSignUP() {

    // navigator to move around the page
    const navigate = useNavigate();

    // basic starting page...
    // nothing much to say here
    return (
        <>
             <br></br>
             
     <h2 class=" log89 h-100 d-flex align-items-center justify-content-center text-center k" >Welcome to Publisher/Subscriber Project</h2><br></br>
            <div class="  h-100 d-flex align-items-center justify-content-center text-center ">
            <button class="login2 kl" onClick={() => { navigate('/login') }}>Login</button>
            
            <button class="login2 kl"onClick={() => { navigate('/signup') }}>SignUP</button>
            </div>
            
            

        </>
    );
}

export default LoginSignUP;