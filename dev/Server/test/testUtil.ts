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

export const HASHED_PASSWORD = "7110eda4d09e062aa5e4a390b0a572ac0d2c0220";