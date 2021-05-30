import Chat from "./Chat";

export default class Inbox{
    private ownerId: number;
    private chats: Chat[];

    constructor(ownerId:number){
        this.ownerId = ownerId;
        this.chats = [];
    }

    public getOwnerId = () => this.ownerId;
    public getChats = () => this.chats;
}