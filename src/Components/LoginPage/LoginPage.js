import React, { Component } from 'react'
import './LoginPage.css'
import { AnimatePresence, motion } from 'framer-motion'
import { loginContainerTransition, loginContainerTransitionDuration } from '../../Util/PageTransitions'
import MDSpinner from 'react-md-spinner'

export default class LoginPage extends Component {
    constructor() {
        super()

        this.state = {
            formDisplay: 'login',
            email: '',
            password: '',
            createEmail: '',
            createPassword: '',
            createConfirmPassword: '',
            fetchingLogin: false,
            fetchingForgotPassword: false,
            fetchingCreateAccount: false,
        }
    }

    fetchLogin = async (event) => {
        event.preventDefault()
        this.setState({fetchingLogin: true})

        await fetch(`http://localhost:4000/api/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({email: this.state.email, password: this.state.password})
        })
        .then((response) => {
            if (response.ok) {
                this.props.displayMessageHandler('Successfully Logged In')
                this.setState({fetchingLogin: false})
            } else
                throw new Error('Invalid login info')
        })
        .catch((error) => {
            console.log(error)
            this.props.displayMessageHandler(error)
            this.setState({fetchingLogin: false})
        })

        this.props.fetchLogin(this.state.email, this.state.password)
    }

    fetchForgotPassword = (event) => {
        event.preventDefault()
        this.setState({fetchingForgotPassword: true})
        {
            //Simulate fetch
            setTimeout(() => {
                this.setState({fetchingForgotPassword: false, formDisplay: 'login'})
                this.props.displayMessageHandler('Recovery email sent successfully')
            }, 2000)
        }
        //Fetch forgot password
    }

    fetchCreateAccount = async (event) => {
        event.preventDefault()
        this.setState({fetchingCreateAccount: true})
        if (this.state.createPassword === this.state.createConfirmPassword) {

            //Fetch account creation
            await fetch(`http://localhost:4000/api/createAccount`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({email: this.state.createEmail, password: this.state.createPassword})
            })
            .then((response) => {
                if (response.ok) {
                    this.props.displayMessageHandler('Successfully Created Account')
                    this.setState({fetchingCreateAccount: false, formDisplay: 'login', createEmail: '', createPassword: '', createConfirmPassword: ''})
                } else
                    throw new Error('Failed to create account')
            })
            .catch((error) => {
                console.log(error)
                this.props.displayMessageHandler(error)
                this.setState({fetchingCreateAccount: false})
            })

        } else {
            this.setState({fetchingCreateAccount: false})
            this.props.displayMessageHandler('Passwords don\'t match')
        }
    }

    render() {
        return (
            <div className='loginPageContainer'>
                <div className='loginContentWrapper'>
                    <h1 className='loginLogoText'>StudyPartner</h1>
                    <AnimatePresence exitBeforeEnter >
                        {this.state.formDisplay === 'login' ?
                            <motion.form key='loginContainer' className='loginInformationContainer' onSubmit={this.fetchLogin} initial={loginContainerTransition.initial} animate={loginContainerTransition.in} exit={loginContainerTransition.out} transition={{ duration: loginContainerTransitionDuration }}>
                                <label for='loginEmailInput' className='loginInputTitle'>Email</label>
                                <input type='email' value={this.state.email} onChange={(e) => this.setState({email: e.target.value})} id='loginEmailInput' className='loginInput' />
                                <br />
                                <label for='loginPasswordInput' className='loginInputTitle'>Password</label>
                                <input type='password' value={this.state.password} onChange={(e) => this.setState({password: e.target.value})} id='loginPasswordInput' className='loginInput' />
                                <p className={`forgotPasswordText ${this.state.fetchingLogin && 'disabledElement'}`} onClick={() => this.setState({formDisplay: 'forgotPassword'})}>Forgot Password?</p>
                                {this.state.fetchingLogin ?
                                    <div className='loadingSpinnerContainer'>
                                        <MDSpinner size={30} singleColor={'#2B839D'}/>
                                    </div>
                                :
                                    <div className='loginSubmitButtonWrapper'>
                                        <button className='loginSecondaryButton' type='button' onClick={() => this.setState({formDisplay: 'signUp'})}>Sign-Up</button>
                                        <button className='loginPrimaryButton' type='submit'>Login</button>
                                    </div>
                                }
                            </motion.form>
                        : this.state.formDisplay === 'forgotPassword' ?
                            <motion.form key='forgotPasswordContainer' className='loginInformationContainer' onSubmit={this.fetchForgotPassword} initial={loginContainerTransition.initial} animate={loginContainerTransition.in} exit={loginContainerTransition.out} transition={{ duration: loginContainerTransitionDuration }}>
                                <p className='forgotPasswordInfoText'>Forgot your password? Enter your email and you'll receive a link to reset.</p>
                                <label for='loginEmailInput' className='loginInputTitle'>Email</label>
                                <input type='email' value={this.state.email} onChange={(e) => this.setState({email: e.target.value})} id='loginEmailInput' className='loginInput' />
                                {this.state.fetchingForgotPassword ?
                                    <div className='loadingSpinnerContainer'>
                                        <MDSpinner size={30} singleColor={'#2B839D'}/>
                                    </div>
                                :
                                    <div className='loginSubmitButtonWrapper'>
                                        <button className='loginSecondaryButton' type='button' onClick={() => this.setState({formDisplay: 'login'})}>Cancel</button>
                                        <button className='loginPrimaryButton' type='submit'>Submit</button>
                                    </div>
                                }
                            </motion.form>
                        :
                            <motion.form key='signUpContainer' className='loginInformationContainer' onSubmit={this.fetchCreateAccount} initial={loginContainerTransition.initial} animate={loginContainerTransition.in} exit={loginContainerTransition.out} transition={{ duration: loginContainerTransitionDuration }}>
                                <label for='signupEmailInput' className='loginInputTitle'>Email</label>
                                <input type='email' value={this.state.createEmail} onChange={(e) => this.setState({createEmail: e.target.value})} id='signupEmailInput' className='loginInput' />
                                <br />
                                <label for='signUpPasswordInput' className='loginInputTitle'>Password</label>
                                <input type='password' value={this.state.createPassword} onChange={(e) => this.setState({createPassword: e.target.value})} id='signUpPasswordInput' className='loginInput' />
                                <br />
                                <label for='signUpConfirmPasswordInput' className='loginInputTitle'>Confirm Password</label>
                                <input type='password' value={this.state.createConfirmPassword} onChange={(e) => this.setState({createConfirmPassword: e.target.value})} id='signUpConfirmPasswordInput' className='loginInput' />
                                {this.state.fetchingCreateAccount ?
                                    <div className='loadingSpinnerContainer'>
                                        <MDSpinner size={30} singleColor={'#2B839D'}/>
                                    </div>
                                :
                                    <div className='loginSubmitButtonWrapper'>
                                        <button className='loginSecondaryButton' type='button' onClick={() => this.setState({formDisplay: 'login'})}>Cancel</button>
                                        <button className='loginPrimaryButton' type='submit'>Submit</button>
                                    </div>
                                }
                            </motion.form>
                        }
                    </AnimatePresence>
                </div>
            </div>
        )
    }
}
