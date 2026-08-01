import { Link } from "@inertiajs/react";



export default function Welcome() {
    return (
        <>
            <div className="internet-connection-status" id="internetStatus"></div>
            <div className="hero-block-wrapper bg-primary">
                <div className="hero-block-styles">
                    <div
                        className="hb-styles1"
                        style={{ backgroundImage: `url(/assets/pwa/images/core-img/dot.png)` }}
                    ></div>
                    <div className="hb-styles2"></div>
                    <div className="hb-styles3"></div>
                </div>
                <div className="custom-container">
                    <div className="skip-page">
                        <Link href="/home">Skip</Link>
                    </div>
                    <div className="hero-block-content">
                        <img className="mb-4" src="/assets/pwa/images/bg-img/19.png" alt="" />
                        <h2 className="display-4 text-white mb-3">
                            Build your website easier with Affan
                        </h2>
                        <p className="text-white">
                            Affan is a modern and latest technology based PWA mobile HTML
                            template.
                        </p>
                        <Link className="btn btn-warning btn-lg w-100" href="/login">
                            Get Started
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}