import { FC, PropsWithChildren, useEffect, useReducer, useRef } from 'react';

import Cookie from 'js-cookie';

import { ICartProduct, IOrder, ShippingAddress } from '../../interfaces';
import { CartContext, cartReducer } from './';
import telsoApi from '../../api/telsoApi';
import axios from 'axios';

export interface CartState {
    isLoaded: boolean;
    cart: ICartProduct[];
    numberOfItems: number;
    subTotal: number;
    tax: number;
    total: number;
    shippingAddress?: ShippingAddress,
}

const CART_INITIAL_STATE: CartState = {
    isLoaded: false,
    cart: [],
    numberOfItems: 0,
    subTotal: 0,
    tax: 0,
    total: 0,
    shippingAddress: undefined,
}

export const CartProvider: FC<PropsWithChildren> = ({ children }) => {

   const [state, dispatch] = useReducer( cartReducer, CART_INITIAL_STATE);
    const cartCookie = useRef([]);


   useEffect(() => {
    try {
        cartCookie.current = Cookie.get('cart') ? JSON.parse( Cookie.get('cart')! ) : [];
        dispatch({ type: '[Cart] - LoadCart from cookies | storage', payload: cartCookie.current });
    } catch (error) {
        dispatch({ type: '[Cart] - LoadCart from cookies | storage', payload: [] });    
    }
   }, []);
   
   useEffect(() => {

    if( Cookie.get('firstName') !== undefined) {

        const shippingAddress = {
          firstName : Cookie.get('firstName') || '',
          lastName  : Cookie.get('lastName') || '',
          address   : Cookie.get('address') || '',
          address2  : Cookie.get('address2') || '',
          zip       : Cookie.get('zip') || '',
          city      : Cookie.get('city') || '',
          country   : Cookie.get('country') || '',
          phone     : Cookie.get('phone') || '',
        }
  
        dispatch({ type: '[Cart] - LoadAddress from Cookies', payload: shippingAddress })
    }
   }, []);
   
   useEffect(() => {
    if(cartCookie.current.length > 0 && state.cart.length === 0) return;
    Cookie.set('cart', JSON.stringify( state.cart ));
   }, [ state.cart ]);
   
   useEffect(() => {

    const numberOfItems = state.cart.reduce(( prev, current ) => current.quantity + prev , 0);
    const subTotal = state.cart.reduce(( prev, current ) => (current.price * current.quantity) + prev , 0);
    const tax = subTotal * Number(process.env.NEXT_PUBLIC_TAX_RATE || 0 );
    const total = subTotal + tax;

    const orderSummary = {
            numberOfItems,
            subTotal,
            tax,
            total
        }
    
    dispatch({ type: '[Cart] - Update order summary', payload: orderSummary });
   }, [ state.cart ]);
   

    const addProductToCart =  (product: ICartProduct) => {

        const cart = [ ...state.cart ];
        let exists = false;

        for (let oldProduct of cart) {
            if(oldProduct._id === product._id && oldProduct.size === product.size) {
                oldProduct.quantity += product.quantity
                exists = true;
                break;
            }
        }

        if(!exists) {
            cart.push(product);
        }

        dispatch({ type: '[Cart] - Update products in cart', payload: cart });
    }

    const updateCartQuantity = ( product: ICartProduct ) => {
        dispatch({ type: '[Cart] - Change cart quantity', payload: product });
    }

    const removeCartProduct = ( product: ICartProduct ) => {
        dispatch({ type: '[Cart] - Remove product in cart', payload: product });
    }

    const updateAddress = ( address: ShippingAddress ) => {
        Cookie.set('firstName',address.firstName);
        Cookie.set('lastName',address.lastName);
        Cookie.set('address',address.address);
        Cookie.set('address2',address.address2 || '');
        Cookie.set('zip',address.zip);
        Cookie.set('city',address.city);
        Cookie.set('country',address.country);
        Cookie.set('phone',address.phone);
        dispatch({ type: '[Cart] - LoadAddress from Cookies', payload: address });
    }

    const createOrder = async (): Promise<{ hasError: boolean; message: string }> => {


        if( !state.shippingAddress ) {
            throw new Error('No hay dirección de entrega');
        }

        const body: IOrder = {
            orderItems: state.cart.map( p => ({
                ...p, 
                size: p.size!
            })),
            shippingAddress: state.shippingAddress,
            numberOfItems: state.numberOfItems,
            subTotal: state.subTotal,
            tax: state.tax,
            total: state.total,
            isPaid: false
        }

        try {
        
            const { data } = await telsoApi.post<IOrder>('/orders', body);

            dispatch({ type: '[Cart] - Order Complete' })

            return {
                hasError: false,
                message: data._id!
            }

        } catch (error) {
            if( axios.isAxiosError(error) ) {
                return {
                    hasError: true,
                    message: (error.response?.data as any).message
                }
            }

            return {
                hasError: true,
                message: 'Error no controlado, hable con el administrador'
            }
        }
    }

  return (
    <CartContext.Provider value={{
        ...state,
        addProductToCart,
        updateCartQuantity,
        removeCartProduct,
        updateAddress,
        createOrder,
    }}>
        { children }
    </CartContext.Provider>
  )
}