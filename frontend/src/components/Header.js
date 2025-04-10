import React, { useRef } from 'react';
import { Navbar, Nav, Container, NavDropdown, Badge } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from '../hooks/useTranslation';
import { Link } from 'react-router-dom';
import './Header.scss';

// Redux action
import { logout } from '../redux/actions/userActions';

// Components
import SearchBox from './SearchBox';
import LanguageToggle from './LanguageToggle';

const Header = () => {
    const dispatch = useDispatch();
    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;
    const cart = useSelector(state => state.cart);
    const { cartItems } = cart;
    const { t } = useTranslation();
    const cartIconRef = useRef(null);

    const logoutHandler = () => {
        dispatch(logout());
    };

    return (
        <header>
            <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
                <Container>
                    <LinkContainer to='/'>
                        <Navbar.Brand>{t('shopName')}</Navbar.Brand>
                    </LinkContainer>

                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <SearchBox />
                        <Nav className="ms-auto">
                            <LinkContainer to='/products'>
                                <Nav.Link>
                                    <i className='fas fa-box'></i> {t('products')}
                                </Nav.Link>
                            </LinkContainer>

                            <LinkContainer to='/cart'>
                                <Nav.Link className="cart-link" ref={cartIconRef}>
                                    <i className='fas fa-shopping-cart'></i> {t('cart')}
                                    {cartItems.length > 0 && (
                                        <Badge pill bg="light" text="dark" className="cart-badge">
                                            {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                                        </Badge>
                                    )}
                                </Nav.Link>
                            </LinkContainer>

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
                                        <i className='fas fa-user'></i> {t('signIn')}
                                    </Nav.Link>
                                </LinkContainer>
                            )}

                            {userInfo && userInfo.isAdmin && (
                                <NavDropdown title={t('admin')} id='adminmenu'>
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
    );
};

export default Header;