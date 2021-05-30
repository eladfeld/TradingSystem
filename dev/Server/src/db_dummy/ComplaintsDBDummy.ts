import Chat from "../DomainLayer/messaging/Chat";
import Inbox from "../DomainLayer/messaging/Inbox";
import Message from "../DomainLayer/messaging/Message";

export type tComplaint = {author:number, title:string, body:string, id:number};
export type tMessage = {author:number, title:string, body:string, id:number};
export type tChat = {messages: tMessage[]};
const SYS_ADMINS_GROUP_ID: number = -1;

class ComplaintsDBDummy{
    //private static nextId:number = 0;
    //private complaints: tComplaint[];
    private chats:Chat[];

    constructor(){
        this.chats = [];
    }

    public addComplaint = async(author:number, title:string, body:string):Promise<void>=>{
        const complaintChat:Chat = new Chat([author, SYS_ADMINS_GROUP_ID]);
        complaintChat.addMessage(new Message(title, body, author));
        this.chats.push(complaintChat);
        //this.complaints.push({author,title,body, id:ComplaintsDBDummy.nextId++});
    }

    public getComplaints = async ():Promise<tComplaint[][]> => {
        return this.chats
                .filter(chat => chat.getMembers().find(member => member === SYS_ADMINS_GROUP_ID))
                .map(chat => chat.toObj())
        //return [...this.complaints];
    }

    public deleteComplaint = async (id:number):Promise<void> => {
        this.chats = this.chats.filter(c => !c.getMessages().find(msg => msg.getId() === id));
        //this.complaints = this.complaints.filter(c => c.id !== id);        
    }
}
const instance = new ComplaintsDBDummy();
export default instance;