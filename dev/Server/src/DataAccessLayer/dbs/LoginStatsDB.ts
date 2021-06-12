import { iLoginStatsDB, login_stats, userType } from "../interfaces/iLoginStatsDB";

export class LoginStatsDB implements iLoginStatsDB
{
    updateLoginStats(user_type: userType): Promise<void> {
        throw new Error("Method not implemented.");
    }
    setLoginStatsAtDate(date: Date, guests: number, subscribers: number, owners: number, managers: number, system_manager: number): Promise<void> {
        throw new Error("Method not implemented.");
    }
    getLoginStats(from: Date, until: Date): Promise<login_stats> {
        throw new Error("Method not implemented.");
    }
    public willFail= () =>{
        throw new Error("can not force failure outside of test mode")
    }
    public willSucceed= () =>{
        throw new Error("can not force success outside of test mode")
    }

}