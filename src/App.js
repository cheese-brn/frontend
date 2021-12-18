import './App.css';
import React, { useReducer } from 'react';
import HomePage from "./HomePage/HomePage";
import StrainView from "./StrainView";
import {AppBar, Toolbar, Typography, IconButton} from "@mui/material";
import {BrowserRouter, Routes, Route, Outlet,} from "react-router-dom";
import Dictionaries from "./Dictionaries";
import Catalogue from "./Catalogue";
import StrainsList from "./StrainsList";
import APP_ACTIONS from "./constants";

const reducer = (state, action) => {
  switch (action.type) {
  case APP_ACTIONS.SET_QUERY:
    return {...state, query: action.payload}
  }
}

const App = () => {
  const [state, dispatch] = useReducer(reducer, {query: null})
  // dispatch({action: 'test'});
  // const testData = useRef('test');
  return (
    <div className="App" style={{backgroundColor: '#E3E3E3', minWidth: '1024px'}}>
      <AppBar position='static' sx={{backgroundColor: '#232323'}}>
        <Toolbar variant='dense'>
            <Typography variant='h5'>
              CheeseApp
            </Typography>
          <IconButton>
            <img src='/assets/help-icon.svg'/>
          </IconButton>

          <IconButton>
            <img src='/assets/notifications-icon.svg'/>
          </IconButton>
        </Toolbar>
      </AppBar>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<HomePage/>}/>
          <Route path='strain' element={<StrainView/>}>
            <Route path=':strainID' element={<StrainView/>}/>
          </Route>
          <Route path='dictionaries' element={<Dictionaries/>}/>
          <Route path='catalogue' element={<Catalogue appDispatch={dispatch}/>}/>
          <Route path='strains-list' element={<StrainsList query={state.query}/>}/>
          <Route path='*' element={
            <div>
              404
            </div>
          }/>
        </Routes>
      </BrowserRouter>
      <p style={{margin: '0px 0px 0px 20px', fontSize:'small', color:'#ABABAB', textAlign:'left'}}>
        2021 АлтГТУ | ГНУ Сибирский научно-исследовательский институт сыроделия СРО Россельхозакадемии
      </p>
      <Outlet/>
    </div>
  );
}

export default App;
