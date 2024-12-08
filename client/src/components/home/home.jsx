import HomeBackground from "./homeBackground";
import React from "react";
import Navbar from "../../layouts/navBar";
import { CardLocation } from "../../layouts/locationCard";
import Footer from "../../layouts/footer";

function Home() {
    return (
        <div>
            <div className="relative z-30">
                <Navbar />
            </div>
            <HomeBackground />
            <CardLocation />
            <Footer/>
        </div>
    )
}

export default Home