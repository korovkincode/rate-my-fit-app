import './App.css';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './components/Navbar';
import Router from './router';

const App = () => {
	return (
		<BrowserRouter>
			<Navbar />
			<Router />
		</BrowserRouter>
	);
};

export default App;