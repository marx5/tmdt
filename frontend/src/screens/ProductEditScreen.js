import React, { useEffect, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import FormContainer from '../components/UI/FormContainer';

// Components
import LoadingSpinner from '../components/LoadingSpinner';
import Message from '../components/Message';

// Redux actions
import { singleProduct, updateProduct } from '../redux/actions/productActions';
import { PRODUCT_UPDATE_RESET } from '../redux/constants/productConstants';

const ProductEditScreen = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState('');
    const [brand, setBrand] = useState('');
    const [category, setCategory] = useState('');
    const [countInStock, setCountInStock] = useState(0);
    const [description, setDescription] = useState('');
    const [uploading, setUploading] = useState(false);
    const [sizes, setSizes] = useState([]);
    const [colors, setColors] = useState([]);
    const [sizeQuantities, setSizeQuantities] = useState({});
    const [colorQuantities, setColorQuantities] = useState({});

    const dispatch = useDispatch();
    const { id: productID } = useParams();
    const { product, loading, error } = useSelector(state => state.productDetails);

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
            setSizes(product.sizes || []);
            setColors(product.colors || []);
            setSizeQuantities(product.sizeQuantities || {});
            setColorQuantities(product.colorQuantities || {});
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
            description,
            sizes,
            colors,
            sizeQuantities,
            colorQuantities
        }));
    }

    const fileUploadHandler = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            };

            const { data } = await axios.post('/api/upload', formData, config);

            setImage(data);
            setUploading(false);
        } catch (error) {
            console.error(error);
            setUploading(false);
        }
    };

    const handleSizeChange = (e) => {
        const newSizes = e.target.value.split(',').map(size => size.trim());
        setSizes(newSizes);
    };

    const handleColorChange = (e) => {
        const newColors = e.target.value.split(',').map(color => color.trim());
        setColors(newColors);
    };

    const handleSizeQuantityChange = (size, quantity) => {
        setSizeQuantities(prev => ({
            ...prev,
            [size]: parseInt(quantity) || 0
        }));
    };

    const handleColorQuantityChange = (color, quantity) => {
        setColorQuantities(prev => ({
            ...prev,
            [color]: parseInt(quantity) || 0
        }));
    };

    return (
        <>
            <Link to='/admin/productlist' className='btn btn-light my-3'>
                Go Back
            </Link>
            <FormContainer>
                <h1>Edit Product</h1>
                {loadingUpdate && <LoadingSpinner />}
                {isUpdateError && <Message variant='danger' message={errorUpdate} />}
                {isUpdateSuccess && <Message variant='success' message='Product Updated' />}
                {loading ? (
                    <LoadingSpinner />
                ) : error ? (
                    <Message variant='danger' message={error} />
                ) : (
                    <Form onSubmit={submitHandler}>
                        <Form.Group controlId='name'>
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type='name'
                                placeholder='Enter name'
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            ></Form.Control>
                        </Form.Group>

                        <Form.Group controlId='price'>
                            <Form.Label>Price</Form.Label>
                            <Form.Control
                                type='number'
                                placeholder='Enter price'
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            ></Form.Control>
                        </Form.Group>

                        <Form.Group controlId='image'>
                            <Form.Label>Image</Form.Label>
                            <Form.Control
                                type='text'
                                placeholder='Enter image url'
                                value={image}
                                onChange={(e) => setImage(e.target.value)}
                            ></Form.Control>
                            <Form.Control
                                type='file'
                                id='image-file'
                                label='Choose File'
                                onChange={fileUploadHandler}
                            />
                            {uploading && <LoadingSpinner />}
                        </Form.Group>

                        <Form.Group controlId='brand'>
                            <Form.Label>Brand</Form.Label>
                            <Form.Control
                                type='text'
                                placeholder='Enter brand'
                                value={brand}
                                onChange={(e) => setBrand(e.target.value)}
                            ></Form.Control>
                        </Form.Group>

                        <Form.Group controlId='countInStock'>
                            <Form.Label>Count In Stock</Form.Label>
                            <Form.Control
                                type='number'
                                placeholder='Enter countInStock'
                                value={countInStock}
                                onChange={(e) => setCountInStock(e.target.value)}
                            ></Form.Control>
                        </Form.Group>

                        <Form.Group controlId='category'>
                            <Form.Label>Category</Form.Label>
                            <Form.Control
                                type='text'
                                placeholder='Enter category'
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            ></Form.Control>
                        </Form.Group>

                        <Form.Group controlId='description'>
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                type='text'
                                placeholder='Enter description'
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            ></Form.Control>
                        </Form.Group>

                        <Form.Group controlId='sizes'>
                            <Form.Label>Sizes (comma separated)</Form.Label>
                            <Form.Control
                                type='text'
                                placeholder='Enter sizes (e.g., S, M, L, XL)'
                                value={sizes.map(size => size.size).join(', ')}
                                onChange={handleSizeChange}
                            />
                        </Form.Group>

                        <Form.Group controlId='colors'>
                            <Form.Label>Colors (comma separated)</Form.Label>
                            <Form.Control
                                type='text'
                                placeholder='Enter colors (e.g., Red, Blue, Green)'
                                value={colors.map(color => color.name).join(', ')}
                                onChange={handleColorChange}
                            />
                        </Form.Group>

                        {sizes.length > 0 && (
                            <Form.Group controlId='sizeQuantities'>
                                <Form.Label>Size Quantities</Form.Label>
                                {sizes.map(size => (
                                    <div key={size.size} className='mb-2'>
                                        <Form.Label>{size.size}</Form.Label>
                                        <Form.Control
                                            type='number'
                                            placeholder={`Quantity for ${size.size}`}
                                            value={size.quantity || 0}
                                            onChange={(e) => handleSizeQuantityChange(size.size, e.target.value)}
                                        />
                                    </div>
                                ))}
                            </Form.Group>
                        )}

                        {colors.length > 0 && (
                            <Form.Group controlId='colorQuantities'>
                                <Form.Label>Color Quantities</Form.Label>
                                {colors.map(color => (
                                    <div key={color.name} className='mb-2'>
                                        <Form.Label>{color.name}</Form.Label>
                                        <Form.Control
                                            type='number'
                                            placeholder={`Quantity for ${color.name}`}
                                            value={color.quantity || 0}
                                            onChange={(e) => handleColorQuantityChange(color.name, e.target.value)}
                                        />
                                    </div>
                                ))}
                            </Form.Group>
                        )}

                        <Button type='submit' variant='primary'>
                            Update
                        </Button>
                    </Form>
                )}
            </FormContainer>
        </>
    );
};

export default ProductEditScreen;