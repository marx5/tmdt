import * as cartConstants from '../constants/cartConstants';
import axios from './axiosConfig.js';

export const addToCart = (id, qty, color, size) => async (dispatch, getState) => {
    const { data } = await axios.get(`/api/products/${id}`);

    dispatch({
        type: cartConstants.CART_ADD_ITEM,
        payload: {
            product: data._id,
            name: data.name,
            image: data.image,
            price: data.price,
            countInStock: data.countInStock,
            qty,
            color,
            size
        }
    });

    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
}

export const removeFromCart = (id) => (dispatch, getState) => {
    dispatch({
        type: cartConstants.CART_REMOVE_ITEM,
        payload: id
    });

    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
}

export const saveShippingAddress = (data) => (dispatch) => {
    dispatch({
        type: cartConstants.CART_SAVE_SHIPPING_ADDRESS,
        payload: data
    });

    localStorage.setItem('shippingAddress', JSON.stringify(data));
}

export const savePaymentMethod = (data) => (dispatch) => {
    dispatch({
        type: cartConstants.CART_SAVE_PAYMENT_METHOD,
        payload: data
    });

    localStorage.setItem('paymentMethod', JSON.stringify(data));
}

export const clearCart = () => (dispatch) => {
    dispatch({
        type: cartConstants.CART_CLEAR_ITEMS
    });

    localStorage.removeItem('cartItems');
}