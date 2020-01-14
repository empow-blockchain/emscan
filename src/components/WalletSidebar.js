import React from 'react';
import TransferIcon from '../assets/images/transfer-icon.png'
import StakeIcon from '../assets/images/stake-icon.png'
import GasIcon from '../assets/images/gas-icon.png'
import RamIcon from '../assets/images/ram-icon.png'
import ProducerIcon from '../assets/images/producer-icon.png'
import VoteIcon from '../assets/images/vote-icon.png'
import RightArrowIcon from '../assets/images/right-arrow.png'
import {Link} from 'react-router-dom'

const WalletSidebar = props => {

    const {
        active
    } = props;

    return (
        <ul className="wallet-sidebar list-inline">
            <li className={`${active === "transfer" ? "active" : ""}`}><Link to="/wallet/transfer"><img className="icon" src={TransferIcon} alt="icon"></img> Transfer <img className="right-arrow" src={RightArrowIcon} alt="right-arrow"></img></Link></li>
            <li className={`${active === "stake" ? "active" : ""}`}><Link to="/wallet/stake"><img className="icon" src={StakeIcon} alt="icon"></img> Stake <img className="right-arrow" src={RightArrowIcon} alt="right-arrow"></img></Link></li>
            <li className={`${active === "gas" ? "active" : ""}`}><Link to="/wallet/gas"><img className="icon" src={GasIcon} alt="icon"></img> Gas <img className="right-arrow" src={RightArrowIcon} alt="right-arrow"></img></Link></li>
            <li className={`${active === "ram" ? "active" : ""}`}><Link to="/wallet/ram"><img className="icon" src={RamIcon} alt="icon"></img> Ram <img className="right-arrow" src={RightArrowIcon} alt="right-arrow"></img></Link></li>
            <li className={`${active === "producer" ? "active" : ""}`}><Link to="/wallet/producer"><img className="icon" src={ProducerIcon} alt="icon"></img> Producer <img className="right-arrow" src={RightArrowIcon} alt="right-arrow"></img></Link></li>
            <li className={`${active === "vote" ? "active" : ""}`}><Link to="/wallet/vote"><img className="icon" src={VoteIcon} alt="icon"></img> Vote <img className="right-arrow" src={RightArrowIcon} alt="right-arrow"></img></Link></li>
        </ul>
    );
};

export default WalletSidebar;