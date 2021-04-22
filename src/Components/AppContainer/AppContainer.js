import React, { Component } from 'react'
import './AppContainer.css'
import profilePhoto from '../../Assets/profilePhoto.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers, faUser, faComments } from '@fortawesome/free-solid-svg-icons'
import MDSpinner from 'react-md-spinner'
import MatchPopup from '../MatchPopup/MatchPopup'
import { AnimatePresence } from 'framer-motion'
import openSocket from 'socket.io-client';

export default class AppContainer extends Component {
    constructor() {
        super()
        this.state = {
            navigationButtonSelected: 1,
            userToView: null,
            chatProfiles: ['', ''],
            chatProfileSelected: 0,
            currentChatMessage: '',
            displayMatchPopup: false,
            matchProfile: {}
        }
    }

    componentDidMount() {
        this.setState({userToView: this.props.user, matchProfile: this.props.user})
        this.getUserToView()
        // this.subscribeToChat()
    }

    getUserToView = async () => {
        await fetch(`http://localhost:4000/api/getNextUser`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({userId: this.props.user._id})
        })
        .then((response) => {
            if (response.ok) {
                return response.text()
            } else {
                throw new Error('Unable to get next users')
            }
        })
        .then((response) => {
            console.log(JSON.parse(response))
            this.setState({userToView: JSON.parse(response)})
        })
        .catch((error) => {
            console.log(error)
            this.props.displayMessageHandler('Unable to get next user')
        })
    }

    userDecisionHandler = async (decision) => {
        await fetch(`http://localhost:4000/api/userDecision`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({loggedInUserId: this.props.user._id, ratedUserId: this.state.userToView._id, decision})
        })
        .then((response) => {
            if (response.ok) {
                return response.text()
            } else {
                throw new Error(`Failed to document ${decision ? 'Like' : 'Pass'}`)
            }
        })
        .then((response) => {
            this.setState({userToView: JSON.parse(response)})
        })
        .catch((error) => {
            console.log(error)
            this.props.displayMessageHandler(error)
        })
    }

    sendMessageHandler = async () => {
        await fetch(`http://localhost:4000/api/sendMessage`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({loggedInUserId: this.props.user._id, actionUserId: this.state.userToView._id, message: this.state.currentChatMessage})
        })

        this.setState({currentChatMessage: ''})
    }

    handleChatNow = () => {
        this.setState({displayMatchPopup: false})
        this.openChatHandler()
    }

    openChatHandler = () => {
        this.setState({navigationButtonSelected: 3}, () => {
            let bottomElement = document.getElementById('bottomOfMessages')
            bottomElement.scrollIntoView()
        })
        console.log(this.props.user.messageHistory)
    }

    formatMessageTime = (timeSent) => {
        // 2/12/2021 - 6:39 PM
        let date = new Date(timeSent)
        let month = date.getMonth() + 1
        let day = date.getDate()
        let year = date.getFullYear()
        let hours = date.getHours()
        let minutes = date.getMinutes()
        let timePeriod = 'AM'

        if (hours === 12) {
            timePeriod = 'PM'
        } else if (hours > 12 && hours !== 24) {
            hours -= 12
            timePeriod = 'PM'
        } else if (hours === 24) {
            hours -= 12
        }

        if (minutes < 10) {
            minutes = `0${minutes}`
        }

        return `${month}/${day}/${year} - ${hours}:${minutes} ${timePeriod}`
    }

    socket = openSocket('http://localhost:4001')
    
    subscribeToChat = (cb) => {
        this.socket.on('connection');
        this.socket.emit('message', 'This is a message to the server');
    }


    render() {
        return (
            <div className='appContainer'>
                <div className='appTitleContainer' onClick={this.props.logoutHandler}>
                    <h1 className='appTitleLogoText'>StudyPartner</h1>
                </div>
                <div className='profileDisplayContainer'>
                    {this.state.userToView !== null ?
                        <div className='profileDisplayContentWrapper'>
                            <img className='largeProfilePhoto' src={this.state.userToView.profilePicture}/>
                            <h1 className='headerText'>{this.state.userToView.firstName} {this.state.userToView.lastName}</h1>
                            <p className='bodyText'>{this.state.userToView.major} | {this.state.userToView.school}</p>
                            <p className='profileInfoTitle'>Skills</p>
                            <div className='badgeWrapper'>
                                {this.state.userToView.skills.map((value, index) => (
                                    <span className='skillsBadge'>{value}</span>
                                ))}
                            </div>
                            <p className='profileInfoTitle'>Interests</p>
                            <div className='badgeWrapper'>
                                {this.state.userToView.interests.map((value, index) => (
                                    <span className='interestsBadge'>{value}</span>
                                ))}
                            </div>
                            <p className='profileInfoTitle'>About</p>
                            <p className='profileDescriptionText'>{this.state.userToView.aboutMe}</p>
                        </div>
                    :
                        <div className='loadingProfileSpinnerWrapper'>
                            <MDSpinner size={50} singleColor={'#2B839D'}/>
                        </div>
                    }
                </div>
                <div className='appNavigationContainer'>
                    <div className='appNavigationButtonWrapper'>
                        <button className={this.state.navigationButtonSelected === 1 ? 'appNavigationButton appNavigationButtonSelected' : 'appNavigationButton'} onClick={() => this.setState({navigationButtonSelected: 1})}><FontAwesomeIcon icon={faUsers} /></button>
                        <button className={this.state.navigationButtonSelected === 2 ? 'appNavigationButton appNavigationButtonSelected' : 'appNavigationButton'} onClick={() => this.setState({navigationButtonSelected: 2})}><FontAwesomeIcon icon={faUser} /></button>
                        <button className={this.state.navigationButtonSelected === 3 ? 'appNavigationButton appNavigationButtonSelected' : 'appNavigationButton'} onClick={this.openChatHandler}><FontAwesomeIcon icon={faComments} /></button>
                    </div>
                    {this.state.navigationButtonSelected === 1 ?
                        this.state.userToView !== null ?
                            <div className='findMatchesContainer'>
                                <div className='profileWrapper'>
                                    <img className='largeProfilePhoto' src={this.state.userToView.profilePicture}/>
                                    <h1 className='headerText'>{this.state.userToView.firstName} {this.state.userToView.lastName}</h1>
                                    <p className='bodyText'>{this.state.userToView.major} | {this.state.userToView.school}</p>
                                </div>
                                <div className='rateUserButtonWrapper'>
                                    <button className='likeButton' onClick={() => this.userDecisionHandler(true)}>Study</button>
                                    <button className='dislikeButton' onClick={() => this.userDecisionHandler(false)}>No Thanks</button>
                                </div>
                            </div>
                        :
                            <div className='loadingProfileSpinnerWrapper'>
                            </div>
                    : this.state.navigationButtonSelected === 2 ?
                        <div className='profileDisplayContentWrapper myProfileWrapper'>
                            <img className='largeProfilePhoto' src={this.props.user.profilePicture} onClick={() => this.setState({displayMatchPopup: true})}/>
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
                    :
                        <div className='chatPageWrapper'>
                            <div className='chatProfilesWrapper'>
                                {this.state.chatProfiles.map((value, index) => (
                                    <div onClick={() => this.setState({chatProfileSelected: index})} className={`chatProfileContainer ${this.state.chatProfileSelected === index ? 'chatProfileContainerSelected' : ''}`}>
                                        <img className='chatProfileImage' src={profilePhoto}/>
                                        <p className='chatProfileName'>Marcus</p>
                                    </div>
                                ))}
                            </div>
                            <div className='chatHistoryContainer'>
                                <div className='chatHistoryWrapper'>
                                    {this.props.user.messageHistory?.map((message, index) => (
                                        message.sentBy === this.props.user._id ?
                                            <div className='outgoingChatWrapper'>
                                                <div className='outgoingChatContainer'>
                                                    <p className='chatText'>{message.message}</p>
                                                </div>
                                                <p className='outgoingChatTimeStamp'>{this.formatMessageTime(message.timeSent)}</p>
                                            </div>
                                        :
                                            <div className='incomingChatWrapper'>
                                                <div className='incomingChatContainer'>
                                                    <p className='chatText'>{message.message}</p>
                                                </div>
                                                <p className='incomingChatTimeStamp'>{this.formatMessageTime(message.timeSent)}</p>
                                            </div>
                                    ))}
                                </div>
                                <div id='bottomOfMessages'/>
                            </div>
                            <div className='chatInputContainer'>
                                <input value={this.state.currentChatMessage} onChange={(e) => this.setState({currentChatMessage: e.target.value})} className='chatInput' />
                                <button className={`chatSendButton ${this.state.currentChatMessage === '' ? 'chatSendButtonDisabled' : ''}`} onClick={this.sendMessageHandler}>Send</button>
                            </div>
                        </div>
                    }
                </div>
                <AnimatePresence exitBeforeEnter>
                    {this.state.displayMatchPopup &&
                        <MatchPopup
                            matchProfile={this.state.matchProfile}
                            closePopup={() => this.setState({displayMatchPopup: false})}
                            chatNow={this.handleChatNow}
                        />
                    }
                </AnimatePresence>
            </div>
        )
    }
}
