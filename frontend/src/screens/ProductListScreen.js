import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Button, Row, Col, Image } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useNavigate } from 'react-router-dom';

// Components
import LoadingSpinner from '../components/LoadingSpinner';
import Message from '../components/Message';

// Redux actions
import { listProducts, deleteProduct, createProduct } from '../redux/actions/productActions';

const ProducListScreen = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const productList = useSelector(state => state.productList);
    const { loading, error, products = [] } = productList;

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    const productDelete = useSelector(state => state.productDelete);
    const { loading: deleteLoading, error: deleteError, success: deleteSuccess } = productDelete;
    const [isSuccess, setIsSuccess] = useState(deleteSuccess);
    const [isError, setIsError] = useState(deleteError);

    const productCreate = useSelector(state => state.productCreate);
    const { loading: createLoading, error: createError, success: createSuccess, product: createdProduct } = productCreate;

    useEffect(() => {
        // Reset the status of product creation on mounting
        dispatch({ type: 'PRODUCT_CREATE_RESET' });

        if (!userInfo || !userInfo.isAdmin) {
            navigate('/login');
        }

        // If the product gets created redirect to edit screen to fill details
        if (createSuccess) {
            navigate(`/admin/product/${createdProduct._id}/edit`);
        }
        else {
            dispatch(listProducts());
        }
        // deleteSuccess to fetch updated list of products
    }, [dispatch, deleteSuccess, createSuccess, navigate, userInfo, createdProduct]);

    // Displaying messages of success or error
    useEffect(() => {
        if (deleteError) {
            setIsError(deleteError);
            setTimeout(() => setIsError(null), 10000);
        }
        if (deleteSuccess) {
            setIsSuccess(true);
            setTimeout(() => setIsSuccess(false), 5000);
        }
        // Reset the delete status after setting the message
        dispatch({ type: 'PRODUCT_DELETE_RESET' });
    }, [dispatch, deleteError, deleteSuccess]);

    const productDeleteHandler = (id) => {
        if (window.confirm('Are you sure want to delete this item?')) {
            dispatch(deleteProduct(id));
        }
    }
    const createProductHandler = () => {
        // + CREATE PRODUCT
        dispatch(createProduct());
    }

    return <>
        <Row className='align-items-center'>
            <Col>
                <h1>Danh sách sản phẩm</h1>
            </Col>
            <Col className='text-right'>
                <Button className='my-3' onClick={createProductHandler}>
                    <i className='fas fa-plus'></i> Thêm sản phẩm
                </Button>
            </Col>
        </Row>
        {isError && <Message variant='danger' message={deleteError} />}
        {isSuccess && <Message variant='success' message='Product succesfully deleted!' />}
        {createLoading && <LoadingSpinner />}
        {createError && <Message variant='danger' message={createError} />}
        {loading ? (
            <LoadingSpinner />
        ) : error ? (
            <Message variant='danger' message={error} />
        ) : (
            <>
                <Table striped bordered hover responsive className='table-sm'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Ảnh</th>
                            <th>Tên sản phẩm</th>
                            <th>Giá</th>
                            <th>Danh mục</th>
                            <th>Thương hiệu</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product._id}>
                                <td>{product._id}</td>
                                <td>
                                    <Image 
                                        src={product.image} 
                                        alt={product.name} 
                                        fluid 
                                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                    />
                                </td>
                                <td>{product.name}</td>
                                <td>{product.price.toLocaleString('vi-VN')} VNĐ</td>
                                <td>{product.category}</td>
                                <td>{product.brand}</td>
                                <td>
                                    <LinkContainer to={`/admin/product/${product._id}/edit`}>
                                        <Button variant='light' className='btn-sm'>
                                            <i className='fas fa-edit'></i>
                                        </Button>
                                    </LinkContainer>
                                    <Button
                                        variant='danger'
                                        className='btn-sm'
                                        onClick={() => productDeleteHandler(product._id)}
                                    >
                                        <i className='fas fa-trash'></i>
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </>
        )}
    </>
}

export default ProducListScreen;