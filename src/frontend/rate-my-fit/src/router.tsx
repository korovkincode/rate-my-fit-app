import { Route, Routes } from 'react-router-dom';
import Main from './pages/Main';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Fit from './pages/Fit';
import Search from './pages/Search';

const PUBLIC_ROUTES = [
    {path: '/', component: Main},
    {path: '/signup', component: Signup},
    {path: '/login', component: Login},
    {path: '/user/:userID', component: Profile},
    {path: '/fit/:fitID', component: Fit},
    {path: '/search/:searchQuery', component: Search}
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