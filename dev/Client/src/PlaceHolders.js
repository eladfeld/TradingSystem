
const makeTransactionRow = (name, quantity, price) => {
    return {name, quantity, price};
}

export const ph_transaction_row = [
    makeTransactionRow("apple",1,10),
    makeTransactionRow("banana",2,20),
    makeTransactionRow("carrot",3,30),
    makeTransactionRow("dark chocolate",4,40),
    makeTransactionRow("eggplant",4,40),
];

const getTransactionRow = () => ph_transaction_row;

const makeSystemTransaction = (user, storeName, total) => {
    return {user, storeName, total, items: getTransactionRow()};
}

export const ph_system_transactions = [
    makeSystemTransaction("Alice", "Walmart", 100),
    makeSystemTransaction("Bob", "Meijer", 200),
    makeSystemTransaction("Charlie", "Costco", 300),
    makeSystemTransaction("Donald", "Farmer Jack", 400)  
]


const makeMessage = (title, body, authorName, authorId) => {
     return {title, body, authorName, authorId};
}
export const ph_complaints = [
    makeMessage("these apples are rotten", "i hate em. i hate em. i hate em. \n".repeat(15), "fratboy313",112),
    makeMessage("they ripped me off", "never coming back. never coming back. never coming back. \n".repeat(15), "fratboy313",112),
    makeMessage("products never came", "they ripped me off. they ripped me off. they ripped me off. \n".repeat(15), "fratboy313",112),
    makeMessage("the tv doesnt work", "it wont even turn on. it wont even turn on. it wont even turn on. \n".repeat(15), "fratboy313",112),
    makeMessage("stole my money", "Ill see you in court! Ill see you in court! Ill see you in court! \n".repeat(15), "fratboy313",112)
];

export const ph_subscribers = [
    "Alice", "Bob", "Charlie", "Donald", "Eugene","Fred", "Gerald", "Hilbert", "Irwing", "Jackson",
    "kelly", "Lary", "Moe", "Norman"
]

export const chat1 = [...ph_complaints];
export const chat2 = [...ph_complaints];
export const chat3 = [...ph_complaints];

export const inbox = [chat1, chat2, chat3];