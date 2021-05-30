export type tComplaint = {author:number, title:string, body:string, id:number};

export class ComplaintsDBDummy{

    private static nextId:number = 0;
    private complaints: tComplaint[];

    constructor(){
        this.complaints = [];
    }

    public addComplaint = async(author:number, title:string, body:string):Promise<void>=>{
        this.complaints.push({author,title,body, id:ComplaintsDBDummy.nextId++});
    }

    public getComplaints = async ():Promise<tComplaint[]> => {
        return [...this.complaints];
    }

    public deleteComplaint = async (id:number):Promise<void> => {
        this.complaints = this.complaints.filter(c => c.id !== id);        
    }


}

export default new ComplaintsDBDummy();