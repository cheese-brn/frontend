import './App.css';
import React from 'react';
import HomePage from "./HomePage/HomePage";
import StainView from "./StainView";
import {AppBar, Toolbar, Typography, IconButton} from "@mui/material";
import {BrowserRouter, Routes, Route, Outlet,} from "react-router-dom";
import Dictionaries from "./Dictionaries";

const App = () => {
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
          <Route path='strain' element={<StainView/>}>
            <Route path=':strainID' element={<StainView/>}/>
          </Route>
          <Route path='dictionaries' element={<Dictionaries/>}/>
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
