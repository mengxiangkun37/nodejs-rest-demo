import http from "http";
import Koa from "koa";
import path from "path";
import convert from "koa-convert";
import json from "koa-json";
import xml from "koa-xml";
import Bodyparser from "koa-bodyparser";
import XmlParser from "koa-xml-body";
import wechatBodyParser from "co-wechat-body";
import config from "./config";
var session = require('koa-generic-session');
import {ibdLogger} from './lib/ibd-logger'
import koaStatic from "koa-static-plus";


const app = new Koa()
const bodyparser = Bodyparser()
const xmlParser = XmlParser();
app.keys = ["sj", "shengjing"];

// middlewares
app.use(convert(bodyparser));
app.use(convert(json()));
app.use(convert(xmlParser));
app.use(convert(xml()));
app.use(wechatBodyParser({
    encoding:"UTF-8"
}));

app.use(ibdLogger.config(config.ibdlog));

// static
app.use(convert(koaStatic(path.join(__dirname, '../public'), {
    pathPrefix: ''
})))

// response router
app.use(async(ctx, next) => {
    await require('./routes').routes()(ctx, next)
})

// error logger
app.on('error', async(err, ctx) => {
    console.log('error occured:', err)
})

const port = parseInt(config.port || '4200')
const server = http.createServer(app.callback())

server.listen(port)
server.on('error', (error) => {
    if (error.syscall !== 'listen') {
        throw error
    }
    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(port + ' requires elevated privileges')
            process.exit(1)
            break
        case 'EADDRINUSE':
            console.error(port + ' is already in use')
            process.exit(1)
            break
        default:
            throw error
    }
})
server.on('listening', () => {
    console.log('Listening on port: %d', port)
})

export default app
