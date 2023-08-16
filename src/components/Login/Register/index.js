import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import AuthStore from "../../../stores/AuthStore";
import "./index.css";

const Register = ({ redirect }) => {

    const navigate = useNavigate();

    const [registerResult, setRegisterResult] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const { email, password, fullName, confirm_password } = e.target.elements;
        
        if(confirm_password.value!==password.value) {
            alert('Please enter the same password to confirm.');
            confirm_password.focus();
            return false;
        }

        AuthStore.doRegister(email.value, password.value, fullName.value)
            .then(() => {
                setRegisterResult('Successfully registered.');

                if (!redirect) {
                    redirect = '/user';
                }

                if (typeof redirect === 'string') {
                    navigate(redirect);
                }
            }).catch(ex => {
                setRegisterResult(String(ex || '') || 'Unknown error');
            });
    };

    return (
        <div className="container bg-light p-5 mt-3">
            <div className="row justify-content-center m-3">
                <div className="col-md-6">
                    <h2 className="mb-4">User Registration</h2>
                    <div className='alert alert-danger alert-dismissible' role='alert' hidden={!registerResult}>
                        {registerResult}
                        <button type="button" className="close btn-close" data-dismiss="alert" aria-label="Close" onClick={() => setRegisterResult('')}>
                            <span className='invisible' aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="fullName" className="form-label">Full Name</label>
                            <input
                                type="text"
                                name="fullName"
                                className="form-control"
                                id="fullName"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                type="email"
                                name="email"
                                className="form-control"
                                id="email"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input
                                type="password"
                                name="password"
                                className="form-control"
                                id="password"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="confirm_password" className="form-label">Confirm password</label>
                            <input
                                type="password"
                                name="confirm_password"
                                className="form-control"
                                id="confirm_password"
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">Register</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;