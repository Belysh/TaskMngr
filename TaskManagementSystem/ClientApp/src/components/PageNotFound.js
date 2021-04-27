import React from 'react';
import { Link } from 'react-router-dom';

const PageNotFound = () => {
    return (
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <div className="error-template">
                        <h1>Oops!</h1>
                        <h2>Page Not Found</h2>
                        <div className="error-details">
                            Sorry, an error has occured, requested page not found!
                        </div>
                        <div className="error-actions">
                            <Link to='/'>
                                <input type='button' value='Back to home page' className='btn btn-primary' />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PageNotFound;