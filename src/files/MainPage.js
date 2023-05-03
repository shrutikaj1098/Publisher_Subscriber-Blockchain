import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Home from "./Home";
import Publish from "./Publish";
import Subscribe from "./Subscribe.js";
import '../App.css'
import "./stylemain.css"

// this page has the three tabs of the site
function MainPage() {

    // navigator to navigate to other pages
    const navigate = useNavigate();

    // location to get data from navigation
    const location = useLocation();

    const Logout = () => {
        // if logged out navigate to the root page
        // that is login or signup page
        navigate("/", { replace: true });
    }

    return (
        <>
         <Tabs>
          <div class="container-fluid">
            <div class="row h">
            <div class="col-sm-4 column kt">
              <ul>
                <li>PUBLISHER SUBSCRIBER</li>
              </ul></div>
            <div class="col-sm-4 column"></div>
            <div class="col-sm-4 column text-right">
                                         
                <span class="a"> <h4 class="tm">Welcome {location.state.name}, ID : {location.state.id}</h4></span>
                <span class="a"><button class="glyphicon glyphicon-log-out"onClick={navigate("/login", {replace:true})}><span ></span></button></span>
              
            
            </div>
            </div>
            <div class="row h">
            <div class="col-sm-2 column1 kt">
            <div class="sidenav">
        <div style={{ }}>
                    <TabList>
                        <Tab><a ><b class="kf">Home</b></a></Tab>
                        <Tab><a><b class="kf">Subscribe</b></a></Tab>
                        <Tab><a><b class="kf">Publish</b></a></Tab>
                       
                    </TabList>
                </div>
            
            
          </div>
            </div>
            <div class="col-sm-10 column1">
            <div id="band" class="h-100 d-flex align-items-center justify-content-center tab" style={{  }}>
                        <br></br>
                        
                    <TabPanel>
                        <Home id={location.state.id} />
                    </TabPanel>

                    <TabPanel>
                    <Subscribe id={location.state.id} />
                    </TabPanel>

                    <TabPanel>
                        <Publish id={location.state.id} />
                        
                    </TabPanel>
                </div>
           


            </div>
            
            </div>
          </div>
                
             </Tabs>   
        
          
                
                       
           
                
            
            
            
        


           



        </>
    );
}

export default MainPage;