import { sequelize } from "../connectDb";
import { iLoginStatsDB, login_stats, userType } from "../interfaces/iLoginStatsDB";

export class LoginStatsDB implements iLoginStatsDB
{
    public async updateLoginStats(user_type: userType):Promise<void> 
    {
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

    async setLoginStatsAtDate(date: Date, guests: number, subscribers: number, owners: number, managers: number, system_managers: number): Promise<void> {
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
    }

    public async getLoginStats(from: Date, until: Date) :Promise<login_stats> {
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
    public willFail= () =>{
        throw new Error("can not force failure outside of test mode")
    }
    public willSucceed= () =>{
        throw new Error("can not force success outside of test mode")
    }

}