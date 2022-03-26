import app from "./app";

import {RedisHelper} from './RedisHelper';

const config = require("config")

const mongoose = require('mongoose');


app.listen(config.get("PORT"), async () => {
    console.log(`⚡️[NodeJs server]: Server is running at http://localhost:${config.get("PORT")}`)

    mongoose.connect(
        config.get("DB_CONN_STRING"),
        {useUnifiedTopology: true, useNewUrlParser: true},
        () => console.log('connected to mongodb.')
    );


});