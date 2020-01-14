import React, { Component } from 'react'
import LogoFooter from '../assets/images/logo-footer.png'
import IconTelegram from '../assets/images/icon-telegram.png'
import IconTwitter from '../assets/images/icon-twitter.png'
import IconFacebook from '../assets/images/icon-facebook.png'
import FooterPattern from '../assets/images/footer-pattern.png'
import {Link} from 'react-router-dom'

class Footer extends Component {
    render() {
        return (
            <footer>
                <div className="pattern">
                    <img src={FooterPattern} alt="FooterPattern"></img>
                </div>
                <div className="container">
                    <div className="row">
                        <div className="col-md-4">
                            <div className="logo">
                                <img src={LogoFooter} alt="LogoFooter"></img>
                                <div className="text">
                                    <span>EMPOW BLOCKHAIN</span>
                                    <span>EXPLORER</span>
                                </div>
                            </div>
                            <div className="social-links">
                                <a href="https://t.me/empowofficial" target="_blank" rel="noopener noreferrer"><img src={IconTelegram} alt="IconTelegram"></img></a>
                                <a href="https://twitter.com/Empowofficial" target="_blank" rel="noopener noreferrer"><img src={IconTwitter} alt="IconTwitter"></img></a>
                                <a href="https://www.facebook.com/Empowofficial/" target="_blank" rel="noopener noreferrer"><img src={IconFacebook} alt="IconFacebook"></img></a>
                            </div>
                        </div>
                        <div className="col-md-2">
                            <div className="footer-links">
                                <p className="title">Links</p>
                                <ul className="list-inline">
                                    <li><Link to="/">Home</Link></li>
                                    <li><Link to="/blocks">Block</Link></li>
                                    <li><Link to="/producer">Producer</Link></li>
                                    <li><Link to="/wallet/stake">Stake</Link></li>
                                    <li><Link to="/txs">Txs</Link></li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-md-2">
                            <div className="footer-links">
                                <p className="title">Wallet</p>
                                <ul className="list-inline">
                                    <li><Link to="/wallet/transfer">Transfer</Link></li>
                                    <li><Link to="/wallet/stake">Stake</Link></li>
                                    <li><Link to="/wallet/gas">Gas</Link></li>
                                    <li><Link to="/wallet/ram">Ram</Link></li>
                                    <li><Link to="/wallet/producer">Producer</Link></li>
                                    <li><Link to="/wallet/vote">Vote</Link></li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-md-2">
                            <div className="footer-links">
                                <p className="title">Support</p>
                                <ul className="list-inline">
                                    <li>admin@empow.io</li>
                                    <li><Link to="/">Contact us</Link></li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-md-2">
                            <div className="footer-links">
                                <p className="title">About Us</p>
                                <ul className="list-inline">
                                    <li><Link to="/">Join us</Link></li>
                                    <li><Link to="/">Blog</Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        );
    }
};

export default Footer;