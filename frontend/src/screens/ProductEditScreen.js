import React, { useEffect, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { Link } from 'react-router-dom';
import FormContainer from '../components/UI/FormContainer';

// Components
import LoadingSpinner from '../components/LoadingSpinner';
import Message from '../components/Message';

// Redux actions
import { singleProduct, updateProduct } from '../redux/actions/productActions';
import { PRODUCT_UPDATE_RESET } from '../redux/constants/productConstants';

const ProductEditScreen = (props) => {
    console.log(props.match.params.id);
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState('');
    const [brand, setBrand] = useState('');
    const [category, setCategory] = useState('');
    const [countInStock, setCountInStock] = useState(0);
    const [description, setDescription] = useState('');
    const [uploading, setUploading] = useState(false);

    const dispatch = useDispatch();
    const { product, loading, error } = useSelector(state => state.productDetails);

    // const { loading:updateLoading, error:updateError, success:updateSuccess } = useSelector(state => state.userUpdate);
    // States to handle when to show and hide success message of updation
    // const [isSuccess, setIsSuccess] = useState(updateSuccess);

    const productID = props.match.params.id;

    const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = useSelector(state => state.productUpdate);
    const [isUpdateError, setIsUpdateError] = useState(errorUpdate);
    const [isUpdateSuccess, setIsUpdateSuccess] = useState(successUpdate);

    useEffect(() => {
        // If the product details is not loaded or a different product's details is loaded
        if (!product || product._id !== productID) {
            dispatch(singleProduct(productID));
        }
        else {
            setName(product.name);
            setPrice(product.price);
            setImage(product.image);
            setBrand(product.brand);
            setCategory(product.category);
            setCountInStock(product.countInStock);
            setDescription(product.description);
        }
    }, [dispatch, product, productID]);

    useEffect(() => {
        if (successUpdate) {
            setIsUpdateSuccess(true);
            dispatch({ type: PRODUCT_UPDATE_RESET });
            setTimeout(() => setIsUpdateSuccess(false), 5000);
        }
        if (errorUpdate) {
            setIsUpdateError(true);
            dispatch({ type: PRODUCT_UPDATE_RESET });
            setTimeout(() => setIsUpdateError(false), 5000);
        }
    }, [dispatch, successUpdate, errorUpdate]);

    // useEffect(() => {
    //     // If updated successfully
    //     if(updateSuccess) {
    //         // Set isSuccess to true to show message 
    //         setIsSuccess(true);
    //         // Hiding the success message after 5s
    //         setTimeout(() => setIsSuccess(false), 5000);
    //         // Reset update status in state
    //         dispatch({ type: 'USER_UPDATE_RESET' });
    //     }
    // }, []);

    const submitHandler = (e) => {
        e.preventDefault();
        // UPDATE PRODUCT FUNCTIONALITY HERE
        dispatch(updateProduct({
            _id: product._id,
            name,
            price,
            image,
            brand,
            category,
            countInStock,
            description
        }));
    }
    const fileUploadHandler = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);
        try {
            const config = { headers: { 'Content-Type': 'multipart/form-data' } };
            const res = await axios.post('/api/upload', formData, config);
            setImage(res.data);
            setUploading(false);
        }
        catch (error) {
            console.error(error);
            setUploading(false);
        }
    }

    return <>
        <Link to='/admin/productlist' className='btn btn-light my-3'>
            Quay lại
        </Link>
        <FormContainer>
            <h1>Chỉnh sửa sản phẩm</h1>
            {loadingUpdate && <LoadingSpinner />}
            {errorUpdate && <Message variant='danger' message={errorUpdate} />}
            {loading ? (
                <LoadingSpinner />
            ) : error ? (
                <Message variant='danger' message={error} />
            ) : (
                <Form onSubmit={submitHandler}>
                    <Form.Group controlId='name'>
                        <Form.Label>Tên sản phẩm</Form.Label>
                        <Form.Control
                            type='name'
                            placeholder='Nhập tên sản phẩm'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        ></Form.Control>
                    </Form.Group>

                    <Form.Group controlId='price'>
                        <Form.Label>Giá (VNĐ)</Form.Label>
                        <Form.Control
                            type='number'
                            placeholder='Nhập giá'
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        ></Form.Control>
                    </Form.Group>

                    <Form.Group controlId='image'>
                        <Form.Label>Hình ảnh</Form.Label>
                        <Form.Control
                            type='text'
                            placeholder='Nhập URL hình ảnh'
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                        ></Form.Control>
                        <Form.File
                            id='image-file'
                            label='Chọn file'
                            custom
                            onChange={fileUploadHandler}
                        ></Form.File>
                        {uploading && <LoadingSpinner />}
                    </Form.Group>

                    <Form.Group controlId='brand'>
                        <Form.Label>Thương hiệu</Form.Label>
                        <Form.Control
                            type='text'
                            placeholder='Nhập thương hiệu'
                            value={brand}
                            onChange={(e) => setBrand(e.target.value)}
                        ></Form.Control>
                    </Form.Group>

                    <Form.Group controlId='countInStock'>
                        <Form.Label>Số lượng trong kho</Form.Label>
                        <Form.Control
                            type='number'
                            placeholder='Nhập số lượng'
                            value={countInStock}
                            onChange={(e) => setCountInStock(e.target.value)}
                        ></Form.Control>
                    </Form.Group>

                    <Form.Group controlId='category'>
                        <Form.Label>Danh mục</Form.Label>
                        <Form.Control
                            type='text'
                            placeholder='Nhập danh mục'
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        ></Form.Control>
                    </Form.Group>

                    <Form.Group controlId='description'>
                        <Form.Label>Mô tả</Form.Label>
                        <Form.Control
                            as='textarea'
                            rows={3}
                            placeholder='Nhập mô tả'
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        ></Form.Control>
                    </Form.Group>

                    <Button type='submit' variant='primary'>
                        Cập nhật
                    </Button>
                </Form>
            )}
        </FormContainer>
    </>
}

export default ProductEditScreen;