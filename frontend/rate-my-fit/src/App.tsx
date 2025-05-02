import { useState } from 'react';
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './components/Navbar';
import Router from './router';
import { AuthContext } from './context';
import { UserCredentials } from './types/user';
import { getCredentials } from './utils';
import secureLocalStorage from 'react-secure-storage';

const App = () => {
	const [userCredentials, setUserCredentials] = useState<UserCredentials>(getCredentials());

	return (
		<AuthContext.Provider
			value={[ userCredentials, (newCredentials) => {
				secureLocalStorage.setItem('userCredentials', newCredentials);
				setUserCredentials(newCredentials);
			}]}
		>
			<BrowserRouter>
				<Navbar />
				<Router />
			</BrowserRouter>
		</AuthContext.Provider>
	);
};

export default App;