import React from "react";
import { Container, PrimaryButton } from "../components/index.js";
import { Link } from "react-router-dom";
import heroImage from "../assets/HeroImage.png";

function LandingPage() {
    return (
        <Container>
            <div className="flex justify-between items-center my-20">
                {/* Hero Content */}
                <div className="h-128 flex flex-col w-1/2 gap-8">
                    <h1 className="text-7xl uppercase font-bold text-textCol ">
                        <span className="">Powerful</span>
                        <br />
                        Storage For
                        <br />
                        <span className="">Your Files</span>
                    </h1>

                    <div className="flex gap-14 text-2xl uppercase font-medium text-primary">
                        <p className="pl-1">Store</p>
                        <p className="pl-1">Stream</p>
                        <p className="pl-1">Download</p>
                    </div>

                    <Link to="/home" className="h-12 rounded-full w-fit mt-3">
                        <PrimaryButton title="Start Using" />
                    </Link>
                </div>

                {/* Hero Image */}
                <div className="h-full flex justify-center items-center">
                    <img
                        className="h-96 object-contain pt-4 pb-2"
                        src={heroImage}
                        alt="Hero Image"
                    />
                </div>
            </div>
        </Container>
    );
}

export default LandingPage;
