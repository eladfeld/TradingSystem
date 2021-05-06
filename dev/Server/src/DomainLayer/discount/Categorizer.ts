export default interface iCategorizer{
    getProducts: (category: string) => number[];
    // hasProduct: (category: string) => boolean;
    // addProductToCategory: (productId: number, category: string) => void;
    // removeProductFromCategory: (productId: number, category: string) => void;
    // addCategoryToCategory: (parent: string, child: string) => void;
    // moveCategory: (category: string, newParent: string) => void;

}