import React, { useEffect, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';

// Components
import LoadingSpinner from '../components/LoadingSpinner';
import Message from '../components/Message';
import FormContainer from '../components/UI/FormContainer';

// Redux actions
import { getUserDetails, updateUser } from '../redux/actions/userActions';
import { USER_UPDATE_RESET } from '../redux/constants/userConstants';

const UserEditScreen = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const dispatch = useDispatch();
    const { user, loading, error } = useSelector(state => state.userDetails);
    const { loading: loadingUpdate, error: errorUpdate, success: updateSuccess } = useSelector(state => state.userUpdate);
    const [isSuccess, setIsSuccess] = useState(updateSuccess);
    const { id: userID } = useParams();

    useEffect(() => {
        if (updateSuccess) {
            setIsSuccess(true);
            setTimeout(() => setIsSuccess(false), 5000);
            dispatch({ type: USER_UPDATE_RESET });
        } else {
            if (!user || user._id !== userID) {
                dispatch(getUserDetails(userID));
            } else {
                setName(user.name);
                setEmail(user.email);
                setIsAdmin(user.isAdmin);
            }
        }
    }, [dispatch, user, userID, updateSuccess]);

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(updateUser({ _id: userID, name, email, isAdmin }));
    }

    return (
        <>
            {loading ? <LoadingSpinner /> : error ? <Message variant='danger' message={error} /> : (
                <>
                    <Link to='/admin/userlist' className='btn btn-light my-3'>
                        Quay lại
                    </Link>
                    <FormContainer>
                        <h1>Chỉnh sửa người dùng</h1>
                        {loadingUpdate && <LoadingSpinner />}
                        {errorUpdate && <Message variant='danger' message={errorUpdate} />}
                        {isSuccess && <Message variant='success' message='Cập nhật thành công' />}
                        {loading ? (
                            <LoadingSpinner />
                        ) : error ? (
                            <Message variant='danger' message={error} />
                        ) : (
                            <Form onSubmit={submitHandler}>
                                <Form.Group controlId='name'>
                                    <Form.Label>Họ tên</Form.Label>
                                    <Form.Control
                                        type='name'
                                        placeholder='Nhập họ tên'
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    ></Form.Control>
                                </Form.Group>

                                <Form.Group controlId='email'>
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type='email'
                                        placeholder='Nhập email'
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    ></Form.Control>
                                </Form.Group>

                                <Form.Group controlId='isadmin'>
                                    <Form.Check
                                        type='checkbox'
                                        label='Là Admin'
                                        checked={isAdmin}
                                        onChange={(e) => setIsAdmin(e.target.checked)}
                                    ></Form.Check>
                                </Form.Group>

                                <Button type='submit' variant='primary'>
                                    Cập nhật
                                </Button>
                            </Form>
                        )}
                    </FormContainer>
                </>
            )}
        </>
    );
}

export default UserEditScreen;