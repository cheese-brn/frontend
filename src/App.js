import './App.css';
import React, { useReducer } from 'react';
import HomePage from "./HomePage/HomePage";
import StrainView from "./StrainView";
import {AppBar, Toolbar, Typography, IconButton} from "@mui/material";
import {BrowserRouter, Routes, Route, Outlet, Link,} from "react-router-dom";
import Dictionaries from "./Dictionaries";
import Catalogue from "./Catalogue";
import StrainsList from "./StrainsList";
import Utils from "./Utils";
import RestoreDeletedElements from "./Utils/RestoreDeletedElements";
import APP_ACTIONS from "./constants";
import StrainSearch from "./StrainSearch";

const reducer = (state, action) => {
  switch (action.type) {
  case APP_ACTIONS.SET_QUERY:
    return {...state, query: action.payload};
  }
};

const App = () => {
  const [state, dispatch] = useReducer(reducer, {query: null});
  return (
    <div className="App" style={{backgroundColor: '#E3E3E3', minWidth: '1024px', height: '100vh'}}>
      <BrowserRouter>
        <AppBar position='static' sx={{backgroundColor: '#232323'}}>
          <Toolbar variant='dense'>
            <div style={{display: 'flex', justifyContent: 'space-between', width: '100%', alignContent: 'center'}}>
              <Link to={`/`} style={{ color: 'white', textDecoration: 'none' }}>
                <Typography variant='h5'>
                  Штаммы микроорганизмов
                </Typography>
              </Link>
              <IconButton>
                <img src='/assets/notifications-icon.svg'/>
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>

        <Routes>
          <Route path='/' element={<HomePage/>}/>
          <Route path='strain' element={<StrainView/>}>
            <Route path=':strainId' element={<StrainView/>}/>
          </Route>
          <Route path='dictionaries' element={<Dictionaries/>}/>
          <Route path='catalogue' element={<Catalogue appDispatch={dispatch}/>}/>
          <Route path='strains-list' element={<StrainsList query={state.query}/>}/>
          <Route path='utils' element={<Utils/>}/>
          <Route path='utils/restoreDeletedElements' element={<RestoreDeletedElements/>}/>
          <Route path='search' element={<StrainSearch/>}/>
          <Route path='*' element={
            <div>
              404
            </div>
          }/>
        </Routes>
      </BrowserRouter>
      <p
        style={{
          margin: '0px 0px 0px 20px',
          fontSize: 'small',
          color: '#ABABAB',
          textAlign: 'left',
        }}
      >
        2021 АлтГТУ | ГНУ Сибирский научно-исследовательский институт сыроделия
        СРО Россельхозакадемии
      </p>
      <Outlet />
    </div>
  );
};

export default App;
