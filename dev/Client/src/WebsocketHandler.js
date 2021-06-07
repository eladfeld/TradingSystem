const SPECIAL_MESSAGE_PREFIX = "$";
const USER_STATS_PREFIX = "login_stats:";

export const handleMessage = (event, getAppState, setAppState) =>{
    if(!event || !event.data || !event.data.length){
        return;
    }
    const c = event.data.charAt(0)
    if(event.data.charAt(0) === SPECIAL_MESSAGE_PREFIX){
        handleSpecialMessage(event, getAppState, setAppState);
        return;
    }
    getAppState().notifications.push(event.data)
    setAppState({notifications: getAppState().notifications})

}

//handle special messages with the SPECIAL_PREFIX
const handleSpecialMessage = (event, getAppState, setAppState) =>{
    if(event.data.startsWith(USER_STATS_PREFIX, 1)){
        const prop = event.data.substring(USER_STATS_PREFIX.length + 1);
        var stats = getAppState().stats
        if (stats === undefined)
            stats= {guests:0 , subscribers:0 , owners:0 , managers:0, system_managers:0}
        stats[prop]++;
        if (prop != "guests")
            stats["guests"]--; 
        console.log(stats)
        setAppState({stats});
    }
} 