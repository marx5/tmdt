import React from 'react';
import { Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useTranslation } from '../hooks/useTranslation';

const CheckoutSteps = ({ step1, step2, step3 }) => {
    const { t } = useTranslation();

    return (
        <Nav className='justify-content-center mb-4'>
            <Nav.Item>
                {step1 ? (
                    <LinkContainer to='/cart'>
                        <Nav.Link>{t('cart')}</Nav.Link>
                    </LinkContainer>
                ) : (
                    <Nav.Link disabled>{t('cart')}</Nav.Link>
                )}
            </Nav.Item>

            <Nav.Item>
                {step2 ? (
                    <LinkContainer to='/shipping'>
                        <Nav.Link>{t('shipping')}</Nav.Link>
                    </LinkContainer>
                ) : (
                    <Nav.Link disabled>{t('shipping')}</Nav.Link>
                )}
            </Nav.Item>

            <Nav.Item>
                {step3 ? (
                    <LinkContainer to='/placeorder'>
                        <Nav.Link>{t('placeOrder')}</Nav.Link>
                    </LinkContainer>
                ) : (
                    <Nav.Link disabled>{t('placeOrder')}</Nav.Link>
                )}
            </Nav.Item>
        </Nav>
    )
}

export default CheckoutSteps;