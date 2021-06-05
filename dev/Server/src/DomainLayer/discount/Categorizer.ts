export default interface iCategorizer{
    //returns list of productIds that belong to a category
    getProducts: (category: string) => number[];
    // hasProduct: (category: string) => boolean;
    // addProductToCategory: (productId: number, category: string) => void;
    // removeProductFromCategory: (productId: number, category: string) => void;
    // addCategoryToCategory: (parent: string, child: string) => void;
    // moveCategory: (category: string, newParent: string) => void;

}