import * as express from 'express';
import * as bodyParser from 'body-parser';
import { UsersController } from './controllers/UsersController';

const app = express();

app.use(bodyParser.json());
app.use('/users', new UsersController().expressRouter);

app.listen(3000,() => {
    console.log('Example app listening on port 3000!');
});