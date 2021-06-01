import {assert, expect} from 'chai';
import PaymentSystem from '../src/DomainLayer/apis/PaymentSystem';
import SupplySystem from '../src/DomainLayer/apis/SupplySystem';

export const failTest = (msg: string) =>{
    assert.fail("expect", "got", msg);
}

export const failTestFromError = (e: Error) =>{
    assert.fail("expect", "got", e.message);
}

export const failIfRejected = async <T>(foo:()=>Promise<T>):Promise<T> =>{
    try{
        return await foo();
    }catch(e){
        failTest(`promise was rejected: ${e}`);
    }
}

export const failIfResolved = async (foo:()=>Promise<any>) =>{
    var value: any;
    try{
        value = await foo();
    }catch(e){
        return;
    }
    failTest(`promise was resolved: ${value}`);
}

export const failIfAnyRejected = async (foo:()=>Promise<any>[]) =>{
    const promises:Promise<any>[] =  foo();
    promises.forEach(async p =>{
        try{
            await p;
        }catch(e){
            failTest(`promise was rejected: ${e}`);
        }
    })
}

export const APIsWillSucceed = () =>{
    PaymentSystem.willSucceed();
    SupplySystem.willSucceed();
}

var testId: number = 0;
export const nextId = ():number => testId++;
export const uniqueName = (name:string):string  =>{
    return `${name}_${nextId()}`;
}
export const uniqueAviName = () => {
    return `avi_${nextId()}`;
}
export const uniqueMosheName = () => {
    return `moshe_${nextId()}`;
}
export const uniqueAlufHasportName = () => {
    return `aluf hasport_${nextId()}`;
}
export const uniqueMegaName = () => {
    return `Mega_${nextId()}`;
}


var ready: boolean = true;
export const isReady = () => ready;
export const setReady = (state: boolean) =>ready = state;

export const waitToRun =(cb:()=>any = ()=>{}):Promise<void> =>{
    // if(ready) return Promise.resolve();
    return new Promise((resolve, reject) =>{
        if(ready){
            resolve();
            cb();
            ready = false;
        }
        else{
            setTimeout(async() =>{
                await waitToRun();
                resolve();
            },10)
        }
    })
}

// before(function () {
//     process.env.NODE_ENV = 'test';
//     require('./MyBefore.ts');
//   });


export var check = function(done:Mocha.Done) {
    if (isReady()) done();
    else setTimeout( function(){ check(done) }, 10 );
}

export const HASHED_PASSWORD = "7110eda4d09e062aa5e4a390b0a572ac0d2c0220";