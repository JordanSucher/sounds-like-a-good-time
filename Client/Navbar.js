import React, {useState} from "react";
import { Link } from "react-router-dom";
import { useSearchParams } from "react-router-dom";

const Navbar = () => {
    
    let searchParams = new URLSearchParams(window.location.search);
    let big = searchParams.get("big");

    return (
        <div className="navbar">
            <p><a href="/">sounds like a good time (a bike ride visual synthesizer)</a></p>
             {!big? <a href="/visualize?big=true">big example</a> : <a href="/visualize">small example</a>}
        </div>
    )
}

export default Navbar