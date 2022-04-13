import './App.css';
import React, { useReducer } from 'react';
import HomePage from "./HomePage";
import StrainView from "./StrainView";
import {AppBar, Toolbar, Typography, IconButton, Paper} from "@mui/material";
import {BrowserRouter, Routes, Route, Outlet, Link,} from "react-router-dom";
import Dictionaries from "./Dictionaries";
import Catalogue from "./Catalogue";
import Utils from "./Utils";
import RestoreDeletedElements from "./Utils/RestoreDeletedElements.jsx";
import StrainSearch from "./StrainSearch";

import { SnackbarProvider } from 'notistack';

const App = () => {
  return (
    <div className="App" style={{backgroundColor: '#E3E3E3', minWidth: '1024px', minHeight: '100vh'}}>
      <SnackbarProvider maxSnack={3}>
        <BrowserRouter>
          <AppBar position='static' sx={{backgroundColor: '#232323'}}>
            <Toolbar variant='dense'>
              <div style={{display: 'flex', justifyContent: 'space-between', width: '100%', alignContent: 'center'}}>
                <Link to={`/`} style={{ color: 'white', textDecoration: 'none', padding: '5px'}}>
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

          <Paper elevation={3} sx={{margin: '0 10px 0 10px', padding: '20px', minHeight: '85vh'}}>
            <Routes>
              <Route path='/' element={<HomePage/>}/>
              <Route path='strain' element={<StrainView/>}>
                <Route path=':strainId' element={<StrainView/>}/>
              </Route>
              <Route path='dictionaries' element={<Dictionaries/>}/>
              <Route path='catalogue' element={<Catalogue/>}/>
              <Route path='utils' element={<Utils/>}/>
              <Route path='utils/restoreDeletedElements' element={<RestoreDeletedElements/>}/>
              <Route path='search' element={<StrainSearch/>}/>
              <Route path='*' element={
                <div>
                  404
                </div>
              }/>
            </Routes>
          </Paper>
        </BrowserRouter>
      </SnackbarProvider>
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
