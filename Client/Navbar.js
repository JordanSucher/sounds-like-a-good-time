import React from "react";

const Navbar = () => {
    
    let searchParams = new URLSearchParams(window.location.search);
    let big = searchParams.get("big");

    return (
        <div className="navbar">
            <p><a href="/">sounds like a good time (a bike ride visual synthesizer)</a></p>
             <a href="/visualize">example</a>
        </div>
    )
}

export default Navbar