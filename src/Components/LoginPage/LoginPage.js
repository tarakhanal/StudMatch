import React, { Component } from 'react'
import './LoginPage.css'
import { AnimatePresence, motion } from 'framer-motion'
import { loginContainerTransition, loginContainerTransitionDuration } from '../../Util/PageTransitions'
import MDSpinner from 'react-md-spinner'

export default class LoginPage extends Component {
    constructor() {
        // super is always called at the beginning of our constructor. This executes our constructor when the
        // class is instantiated - instantiating our state accordingly.
        super()
        // state can be thought of as member fields. State is managed by react and react will automatically
        // re-render the appropriate DOM elements when our state changes
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
        //NOTE: ~NEVER~ manipulate state directly (i.e this.state.email = 'Joseph@email.com')
        //We always use the this.setState({email: 'Joseph@email.com'}) method to update state so react is
        //aware of state changes.
    }


    //Form submissions automatically refresh the page on submit. We use event.preventDefault() to stop this

    fetchLogin = (event) => {
        event.preventDefault()
        this.setState({fetchingLogin: true})
        {
            //Simulate fetch
            setTimeout(() => {
                this.setState({fetchingLogin: false})
            }, 2000)
        }
        //Fetch login token - probably going to handle this in App.js so we'll do something like:
        this.props.fetchLogin(this.state.email, this.state.password)
        //This will call a function in App.js which we pass in props. Take a look at the <LoginPage> properties in App.js
        //To see how this is referenced
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

    fetchCreateAccount = (event) => {
        event.preventDefault()
        this.setState({fetchingCreateAccount: true})
        if (this.state.createPassword === this.state.createConfirmPassword) {
            {
                //Simulate fetch
                setTimeout(() => {
                    let newEmail = this.state.createEmail
                    this.setState({fetchingCreateAccount: false, formDisplay: 'login', createConfirmPassword: '', createEmail: '', email: newEmail, createPassword: ''})
                    this.props.displayMessageHandler('Account created successfully')
                }, 2000)
            }
            //Fetch account creation
        } else {
            this.setState({fetchingCreateAccount: false})
            this.props.displayMessageHandler('Passwords don\'t match')
        }
    }

    // Render function always exists in a class component. Render is called to render the appropriate DOM objects
    // the return value is what will be rendered. We can put free functions in render but generally
    // we just associate the methods with our class and reference them as such. Honestly I have no idea why lmao
    render() {
        return (
            <div className='loginPageContainer'>
                <div className='loginContentWrapper'>
                    <h1 className='loginLogoText'>StudyPartner</h1>
                    {/* Animate Presence allows us to use framer motion - our animation library */}
                    {/*
                        exitBeforeEnter indicates the new components shouldn't render until the previous has finished its animation
                    */}
                    <AnimatePresence exitBeforeEnter >
                        {/* Utilizing a ternary expression to conditionally render content depending on the state of "formDisplay" */}
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
