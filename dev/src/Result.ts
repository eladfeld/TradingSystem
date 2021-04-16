<<<<<<< HEAD
  
=======
>>>>>>> e8e66ecdbd8d774468f5702383c75af652c2f397

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