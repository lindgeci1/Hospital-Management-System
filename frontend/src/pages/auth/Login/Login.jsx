import React, { useState, useEffect } from 'react';
import '../../auth/App.css';
import { Link, useNavigate } from 'react-router-dom';
import Axios from 'axios';
import video from '../../auth/LoginAssets/video.mp4';
import logo from '../../auth/LoginAssets/llogo.png';
import { FaUserShield } from "react-icons/fa";
import { BsFillShieldLockFill } from "react-icons/bs";
import { AiOutlineSwapRight } from "react-icons/ai";

const Login = () => {
    const [loginUserName, setLoginUserName] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigateTo = useNavigate();

    const loginUser = async (e) => {
        e.preventDefault();
    
        if (!loginUserName || !loginPassword) {
            setErrorMessage('All fields are required!');
            return;
        }
    
        try {
            const response = await Axios.post('http://localhost:9004/api/login', {
                username: loginUserName,
                password: loginPassword
            }, { withCredentials: true }); // ensure cookies are sent with the request

            const { data } = response;
            if (data) {
                // No need to set tokens in cookies manually since they're set as HttpOnly by the server
                navigateTo('/dashboard/profile');
                window.location.reload();
            } else {
                setErrorMessage('An error occurred while logging in. Please try again later1.');
            }
            
        } catch (error) {
            if (error.response) {
                const { data } = error.response;
                if (data.message === 'User does not exist') {
                    setErrorMessage('Username does not exist!');
                } else if (data.message === 'Incorrect password') {
                    setErrorMessage('Password incorrect!');
                } else {
                    setErrorMessage('An error occurred while logging in. Please try again later2.');
                }
            } else {
                setErrorMessage('An error occurred while logging in. Please try again later3.');
                console.error('Error logging in:', error);
            }
        }
    };

    return (
        <div className='loginPage flex'>
            <div className="container flex">
                <div className="videoDiv">
                    <video src={video} autoPlay muted loop></video>
                    <div className="textDiv">
                        <h2 className='title'>Welcome to LifeLine Hospital</h2>
                        <p>Feel free to contact us</p>
                    </div>
                    <div className="footerDiv flex">
                        <span className="text">Don't have an account?</span>
                        <Link to={'/register'}>
                            <button className='btn'>Sign Up</button>
                        </Link>
                    </div>
                </div> 
                <div className="formDiv flex">
                    <div className="headerDiv">
                        <img src={logo} alt="Logo Image" />
                    </div>
                    <form action="" className='form grid' onSubmit={loginUser}>
                        <span className="errorMessage">{errorMessage}</span>
                        <div className="inputDiv">
                            <label htmlFor="username">Username</label>
                            <div className="input flex">
                                <FaUserShield className='icon'/>
                                <input type="text" id="username" placeholder='Enter Username'
                                    value={loginUserName}
                                    onChange={(event) => setLoginUserName(event.target.value)} />
                            </div>
                        </div>
                        <div className="inputDiv">
                            <label htmlFor="password">Password</label>
                            <div className="input flex">
                                <BsFillShieldLockFill className='icon'/>
                                <input type="password" id="password" placeholder='Enter password' 
                                    value={loginPassword}
                                    onChange={(event) => setLoginPassword(event.target.value)} />
                            </div>
                        </div>

                        <div className="footerDiv flex">
                            <span className="text">Forgot your password?</span>
                            <Link to={'/forgot-password'}>
                                <button className='btn'>Reset Password</button>
                            </Link>
                        </div>

                        <button type='submit' className='btn flex'>
                            <span>Login</span>
                            <AiOutlineSwapRight className='icon'/>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
