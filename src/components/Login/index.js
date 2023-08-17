import { useState } from 'react';
import { useNavigate } from "react-router-dom";

import AuthStore from "../../stores/AuthStore";
import User from "../User";

import "./index.css";
import { observer } from 'mobx-react';

const Login = observer(({ redirectUrl, onSuccess, ...rest }) => {

    const navigate = useNavigate();

    const [success, setSuccess] = useState(false);
    const [loginResult, handleLoginResult] = useState('');
    const [closeAlert, handleCloseAlert] = useState(true);

    const handleSubmit = e => {
        e.preventDefault();
        e.stopPropagation();

        const { email, password } = e.target;

        AuthStore.doLogin(email.value, password.value)
            .then((res) => {
                setSuccess(true);
                if(typeof onSuccess==="function") {
                    return onSuccess(res);
                }

                navigate(redirectUrl || '/user');
            })
            .catch(ex => {
                const loginResult = String(ex || '') || 'Unknown error';
                handleLoginResult(loginResult);
                handleCloseAlert(false);
            });

        return false;
    };

    return success
        ? <User path={redirectUrl} {...rest}></User>
        : <div className="container py-5">
            <div className="row justify-content-center m-3">
                <div className="col-md-6">
                    <h2 className="mb-4">User Login</h2>
                    <div className={`alert alert-${success ? 'success' : 'danger'} alert-dismissible`} role='alert' hidden={closeAlert}>
                        {loginResult}
                        <button type="button" className="close btn-close" data-dismiss="alert" aria-label="Close" onClick={() => handleCloseAlert(true)}>
                            <span className='invisible' aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <form onSubmit={e => handleSubmit(e)}>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                type="email"
                                name="email"
                                className="form-control"
                                id="email"
                                autoComplete="off"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                name="password"
                                autoComplete="off"
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">Login</button>
                    </form>
                </div>
            </div>
        </div>
});

export default Login;