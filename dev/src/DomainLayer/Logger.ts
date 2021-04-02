
import fs from 'fs';


export class Logger
{
    private static logger : Logger;

    private Logger(){}

    public static getInstance() : Logger
    {
        if (!Logger.logger)
            Logger.logger = new Logger();
        return Logger.logger;
    }

    public log(message: string) : void
    {
        var date = new Date();
        fs.appendFile("logs/log" , `${date} : ${message}\n` , function(err) {
            if (err)
            {
                console.log("error in log: ${err}");
            }
        });
    }

    public error(massage: string) : void
    {
        fs.appendFile('logs/error.log', `time: ${new Date()}, error: ${massage}\n`, function(err){
            if(err){
                return console.error(err);
            }
        });
    }
}