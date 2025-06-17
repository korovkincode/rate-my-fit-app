import { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import secureLocalStorage from 'react-secure-storage';

import { Container } from '@mui/material';

import { UserCredentials } from './types/user';

import { getCredentials } from './utils';

import { AuthContext } from './context';

import Router from './router';

import Navbar from './components/Navbar';

import './App.css';

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
        <Container sx={{ paddingLeft: {xs: 0}, paddingRight: {xs: 0} }} maxWidth="lg">
          <Navbar />
          <Router />
        </Container>
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

export default App;