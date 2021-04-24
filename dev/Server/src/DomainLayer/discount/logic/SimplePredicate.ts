import iPredicate from "./iPredicate";

export default class SimplePredicate implements iPredicate{
    public isSatisfied = (basket: [number, number, number][]):boolean => {
        
        return false;
    };

}