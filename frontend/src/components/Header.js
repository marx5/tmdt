import React from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Route } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';

// Redux action
import { logout } from '../redux/actions/userActions';

// Components
import SearchBox from './SearchBox';
import LanguageToggle from './LanguageToggle';

const Header = () => {
    const userLogin = useSelector(state => state.userLogin);
    const dispatch = useDispatch();
    const { userInfo } = userLogin;
    const { t } = useTranslation();

    const logoutHandler = () => {
        dispatch(logout());
    }

    return <header>
        <Navbar bg='dark' variant='dark' expand='lg' collapseOnSelect>
            <Container>
                <LinkContainer to='/'>
                    <Navbar.Brand>ProShop</Navbar.Brand>
                </LinkContainer>
                <Navbar.Toggle aria-controls='basic-navbar-nav' />
                <Navbar.Collapse id='basic-navbar-nav'>
                    <Route render={({ history }) => <SearchBox history={history} />} />
                    <Nav className='ml-auto'>
                        <LinkContainer to='/cart'>
                            <Nav.Link>
                                <i className='fas fa-shopping-cart'></i> {t('cart')}
                            </Nav.Link>
                        </LinkContainer>

                        {/* Rendering dropdown or sign in option based on whether user is logged in or not */}
                        {userInfo ? (
                            <NavDropdown title={userInfo.name} id='username'>
                                <LinkContainer to='/profile'>
                                    <NavDropdown.Item>{t('profile')}</NavDropdown.Item>
                                </LinkContainer>
                                <NavDropdown.Item onClick={logoutHandler}>
                                    {t('logout')}
                                </NavDropdown.Item>
                            </NavDropdown>
                        ) : (
                            <LinkContainer to='/login'>
                                <Nav.Link>
                                    <i className='fas fa-user'></i> {t('login')}
                                </Nav.Link>
                            </LinkContainer>
                        )}

                        {/* Rendering admin menu based on whether logged in user is admin or not */}
                        {userInfo && userInfo.isAdmin && (
                            <NavDropdown title='Admin' id='adminmenu'>
                                <LinkContainer to='/admin/userlist'>
                                    <NavDropdown.Item>{t('users')}</NavDropdown.Item>
                                </LinkContainer>
                                <LinkContainer to='/admin/productlist'>
                                    <NavDropdown.Item>{t('products')}</NavDropdown.Item>
                                </LinkContainer>
                                <LinkContainer to='/admin/orderlist'>
                                    <NavDropdown.Item>{t('orders')}</NavDropdown.Item>
                                </LinkContainer>
                            </NavDropdown>
                        )}

                        <LanguageToggle />

                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    </header>
}

export default Header;