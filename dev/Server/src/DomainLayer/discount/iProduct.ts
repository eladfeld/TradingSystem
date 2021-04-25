export interface iProduct{
    getId: () => number;
    getPrice: () => number;
    getQuantity: () => number;
    getName: () => string;//not necesary at the moment
}


export class MyProduct implements iProduct{
    id: number;
    price: number;
    quantity: number;
    name: string;

    constructor(id: number, price: number, quantity: number, name: string){
        this.id =id;
        this.price =price;
        this.quantity =quantity;
        this.name =name;
    }

    public getId =(): number => this.id;
    public getPrice =(): number => this.price;
    public getQuantity =(): number => this.quantity;
    public getName =(): string => this.name;
}