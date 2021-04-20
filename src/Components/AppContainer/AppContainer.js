import React, { Component } from 'react'
import './AppContainer.css'
import profilePhoto from '../../Assets/profilePhoto.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers, faUser, faComments } from '@fortawesome/free-solid-svg-icons'

export default class AppContainer extends Component {
    constructor() {
        super()
        this.state = {
            navigationButtonSelected: 1,
        }
    }

    render() {
        return (
            <div className='appContainer'>
                <div className='appTitleContainer' onClick={this.props.logoutHandler}>
                    <h1 className='appTitleLogoText'>StudyPartner</h1>
                </div>
                <div className='profileDisplayContainer'>
                    <div className='profileDisplayContentWrapper'>
                        <img className='largeProfilePhoto' src={this.props.user.profilePicture}/>
                        <h1 className='headerText'>{this.props.user.firstName} {this.props.user.lastName}</h1>
                        <p className='bodyText'>{this.props.user.major} | {this.props.user.school}</p>
                        <p className='profileInfoTitle'>Skills</p>
                        <div className='badgeWrapper'>
                            {this.props.user.skills.map((value, index) => (
                                <span className='skillsBadge'>{value}</span>
                            ))}
                        </div>
                        <p className='profileInfoTitle'>Interests</p>
                        <div className='badgeWrapper'>
                            {this.props.user.interests.map((value, index) => (
                                <span className='interestsBadge'>{value}</span>
                            ))}
                        </div>
                        <p className='profileInfoTitle'>About</p>
                        <p className='profileDescriptionText'>{this.props.user.aboutMe}</p>
                    </div>
                </div>
                <div className='appNavigationContainer'>
                    <div className='appNavigationButtonWrapper'>
                        <button className={this.state.navigationButtonSelected === 1 ? 'appNavigationButton appNavigationButtonSelected' : 'appNavigationButton'} onClick={() => this.setState({navigationButtonSelected: 1})}><FontAwesomeIcon icon={faUsers} /></button>
                        <button className={this.state.navigationButtonSelected === 2 ? 'appNavigationButton appNavigationButtonSelected' : 'appNavigationButton'} onClick={() => this.setState({navigationButtonSelected: 2})}><FontAwesomeIcon icon={faUser} /></button>
                        <button className={this.state.navigationButtonSelected === 3 ? 'appNavigationButton appNavigationButtonSelected' : 'appNavigationButton'} onClick={() => this.setState({navigationButtonSelected: 3})}><FontAwesomeIcon icon={faComments} /></button>
                    </div>
                    <div className='findMatchesContainer'>
                        <div className='profileWrapper'>
                            <img className='largeProfilePhoto' src={profilePhoto}/>
                            <h1 className='headerText'>Marcus DeAngelo</h1>
                            <p className='bodyText'>Computer Science | University of Akron</p>
                        </div>
                        <div className='rateUserButtonWrapper'>
                            <button className='likeButton'>Study</button>
                            <button className='dislikeButton'>No Thanks</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
