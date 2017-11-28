import Controller from 'src/Controller';

abstract class AuthenticatedCallerController extends Controller {
    public callerId: string;
}

export default AuthenticatedCallerController;