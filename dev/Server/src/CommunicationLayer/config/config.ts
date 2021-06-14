import dotenv from 'dotenv';

dotenv.config();

const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || '0.0.0.0
const SERVER_PORT = process.env.SERVER_PORT || 3333;


const SERVER =
{
    hostname: SERVER_HOSTNAME,
    port: SERVER_PORT
}

const Config =
{
    server: SERVER
}

export default Config;
