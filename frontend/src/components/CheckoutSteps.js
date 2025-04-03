import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Nav } from 'react-bootstrap';

const CheckoutSteps = (props) => {
    return <Nav className='justify-content-center mb-4'>
        <Nav.Item>
            {props.step1 ? (
                <LinkContainer to='/login'>
                    <Nav.Link>Đăng nhập</Nav.Link>
                </LinkContainer>
            ) : (<Nav.Link disabled>Đăng nhập</Nav.Link>)}
        </Nav.Item>

        <Nav.Item>
            {props.step2 ? (
                <LinkContainer to='/shipping'>
                    <Nav.Link>Địa chỉ giao hàng</Nav.Link>
                </LinkContainer>
            ) : (<Nav.Link disabled>Địa chỉ giao hàng</Nav.Link>)}
        </Nav.Item>

        <Nav.Item>
            {props.step3 ? (
                <LinkContainer to='/payment'>
                    <Nav.Link>Thanh toán</Nav.Link>
                </LinkContainer>
            ) : (<Nav.Link disabled>Thanh toán</Nav.Link>)}
        </Nav.Item>

        <Nav.Item>
            {props.step4 ? (
                <LinkContainer to='/placeorder'>
                    <Nav.Link>Đặt hàng</Nav.Link>
                </LinkContainer>
            ) : (<Nav.Link disabled>Đặt hàng</Nav.Link>)}
        </Nav.Item>
    </Nav>;
}

export default CheckoutSteps;