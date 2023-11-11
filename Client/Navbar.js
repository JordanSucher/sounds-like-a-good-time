import React, {useState} from "react";
import { Link } from "react-router-dom";
import { useSearchParams } from "react-router-dom";

const Navbar = () => {
    
    let searchParams = new URLSearchParams(window.location.search);
    let big = searchParams.get("big");

    return (
        <div className="navbar">
            <p>sounds like a good time (a bike ride visual synthesizer)</p>
             {!big? <a href="/?big=true">big</a> : <a href="/">small</a>}
        </div>
    )
}

export default Navbar