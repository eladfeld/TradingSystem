import { sequelize, set_sequelize } from "../connectDb";
import { iLoginStatsDB, login_stats, userType } from "../interfaces/iLoginStatsDB";

export class LoginStatsDB implements iLoginStatsDB
{
    sequelize_backup: any = sequelize;
    public async updateLoginStats(user_type: userType):Promise<void> 
    {
        try{
        // todays date at 00:00
        let today = new Date()
        today.setHours(0,0,0,0)
            let today_stats = await sequelize.models.LoginStats.findOne({ where: { date: today } } )
        

        if (today_stats === null)
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

            await sequelize.models.LoginStats.upsert({
                guests: today_stats.guests,
                subscribers: today_stats.subscribers,
                owners: today_stats.owners,
                managers: today_stats.managers,
                system_managers: today_stats.system_managers,
                date:today,
    
            },
                {where:{date: today}}
            )
            return Promise.resolve()
        }
        catch(e)
        {
            return Promise.reject("database error, please try again later")
        }
    }

    async setLoginStatsAtDate(date: Date, guests: number, subscribers: number, owners: number, managers: number, system_managers: number): Promise<void> {
        try{
            date.setHours(0,0,0,0)
            await sequelize.models.LoginStats.upsert({
                guests: guests,
                subscribers: subscribers,
                owners: owners,
                managers: managers,
                system_managers: system_managers,
                date:date,
    
            },
                {where:{date: date}}
            )
            return Promise.resolve()
        }
        catch(e)
        {
            return Promise.reject("database error, please try again later")
        }
    }

    public async getLoginStats(from: Date, until: Date) :Promise<login_stats> 
    {
        try{
            from.setHours(0,0,0,0)
            until.setHours(0,0,0,0)
            let res_stats: login_stats = {guests:0, subscribers:0, owners:0, managers:0, system_managers:0}

                let relevant_dates = await sequelize.models.LoginStats.findAll({ where: { date: {$between: [from, until] } } } )

                
            for(let stats of relevant_dates)
            {
                if((stats.date >= from) && (stats.date <= until))
                {
                    res_stats.guests += stats.guests;
                    res_stats.subscribers += stats.subscribers;
                    res_stats.managers += stats.managers;
                    res_stats.owners += stats.owners;
                    res_stats.system_managers += stats.system_managers;
                }
            }
            return Promise.resolve(res_stats)
        }
    catch{
        return Promise.reject("database error, please try again later")
    }
    }
    public willFail= () =>{
        this.sequelize_backup = sequelize;
        set_sequelize(undefined)
    }
    public willSucceed= () =>{
        set_sequelize(this.sequelize_backup)
    }

}