import { Route, Routes } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';

const PUBLIC_ROUTES = [
    {path: '/signup', component: Signup},
    {path: '/login', component: Login}
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