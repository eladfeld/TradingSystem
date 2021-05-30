import { tMessage } from "../../db_dummy/ComplaintsDBDummy";

export default class Message{
    private static nextId: number = 0;
    private id:number;
    private title:string;
    private body:string;
    private author:number;

    constructor(title:string,body:string,author:number){
        this.title = title;
        this.body = body;
        this.author = author;
        this.id = Message.nextId++;
    }
    public getTitle = () => this.title;
    public getTody = () => this.body;
    public getAuthor = () => this.author;
    public getId = () => this.id;
    public toObj = ():tMessage => {
        return {author:this.author, title:this.title, body:this.body, id:this.id};
    } 

}