import { isOk, Result } from "../Result";
import { Service } from "./Service";

let service : Service = Service.get_instance();
let res: Result<number> = service.login(0 ,"elad", "1234");
if(isOk(res))
    console.log(res.value);
else console.log(res.message);


service.openStore(0);
