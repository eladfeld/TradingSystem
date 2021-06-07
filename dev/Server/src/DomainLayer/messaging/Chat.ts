import { tMessage } from "../../db_dummy/ComplaintsDBDummy";
import Message from "./Message";

export default class Chat{
    private messages: Message[];
    private members: number[];

    constructor(members: number[]){
        this.messages = [];
        this.members = members;
    }

    public getMessages = () => this.messages;
    public getMembers = () => this.members;
    public addMessage = (msg:Message) => this.messages.push(msg);
    public toObj = ():tMessage[] => this.messages.map(msg => msg.toObj());
}