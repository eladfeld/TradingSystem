import { iLoginStatsDB, login_stats, userType } from "../interfaces/iLoginStatsDB";

export class LoginStatsDummyDB implements iLoginStatsDB
{
    private logins_table: Map<Date, login_stats> = new Map(); // date -> login_stats
    private isConnected = true;

    updateLoginStats(user_type: userType): Promise<void> 
    {
        // todays date at 00:00
        let today = new Date()
        today.setHours(0,0,0,0)

        let today_stats = this.logins_table.get(today)
        if (today_stats === undefined)
            today_stats = {guests:0, subscribers:0, owners:0, managers:0, system_managers:0}
        switch(user_type)
        {
            case userType.guest:
                today_stats.guests++;
                break;
            case userType.subscriber:
                today_stats.guests--;
                today_stats.subscribers++;
                break;
            case userType.owner:
                today_stats.guests--;
                today_stats.owners++;
                break;
            case userType.manager:
                today_stats.guests--;
                today_stats.managers++;
                break;
            case userType.system_manager:
                today_stats.guests--;
                today_stats.system_managers++;
                break;
        }
        this.logins_table.set(today, today_stats)
        return Promise.resolve()
    }

    setLoginStatsAtDate(date: Date, guests: number, subscribers: number, owners: number, managers: number, system_managers: number): Promise<void> 
    {
        //make sure its 00:00
        date.setHours(0,0,0,0)
        let stats: login_stats = {guests:guests , subscribers:subscribers, owners:owners , managers:managers, system_managers:system_managers}
        this.logins_table.set(date,stats)
        return Promise.resolve()
    }

    getLoginStats(from: Date, until: Date): Promise<login_stats> 
    {
        from.setHours(0,0,0,0)
        until.setHours(0,0,0,0)
        let res_stats: login_stats = {guests:0, subscribers:0, owners:0, managers:0, system_managers:0}
        for(let date of this.logins_table.keys())
        {
            if((date >= from) && (date <= until))
            {
                let stats = this.logins_table.get(date)
                res_stats.guests += stats.guests;
                res_stats.subscribers += stats.subscribers;
                res_stats.managers += stats.managers;
                res_stats.owners += stats.owners;
                res_stats.system_managers += stats.system_managers;
            }
        }
        return Promise.resolve(res_stats)
    }

    public willFail = () =>{
        this.isConnected = false;
    }

    public willSucceed = () =>{
        this.isConnected = true;
    }
    
}