import { DB } from "../../../DataAccessLayer/DBfacade";
import { isFailure, isOk, makeFailure, makeOk, Result } from "../../../Result";
import PredicateParser from "../../discount/logic/parser";
import { iPredicate } from "../../discount/logic/Predicate";
import BuyingSubject from "./BuyingSubject";

export class Rule{
    public id: number;
    public predicate: iPredicate;               //the condition (i.e. 'no alcohol for minors', 'only babies can buy iPhones')    
    public description: string;                 //a message explaining the rule
    
    constructor(id:number, predicate:iPredicate, description:string){
        this.id = id;
        this.predicate = predicate;             
        this.description = description;         
    }
}

export default class BuyingPolicy{
    private rules: Map<number,Rule>;            //the rules for buying at the store
    public static SUCCESS: string = "buying policy is respected";
    private static nextId: number = 0;

    constructor(){
        this.rules = new Map();
    }

    public static initLastBuyingId(): Promise<number> 
    {
        let lastIdPromise = DB.getLastBuyingId()

        return new Promise((resolve, reject) => {
            lastIdPromise
            .then(id => {
                if(isNaN(id)) id = 0;
                BuyingPolicy.nextId = id;
                resolve(id);
            })
            .catch(e => reject("problem with dicsount id "))
        })
    }

    public static rebuild(policies: any[]): BuyingPolicy
    {
        let buyingPolicy = new BuyingPolicy();
        for(let policy of policies)
        {
            let predRes = PredicateParser.parse(policy.predicate)
            if(isOk(predRes))
            {
                let rule = new Rule(policy.id, predRes.value ,policy.name);
                buyingPolicy.rules.set(rule.id, rule);
            }
        }
        return buyingPolicy
    }

    //TODO: figure out...
    //the problem: there are 3 possibilities. 1) rule is satisfied, 2) rule is not satisfied, 3) issue with calculation
    // 1=> makeOK, 3 => makeFailue, 2 => ???
    //possibly should return Result<Result<>>???

    //determines if the BuyingPolicy is obeyed (if and only if all Rules are satisfied)
    public isSatisfied = (buyingSubject: BuyingSubject): Result<string> =>{
        for(const [key, rule] of this.rules.entries()){
            const res: Result<boolean> =  rule.predicate.isSatisfied(buyingSubject);
            if(isFailure(res)) return res;
            if(!res.value) return makeOk(rule.description);
        }
        return makeOk(BuyingPolicy.SUCCESS);
    }

    public addPolicy = (predicate: any, policyInWords: string, storeId: number ):Promise<string> =>{
        const predRes: Result<iPredicate> = PredicateParser.parse(predicate);
        if(isFailure(predRes)) return Promise.reject(predRes.message);
        let rule = new Rule(BuyingPolicy.nextId,predRes.value, policyInWords)
        this.rules.set(BuyingPolicy.nextId, rule);
        let addPolicyPromise = DB.addPolicy(storeId, rule);
        BuyingPolicy.nextId++;
        return new Promise((resolve, reject) => addPolicyPromise
        .then(_ =>resolve("successfully added condition to the buying policy")).
        catch(e => reject(e)));
    }

    public removePolicy = (id: number):Promise<string> =>{
        const policy = this.rules.get(id);
        if(policy === undefined)return Promise.reject("polcy does not exist");
        this.rules.delete(id);
        return Promise.resolve(`Policy #${id}: ${policy.description} has been removed`);
    }

    public getPolicies = ():Rule[] =>{
        const output:Rule[] = [];
        this.rules.forEach((rule:Rule, id:number)=>output.push(rule));
        return output;
    }

}