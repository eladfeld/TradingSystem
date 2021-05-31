//The iSubject represent the subject being queried in a predicate
export default interface iSubject{
    //returns the value corresponding to @field. If no value exists, returns undefined.
    //iSubjects can only be queried for values that the getValue function output.
    getValue: (field: string) => Promise<number>;
};

