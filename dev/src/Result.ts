

export class Result<T>
{
    private isSuccess: boolean;
    private value: T;
    private message: string;

    public constructor(isSuccess: boolean, value: T, message: string)
    {
        this.isSuccess = isSuccess;
        this.value = value;
        this.message = message;
    }

    public static makeOk<T>(value: T): Result<T>
    {
        return new Result(true, value, "Ok");
    }

    public static makeFailure<T>(message: string): Result<T>
    {
        return new Result(false, undefined, message);
    }

    public isOk(): boolean
    {
        return this.isSuccess;
    }

    public getValue(): T
    {
        return this.value;
    }

    public getMessage(): string
    {
        return this.message;
    }
}