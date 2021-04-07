import React, { Component } from 'react'
import { motion } from 'framer-motion'
import { loginContainerTransition, loginContainerTransitionDuration } from '../../../Util/PageTransitions'


export default class Login extends Component {
    render() {
        return (
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
        )
    }
}
