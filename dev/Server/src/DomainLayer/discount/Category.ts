class CategoryNode {
    value: string;//productId
    children: CategoryNode[] | number[];

    constructor(value: string, children: CategoryNode[] | number[]){
        this.value = value;
        this.children = children;
    }
}
