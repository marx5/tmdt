import React, { useEffect, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

// Components
import LoadingSpinner from '../components/LoadingSpinner';
import Message from '../components/Message';
import FormContainer from '../components/UI/FormContainer';

// Redux actions
import { getUserDetails, updateUser } from '../redux/actions/userActions';
import { USER_UPDATE_RESET } from '../redux/constants/userConstants';


const UserEditScreen = (props) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const dispatch = useDispatch();
    const { user, loading, error } = useSelector(state => state.userDetails);

    const { loading: loadingUpdate, error: errorUpdate, success: updateSuccess } = useSelector(state => state.userUpdate);
    // States to handle when to show and hide success message of updation
    const [isSuccess, setIsSuccess] = useState(updateSuccess);

    const userID = props.match.params.id;

    useEffect(() => {
        // If updated successfully
        if (updateSuccess) {
            // Set isSuccess to true to show message 
            setIsSuccess(true);
            // Hiding the success message after 5s
            setTimeout(() => setIsSuccess(false), 5000);
            // Reset update status in state
            dispatch({ type: USER_UPDATE_RESET });
        }
        else {
            // If the user details is not loaded or a different user's details is loaded
            if (!user || user._id !== userID) {
                dispatch(getUserDetails(userID));
            }
            else {
                setName(user.name);
                setEmail(user.email);
                setIsAdmin(user.isAdmin);
            }
        }

    }, [dispatch, user, getUserDetails, updateSuccess]);

    const submitHandler = (e) => {
        e.preventDefault();
        // UPDATE USER FUNCTIONALITY HERE
        dispatch(updateUser({ _id: userID, name, email, isAdmin }));
    }
    return <>
        {loading ? <LoadingSpinner /> : error ? <Message variant='danger' message={error} /> : (
            <>
                <Link to='/admin/userlist' className='btn btn-light my-3'>
                    Quay lại
                </Link>
                <FormContainer>
                    <h1>Chỉnh sửa người dùng</h1>
                    {loadingUpdate && <LoadingSpinner />}
                    {errorUpdate && <Message variant='danger' message={errorUpdate} />}
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
}

export default UserEditScreen;