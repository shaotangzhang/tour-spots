import React, { useState } from 'react';
import "./index.css";
import AuthService from "../../../services/AuthService";

const Register = ({ redirect }) => {

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [registerResult, setRegisterResult] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();

        AuthService.register(email, password, fullName)
            .then(res => {
                if (res && res.userInfo && res.loginInfo) {
                    if (!redirect) {
                        redirect = '/user';
                    }

                    if (typeof redirect === 'string') {
                        if (redirect.startsWith('/')) {
                            window.history.push(redirect);
                        } else {
                            window.location.href = redirect;
                        }

                        return res;
                    }

                    setRegisterResult('Successfully registered. please login.');
                } else {
                    setRegisterResult('Invalid information for registering an account.');
                }
            }).catch(ex => {
                console.error(ex);
                setRegisterResult('Failed to register');
            });

        return false;
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
                                className="form-control"
                                id="fullName"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
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