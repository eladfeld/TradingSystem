
import fs from 'fs';


export class Logger
{

    private Logger(){}

    public static log(message: string) : void
    {
        let date = new Date();
        fs.appendFile('logger.log' , `${date} : ${message}\n` , function(err) {
            if (err)
            {
                console.log(`error in log.error: ${err}`);
            }
        });
    }

    public static error(massage: string) : void
    {
        fs.appendFile('error.log', `${new Date()} : error: ${massage}\n`, function(err){
            if(err){
                console.log(`error in log.log: ${err}`);
            }
        });
    }
    
}

