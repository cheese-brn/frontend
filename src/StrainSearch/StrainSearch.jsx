import React, {useState, useEffect, } from "react";
import {Paper, Typography, Select, MenuItem, Button, Divider} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { Link } from 'react-router-dom';

const StrainSearch = () => {
  const [genusList, setGenusList] = useState(null);
  const [typeList, setTypeList] = useState(null);
  const [searchParams, setSearchParams] = useState({genus: -1, type: -1});

  const [searchResult, setSearchResult] = useState(null)


  useEffect(() => {
    fetch('/rods')
      .then(response => response.json())
      .then(genuses => {
        setGenusList(genuses);
      })
  }, []);

  useEffect(() => {
    if (searchParams.genus === -1) {
      fetch('/vids')
        .then(response => response.json())
        .then(types => setTypeList(types));
    } else {
      fetch(`/vids/rods/${searchParams.genus}`)
        .then(response => response.json())
        .then(types => setTypeList(types));
    }
  }, [searchParams.genus]);

  const search = () => {
    if (searchParams.type !== -1) {
      fetch(`/strains/vids/${searchParams.type}`)
        .then(response => response.json())
        .then(strains => setSearchResult(strains))
    }
    else if (searchParams.genus !== -1) {
      // TODO: Ожидаем реализацию бэка
      // fetch(`/strains/rods/${searchParams.type}`)
      //   .then(response => response.json())
      //   .then(strains => setSearchResult(strains))
    }
  }

  // TODO: Высота выборки работает некорректно. Нужно найти способ здесь и в других местах прописать высоту на всё оставшееся место
  return(
    <Paper sx={{margin: '0 10px 0 10px', padding: '20px', height: '85%'}}>
      <Typography variant='h4' component='div' align='left' style={{marginBottom: '10px'}}>Поиск паспорта штамма</Typography>
      <div style={{display: 'flex', flexDirection: 'row', marginBottom: '10px'}}>
        <Typography variant='h5' style={{marginRight: '20px'}}>Относится к роду</Typography>
        <Select
          value={searchParams.genus}
          onChange={event => setSearchParams({...searchParams, genus: event.target.value})}
          style={{width: '300px', height: '35px'}}
        >
          <MenuItem value={-1}>Не выбрано</MenuItem>
          {genusList?.map((genus, key) =>
            <MenuItem value={genus.id} key={`select-genus-${key}`}>{genus.name}</MenuItem>)
          }
        </Select>
      </div>
      <div style={{display: 'flex', flexDirection: 'row', marginBottom: '10px'}}>
        <Typography variant='h5' style={{marginRight: '20px'}}>Относится к виду</Typography>
        <Select
          value={searchParams.type}
          onChange={event => setSearchParams({...searchParams, type: event.target.value})}
          style={{width: '300px', height: '35px'}}
        >
          <MenuItem value={-1}>Не выбрано</MenuItem>
          {typeList?.map((type, key) =>
            <MenuItem value={type.id} key={`select-type-${key}`}>{type.name}</MenuItem>
          )}
        </Select>
      </div>
      <Button
        variant='outlined'
        style={{align: 'left', marginBottom: '10px', display: 'flex'}}
        onClick={search}
      >
        <SearchIcon/>Найти
      </Button>
      <Divider/>
      <div style={{display: 'flex', overflowY: 'scroll'}}>
        {searchResult?.map(strain =>
          <Link to={`/strains/${strain.id}`} style={{color: 'black', fontSize: '20px'}}>{strain.name}</Link>
        )}
      </div>
    </Paper>
  );
}

export default StrainSearch;