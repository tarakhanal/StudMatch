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
            firstName: '',
            lastName: '',
            major: '',
            school: '',
            skills: '',
            interests: '',
            aboutSection: '',
            fetchingSubmitAccountDetails: false,
            profilePhoto: '',
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
                this.setState({fetchingLogin: false})
                return response.text()
            } else
                throw new Error('Invalid login info')
        })
        .then((response) => {
            console.log(JSON.parse(response))
            this.props.fetchLogin(JSON.parse(response))
        })
        .catch((error) => {
            console.log(error)
            this.props.displayMessageHandler(error)
            this.setState({fetchingLogin: false})
        })
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
            this.setState({fetchingCreateAccount: false, formDisplay: 'userInformation'})

        } else {
            this.setState({fetchingCreateAccount: false})
            this.props.displayMessageHandler('Passwords don\'t match')
        }
    }

    submitUserInfo = (e) => {
        e.preventDefault()
        this.setState({formDisplay: 'accountInformation'})
    }

    submitAccountDetails = async (e) => {
        e.preventDefault()
        this.setState({fetchingSubmitAccountDetails: true})
        
        // Fetch account creation
        let fetchBody = JSON.stringify({
            email: this.state.createEmail,
            password: this.state.createPassword,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            major: this.state.major,
            school: this.state.school,
            skills: this.state.skills.split(', '),
            interests: this.state.interests.split(', '),
            profilePicture: this.state.profilePhoto,
            aboutMe: this.state.aboutSection
        })
        await fetch(`http://localhost:4000/api/createAccount`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: fetchBody
        })
        .then((response) => {
            if (response.ok) {
                this.props.displayMessageHandler('Successfully Created Account')
                this.setState({fetchingSubmitAccountDetails: false, formDisplay: 'login', createEmail: '', createPassword: '', createConfirmPassword: ''})
            } else
                throw new Error('Failed to create account')
        })
        .catch((error) => {
            console.log(error)
            this.props.displayMessageHandler(error)
            this.setState({fetchingSubmitAccountDetails: false})
        })
    }

    fileToDataUri = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          resolve(event.target.result)
        };
        reader.readAsDataURL(file);
    })

    uploadImageHandler = async (e) => {
        let file
        await this.fileToDataUri(e.target.files[0]).then(dataURI => {
            file = dataURI
        })
        this.setState({profilePhotoPreview: URL.createObjectURL(e.target.files[0]), profilePhoto: file}, async () => {
            console.log(this.state.profilePhoto)
        })
        
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
                        : this.state.formDisplay === 'signUp' ?
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
                                        <button className='loginPrimaryButton' type='submit'>Next</button>
                                    </div>
                                }
                            </motion.form>
                        : this.state.formDisplay === 'userInformation' ?
                            <motion.form key='userInformationContainer' className='loginInformationContainer' onSubmit={this.submitUserInfo} initial={loginContainerTransition.initial} animate={loginContainerTransition.in} exit={loginContainerTransition.out} transition={{ duration: loginContainerTransitionDuration }}>
                                <label for='firstName' className='loginInputTitle'>First Name</label>
                                <input type='text' value={this.state.firstName} onChange={(e) => this.setState({firstName: e.target.value})} id='firstName' className='loginInput' />
                                <br />
                                <label for='lastName' className='loginInputTitle'>Last Name</label>
                                <input type='text' value={this.state.lastName} onChange={(e) => this.setState({lastName: e.target.value})} id='lastName' className='loginInput' />
                                <br />
                                <label for='major' className='loginInputTitle'>Major</label>
                                <input type='text' value={this.state.major} onChange={(e) => this.setState({major: e.target.value})} id='major' className='loginInput' />
                                <br />
                                <label for='school' className='loginInputTitle'>School</label>
                                <input type='text' value={this.state.school} onChange={(e) => this.setState({school: e.target.value})} id='school' className='loginInput' />
                                <br />
                                <div className='loginSubmitButtonWrapper'>
                                    <button className='loginSecondaryButton' type='button' onClick={() => this.setState({formDisplay: 'login'})}>Cancel</button>
                                    <button className='loginPrimaryButton' type='submit'>Next</button>
                                </div>
                            </motion.form>
                        :
                            <motion.form key='accountInfoContainer' className='loginInformationContainer' onSubmit={this.submitAccountDetails} initial={loginContainerTransition.initial} animate={loginContainerTransition.in} exit={loginContainerTransition.out} transition={{ duration: loginContainerTransitionDuration }}>
                                <label for='skills' className='loginInputTitle'>Skills</label>
                                <input type='text' value={this.state.skills} onChange={(e) => this.setState({skills: e.target.value})} id='skills' className='loginInput' />
                                <br />
                                <label for='interests' className='loginInputTitle'>Interests</label>
                                <input type='text' value={this.state.interests} onChange={(e) => this.setState({interests: e.target.value})} id='interests' className='loginInput' />
                                <br />
                                <label for='aboutSection' className='loginInputTitle'>About Me</label>
                                <textarea type='text' value={this.state.aboutSection} onChange={(e) => this.setState({aboutSection: e.target.value})} id='aboutSection' className='loginTextarea' />
                                <br />
                                <label for='profilePhoto' className='loginInputTitle'>Profile Photo</label>
                                {this.state.profilePhotoPreview !== '' &&
                                    <img className='profilePictureInputPreview' src={this.state.profilePhotoPreview}/>
                                }
                                <input type='file' onChange={(e) => this.uploadImageHandler(e)} id='profilePhoto' className='profilePictureInput' />
                                <br />
                                {this.state.fetchingSubmitAccountDetails ?
                                    <div className='loadingSpinnerContainer'>
                                        <MDSpinner size={30} singleColor={'#2B839D'}/>
                                    </div>
                                :
                                    <div className='loginSubmitButtonWrapper'>
                                        <button className='loginSecondaryButton' type='button' onClick={() => this.setState({formDisplay: 'login'})}>Cancel</button>
                                        <button className='loginPrimaryButton' onClick={() => console.log(this.state.profilePhoto)} type='submit'>Submit</button>
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
