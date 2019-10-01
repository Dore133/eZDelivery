export const addToCart = (id, title) => {
    return(dispatch, getState) => {
        console.log('Item should be added!');
        dispatch({
            type: 'ADDTOCART',
            item: {id, title}
        });
    }
}

export const removeFromCart = (id) => {
    return(dispatch, getState) => {
        dispatch({type: 'REMOVEFROMCART', id});
    }
}
