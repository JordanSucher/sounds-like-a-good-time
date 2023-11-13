import Navbar from './Navbar.js';
import RouteObj from './Router.js';
import React from 'react';
import { createRoot } from "react-dom/client";
import {Buffer} from 'buffer';


const root = createRoot(document.getElementById("app"));

root.render (
    <div class="App">
        <Navbar />
        <RouteObj />
    </div>    
)

