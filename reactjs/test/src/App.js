import React from 'react';
import './App.css';
import {Routes,Route} from 'react-router-dom';
import Home from './components/Home/Home';
import SignUp from './components/SignUp/SignUp';
import ListeUtilisateurs from './components/ListeUtilisateur/ListeUtilisateurs';

class App extends  React.Component {
  render () {
      return <React.Fragment>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/SignUp" element={<SignUp/>} />
          <Route path="/ListeUtilisateurs" element={<ListeUtilisateurs/>} />
        </Routes>
      </React.Fragment>
    
  }
}

export default App;
