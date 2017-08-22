import * as express from 'express';
import * as bodyParser from 'body-parser';
import UsersRoute from './routes/UsersRoute';

const app = express();

app.use(bodyParser.json());
app.use('/users', new UsersRoute().router);

app.listen(3000,() => {
    console.log('Example app listening on port 3000!');
});