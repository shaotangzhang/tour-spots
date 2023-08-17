import { useEffect } from 'react';
import { Link } from 'react-router-dom';

import AuthStore from '../../../stores/AuthStore';

import "./index.css";

const Logout = () => {

    useEffect(function () {
        AuthStore.logout();
    });

    return (
        <div className="container bg-light p-5 mt-3">
            <div className="row justify-content-center m-3">
                <div className="col-md-6">
                    <h2 className="mb-4">Logout</h2>
                    <div className='alert alert-success' role='alert'>
                        You have successfully logged out the section.
                    </div>
                    <div className='text-center'>
                        <Link to={'/'} className='btn btn-link'>Home page</Link>
                        <Link to={'/login'} className='btn btn-link'>Login again</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Logout;