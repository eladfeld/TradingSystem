import { exception } from 'console';
import iBasket from '../iBasket';
import { iProduct } from '../iProduct';
import {SimpleOps, CompositeOps, getSimpleOperator, getCompositeOperator} from './LogicalOperators';
import {CompositePredicate, SimplePredicate, Field, Value} from './Predicate';

//at least 1 #1000 and at least 2 #2000

class MyBasket implements iBasket{
    constructor(){}
    private basket: [number, number, number][] = [
        [1000,100,1],//id, price, quantity
        [2000,200,2],
        [3000,300,3]
    ];
    
    getValue = (field: string):number => {
        const strs: string[] = field.split("_");
        if(strs.length === 2){
            const id: number = parseInt(strs[0]);
            const item: [number, number, number] = this.basket.find(i => i[0]===id);
            switch(strs[1]){
                case "price":
                    return item[1];
                case "quantity":
                    return item[2];
                default:
                    throw exception(`MyCart does not have property '${strs[1]}'`);
            }
        }
        return -1;
    };

    public getItems: () => iProduct[];

    //public getItems = () => this.basket;
}



const val1: Value = new Value(1);
const val2: Value = new Value(2);

const simpPred1: SimplePredicate<MyBasket> = new SimplePredicate(new Field("1000_quantity"), val1, getSimpleOperator(SimpleOps.GTE));



const simpPred2: SimplePredicate<MyBasket> = new SimplePredicate(new Field("2000_quantity"), val2, getSimpleOperator(SimpleOps.GTE));

const compPred: CompositePredicate<MyBasket> = new CompositePredicate(simpPred1, simpPred2, getCompositeOperator(CompositeOps.AND))
const isSatisfied: boolean = compPred.isSatisfied(new MyBasket());
console.log(isSatisfied);

