import { DB } from "../../DataAccessLayer/DBfacade";

//     var privateID = ID();
let current_id: number = 0 //TODO: get biggest id from DB

export function initLastStoreId(): Promise<number>
{
    let lastIdPromise = DB.getLastStoreId();

    return new Promise((resolve, reject) => {
        lastIdPromise
        .then(id => {
            if(isNaN(id)) id = 0;
            current_id = id;
            resolve(id);
        })
        .catch(e => reject("problem with user id "))
    })
}

export var ID = function () {
    return current_id++;
  };

export enum Rating {
  DREADFUL = 1,
  BAD      = 2,
  OK       = 3,
  GOOD     = 4,
  AMAZING  = 5,
}


export class TreeRoot<T> {

    private root: TreeNode<T>;;

    constructor(value: T){
        this.root = new TreeNode<T>(value, this);
    }

    public getRoot(){
        return this.root
    }
    public createChildNode(value: T): TreeNode<T> {
        return this.root.createChildNode(value);
    }

    public hasChildNode(value: T) : boolean {
        if(this.root.value === value){
            return true;
        }
        return this.root.hasChildNode(value);
    }

    public getChildNode(value: T): TreeNode<T> {
        if(this.root.getValue() === value){
            return this.root;
        }
        return this.root.getChildNode(value)
    }

    public toString =() =>{
        return this.root.toString();
    }

}


export class TreeNode<T> {
    root: TreeRoot<T>;
    value: T;
    children: Map<T, TreeNode<T>>;

    constructor(value: T, root: TreeRoot<T>){
        this.root = root;
        this.value = value;
        this.children = new Map<T, TreeNode<T>>();
    }

    public getValue(){
        return this.value
    }

    get childrenCount() {
        return this.children.size;
    }


    public createChildNode(value: T): TreeNode<T> {
        if(this.root.hasChildNode(value)){
            return null;
        }
        const newNode = new TreeNode(value, this.root);
        this.children.set(value, newNode);

        return newNode;
    }

    public hasChildNode(value: T) {
      if(this.children.has(value)){
          return true;
      }
      for(let child of this.children.values()) {
        if(child.hasChildNode(value)){
          return true;
        }
      }
      return false;
    }

    public getChildNode(value: T): TreeNode<T> {
        let node: TreeNode<T> = this.children.get(value);
        if(node){
            return node;
        }
        for(let child of this.children.values()) {
            node = child.getChildNode(value);
            if(node){
                return node;
            }
        }
        return null;
    }

    public toString = ():string => {
        return this.toStringRec(0);
    }

    public toStringRec = (depth:number):string =>{
        var s: string = `${"\t".repeat(depth)}${this.value}\n`;
        for(const [value, child] of this.children){
            s += child.toStringRec(depth+1);
        }
        return s;
    }


    public forEach(func: (t:T) => void)
    {
        func(this.value);
        for(let tree of this.children.values())
        {
            tree.forEach(func);
        }
    }

}
