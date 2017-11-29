import Controller from 'express-easy-routing/Controller';

abstract class AuthenticatedCallerController extends Controller {
    public callerId: string;
}

export default AuthenticatedCallerController;