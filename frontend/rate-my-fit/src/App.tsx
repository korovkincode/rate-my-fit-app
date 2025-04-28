import './App.css';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './components/Navbar';
import Router from './router';
import { useEffect, useState } from 'react';
import { UserCredentials } from './types/user';
import { AuthContext } from './context';

const App = () => {
	const [userCredentials, setUserCredentials] = useState<UserCredentials>({
		userToken: localStorage.getItem('userToken') || '',
		secretToken: localStorage.getItem('secretToken') || '',
	});

	useEffect(() => {
		localStorage.setItem('userToken', userCredentials.userToken);
		localStorage.setItem('secretToken', userCredentials.secretToken);
	}, [userCredentials, setUserCredentials]);

	return (
		<AuthContext.Provider value={[userCredentials, setUserCredentials]}>
			<BrowserRouter>
				<Navbar />
				<Router />
			</BrowserRouter>
		</AuthContext.Provider>
	);
};

export default App;