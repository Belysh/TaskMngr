import React, { Component } from 'react';
import { Collapse, Container, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { log_out } from '../redux/actions/AuthActions';
import JwtHelper from '../utils/JwtHelper';
import './NavMenu.css';

class NavMenu extends Component {
    static displayName = NavMenu.name;

    constructor(props) {
        super(props);
        this.subscription = null;

        this.toggleNavbar = this.toggleNavbar.bind(this);
        this.state = {
            collapsed: true
        };

        this.logOut = this.logOut.bind(this);
    }

    toggleNavbar() {
        this.setState({
            collapsed: !this.state.collapsed
        });
    }

    logOut() {
        this.props.dispatch(log_out());
    }

    render() {
        if (!this.props.accessToken) {
            return null;
        }

        const userIsAdmin = JwtHelper.getUserRole(this.props.accessToken) === 'Admin';

        return (
            <header>
                <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3" light>
                    <Container>
                        <NavbarBrand tag={Link} to="/">TaskManagementSystem</NavbarBrand>
                        <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
                        <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={!this.state.collapsed} navbar>
                            <ul className="navbar-nav flex-grow">
                                <NavItem>
                                    <NavLink tag={Link} className="text-dark" to="/">Home</NavLink>
                                </NavItem>
                                {userIsAdmin && 
                                    <NavItem>
                                        <NavLink tag={Link} className="text-dark" to="/users">Users</NavLink>
                                    </NavItem>
                                }
                                <NavItem>
                                    <button className='btn btn-outline-secondary logoutButton' onClick={this.logOut}>Log out</button>
                                </NavItem>
                            </ul>
                        </Collapse>
                    </Container>
                </Navbar>
            </header>
        );
    }
}

const mapStateToProps = (state) => ({
    accessToken: state.AuthReducer.accessToken
});
export default connect(mapStateToProps)(NavMenu);