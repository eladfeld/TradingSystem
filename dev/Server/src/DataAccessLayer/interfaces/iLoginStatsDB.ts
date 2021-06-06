export enum userType {
    guest = "guest" , 
    subscriber = "subscriber",
    system_manager = "system_manager",
    owner = "store_owner", 
    manager = "store_manager"
}

export type login_stats = {guests:number, subscribers:number, owners:number, managers:number, system_managers:number}

export interface iLoginStatsDB
{
    updateLoginStats( user_type:userType) : Promise<void>

    // this function is mainly for test purposes
    // to add manually login statistics at specific date 
    setLoginStatsAtDate( date:Date, guests:number, subscribers:number, owners:number, managers:number, system_manager:number) : Promise<void>

    getLoginStats( from:Date, until:Date ) : Promise<login_stats>
}