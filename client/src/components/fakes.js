
export const fakeProducts = (storeId) => {
    return [1,2,3,4,5,6,7,8,9].map(productId => {
        return{
            productId: productId,
            productName: `product_${storeId}_${productId}`,
            quantity: 20
        };
    });
};

export const fakeBasket = (storeId) => {
    return {
        storeId: storeId,
        storeName: `store_#${storeId}`,
        products: fakeProducts(storeId)
    }
}

export const fakeCart = () => {
    return [1,2,3,4,5].map(storeId => fakeBasket(storeId));
};