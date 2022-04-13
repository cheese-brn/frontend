import {Button, Divider, TextField, Typography} from "@mui/material";
import DictionaryRow from "./DictionaryRow";
import React, {useCallback, useEffect, useState,} from "react";
import {debounce} from "debounce";
import {OPEN_GENUSES, OPEN_PROPERTIES, OPEN_TYPES, openNewElem} from "../constants";
import {getDictionaryByTarget} from "../commons";

const DictionaryTable = ({dictionaryTarget, dispatch, updateTrigger}) => {
  if (!dictionaryTarget) {
    return (<Typography variant='h5' align='left' color='#9e9e9e'>Выберите справочник для отображения</Typography>)
  }

  const [searchString, setSearchString] = useState('');
  const [dictionaryElements, setDictionaryElements] = useState([]);

  const updateItemsList = useCallback(() => {
    setTimeout(() => {
      fetch(`/${dictionaryTarget}`)
        .then(response => response.json())
        .then(dataArray => {
          setDictionaryElements(dataArray);
        });
    }, 1000);
  }, [dictionaryTarget]);

  useEffect(() => updateItemsList(), [updateTrigger]);

  const handleSearch = debounce((query) => {
    if (query.length === 0) {
      updateItemsList();
      return;
    }

    let target;
    switch (dictionaryTarget) {
      case OPEN_GENUSES:
        target = 'rods';
        break;
      case OPEN_TYPES:
        target = 'vids'
        break;
      case OPEN_PROPERTIES:
        target = 'property';
        break;
    }

    fetch(`/${target}/searchByName`, {
      method: 'POST',
      body: query,
    }).then(response => response.json())
      .then(propsList => {
        setDictionaryElements(propsList);
      })
  }, 700);

  return(
    <div style={{width: '70%', marginTop: '15px', display: 'flex', flexDirection: 'column', justifyContent: 'left'}}>
      <TextField
        value={searchString}
        placeholder="Отфильтровать"
        style={{width: '500px', marginBottom: '5px',}}
        onChange={event => {
          setSearchString(event.target.value);
          handleSearch.clear();
          handleSearch(event.target.value);
        }}
      />
      {dictionaryElements?.map((row, index) =>
          <div key={`dictionary-row-${index}`}>
            <DictionaryRow data={row} dispatch={dispatch}/>
            <Divider/>
          </div>
      )}

      <Button
        variant='contained'
        color='success'
        sx={{marginTop: '10px', display: 'flex'}}
        onClick={() => dispatch(openNewElem(dictionaryTarget))}
      >
        {`Добавить ${getDictionaryByTarget(dictionaryTarget)}`}
      </Button>
    </div>
  )
}

export default DictionaryTable;