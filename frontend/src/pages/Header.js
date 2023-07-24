import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
//import { AppContext } from '../App.js'
//import { useContext } from 'react';
import { useNavigate } from 'react-router-dom'

export default function Header() {
    //const { user } = useContext(AppContext);
    const navigate = useNavigate();

    return (
        <div id="HeaderWrapper">
            <button className="NavButton" onClick={()=>{navigate("/")}}>Home</button>
            <button className="NavButton" onClick={()=>{navigate("/cell")}}>Cell</button>
            <button className="NavButton" onClick={()=>{navigate("/project")}}>Project</button>
        </div>
    )
}