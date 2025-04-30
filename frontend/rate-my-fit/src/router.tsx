import { Route, Routes } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Profile from './pages/Profile';

const PUBLIC_ROUTES = [
    {path: '/signup', component: Signup},
    {path: '/login', component: Login},
    {path: '/user/:userID', component: Profile}
];

const Router = () => {
    return (
        <Routes>
            {
                PUBLIC_ROUTES.map(route => 
                    <Route key={route.path} path={route.path} element={<route.component />} />    
                )
            }
        </Routes>
    );
};

export default Router;