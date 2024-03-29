//----------- Simple -------------------------------------------------------------

const greaterThan = (a:number, b:number):boolean => a > b;
const lessThan = (a:number, b:number):boolean => a < b;
const greaterThanOrEqual = (a:number, b:number):boolean => a >= b;
const lessThanOrEqual = (a:number, b:number):boolean => a <= b;
const equal = (a:number, b: number):boolean => a === b;
const notEqual = (a:number, b: number):boolean => a !== b;

export const SimpleOps = {
    GREATER_THAN : ">",
    LESS_THAN : "<",
    GTE : ">=",
    LTE : "<=",
    EQUAL : "=",
    NOT_EQUAL : "!="
};
const simpleOpsMap: Map<string, (a: number, b: number)=>boolean> = new Map([
    [SimpleOps.GREATER_THAN, greaterThan],
    [SimpleOps.LESS_THAN, lessThan],
    [SimpleOps.GTE, greaterThanOrEqual],
    [SimpleOps.LTE, lessThanOrEqual],
    [SimpleOps.EQUAL, equal],
    [SimpleOps.NOT_EQUAL, notEqual]
]);

const simpleOpsToStringMap: Map<(a: number, b: number)=>boolean, string> = new Map([
    [greaterThan, SimpleOps.GREATER_THAN],
    [lessThan, SimpleOps.LESS_THAN],
    [greaterThanOrEqual, SimpleOps.GTE],
    [lessThanOrEqual, SimpleOps.LTE],
    [equal, SimpleOps.EQUAL],
    [notEqual, SimpleOps.NOT_EQUAL]
]);

export const getSimpleOperator = (op:string): (a: number, b: number)=>boolean =>{
    return simpleOpsMap.get(op);
}

export const simpleOpToString = (op:(a: number, b: number)=>boolean):string =>{
    return simpleOpsToStringMap.get(op);
}

//----------- Composite -------------------------------------------------------------

const and = (a: boolean, b:boolean): boolean => a && b;
const or = (a: boolean, b:boolean): boolean => a || b;
const xor = (a: boolean, b:boolean): boolean => (a||b) && !(a&&b);
const iff = (a: boolean, b:boolean): boolean => (a&&b) || (!(a||b));
const implies = (a: boolean, b:boolean): boolean => !a || b;

export const CompositeOps = {
    AND: "and",
    OR: "or",
    XOR: "xor",
    IFF: "iff",
    IMPLIES: "=>"
};
const compositeOpsMap: Map<string, (a: boolean, b: boolean)=>boolean> = new Map([
    [CompositeOps.AND, and],
    [CompositeOps.OR, or],
    [CompositeOps.XOR, xor],
    [CompositeOps.IFF, iff],
    [CompositeOps.IMPLIES, implies]
]);
const compositeOpsToStringMap: Map<(a: boolean, b: boolean)=>boolean, string> = new Map([
    [and, CompositeOps.AND],
    [or, CompositeOps.OR],
    [xor, CompositeOps.XOR],
    [iff, CompositeOps.IFF],
    [implies, CompositeOps.IMPLIES]
]);


export const getCompositeOperator = (op:string): (a: boolean, b: boolean)=>boolean =>{
    return compositeOpsMap.get(op);
}
export const compositeOpToString = (op:(a: boolean, b: boolean)=>boolean):string  =>{
    return compositeOpsToStringMap.get(op);
}