
import fs from 'fs';


export class Logger
{

    private Logger(){}

    public static log(message: string) : void
    {
        var date = new Date();
        fs.appendFile("logs/logger.log" , `${date} : ${message}\n` , function(err) {
            if (err)
            {
                console.log("error in log: ${err}");
            }
        });
    }

    public static error(massage: string) : void
    {
        fs.appendFile('logs/logger.log', `${new Date()} : error: ${massage}\n`, function(err){
            if(err){
                return console.error(err);
            }
        });
    }
}
