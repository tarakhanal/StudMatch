import React from 'react'
import './MatchPopup.css'
import {motion} from 'framer-motion'
import { popupTransition, backdropTransition } from '../../Util/PageTransitions'

export default function MatchPopup(props) {
    return (
        <div className='matchPopupPageWrapper'>
            <motion.div key='matchPopupBackdrop' className='matchPopupBackdrop' initial={backdropTransition.initial} animate={backdropTransition.in} exit={backdropTransition.out} transition={{ duration: .25 }}>
            <div className="pyro">
                <div className="before"></div>
                <div className="after"></div>
            </div>
            </motion.div>
            <motion.div key='matchPopupContainer' className='matchPopupContainer' initial={popupTransition.initial} animate={popupTransition.in} exit={popupTransition.out} transition={{ duration: .15 }}>
                <img className='matchPopupImage' src={props.matchProfile.profilePicture}/>
                <p className='matchPopupHeaderText'>You matched with {props.matchProfile.firstName} {props.matchProfile.lastName}!</p>
                <p className='matchPopupBodyText'>{props.matchProfile.major} | {props.matchProfile.school}</p>
                <div className='matchPopupButtonWrapper'>
                    <button className='matchPopupSecondaryButton' onClick={props.closePopup}>Close</button>
                    <button className='matchPopupPrimaryButton' onClick={props.chatNow}>Chat Now</button>
                </div>
            </motion.div>
        </div>
    )
}
