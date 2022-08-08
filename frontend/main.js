import 'core-js/stable';
import 'regenerator-runtime/runtime';

import Login from '../modules/Login'

const login = new Login('.form-signin')
const signup = new Login('.form-signup')

login.init();
signup.init();

//import './assets/css/style.css';


