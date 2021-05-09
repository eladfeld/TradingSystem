export type Result<T> = Ok<T> | Failure;

interface Ok<T> {
    tag: "Ok";
    value: T;
}
​
interface Failure {
    tag: "Failure";
    message: string;
}
​
export const makeOk = <T>(value: T): Result<T> =>
    ({ tag: "Ok", value: value });
​
export const makeFailure = <T>(message: string): Result<T> =>
    ({ tag: "Failure", message: message });
​
export const isOk = <T>(r: Result<T>): r is Ok<T> =>
    r.tag === "Ok";
​
export const isFailure = <T>(r: Result<T>): r is Failure =>
    r.tag === "Failure";

export const ResultsToResult = <T>(results: Result<T>[]): Result<T[]> =>{
    const oks: T[] = [];
    for(var i: number = 0; i<results.length; i++){
        const res: Result<T> = results[i];
        if(isOk(res))
            oks.push(res.value);
        else return res;
    }
    return makeOk(oks);
}