//only 2's powers to maintain mask!!!
export enum ACTION{
    APPOINT_MANAGER = 1 ,
    APPOINT_OWNER = 2,
    INVENTORY_EDITTION = 4,

}

export class Permission
{
    private permissions_mask : number ; 

    constructor(permissions_mask : number)
    {
        this.permissions_mask = permissions_mask;
    }

    //returns true if this action is permitted
    public checkIfPermited(action : ACTION) : boolean
    {
        if ( (this.permissions_mask & action) != 0)
            return true;
        return false;
    }

    public setPermissions(permissions_mask : number) : void
    {
        this.permissions_mask = permissions_mask;
    }

    public getPermissions() : number
    {
        return this.permissions_mask;
    }
}