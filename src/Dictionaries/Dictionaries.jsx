import React, {useEffect, useReducer, useState} from "react";
import {
  Typography,
  ToggleButtonGroup,
  ToggleButton, Button,
} from '@mui/material';

import styles from './styles.css';

import {
  OPEN_GENUSES,
  OPEN_PROPERTIES,
  OPEN_TYPES,
  OPEN_EDIT_MODAL,
  OPEN_NEW_ELEM_MODAL, CLOSE_MODAL, openNewElem,
} from "./constants";

import DictionaryTable from "./components/DictionaryTable";
import NewElemModal from "./components/NewElemModal";
import EditGenusModal from "./components/EditGenusModal";
import EditTypeModal from "./components/EditTypeModal";
import EditPropertyModal from "./components/EditPropertyModal";
import {getDictionaryByTarget} from "./commons";

const reducer = (state, action) => {
  switch (action.type) {
  case OPEN_EDIT_MODAL:
    return {...state, itemId: action.payload, open: true};
    case CLOSE_MODAL:
      return {...state, open: false}
  case OPEN_NEW_ELEM_MODAL:
    return {...state, newElemType: action.payload, open: true};
  default:
    return state;
  }
};

const stateInitializer = (initialState) => {
  return {
    itemId: initialState,
    items: initialState,
    newElemType: null,
    open: false,
  };
};

const Dictionaries = () => {
  const [dictionaryTarget, setDictionaryTarget] = useState(null);

  const [tableUpdateTrigger, setTableUpdateTrigger] = useState(0);

  const [state, dispatch] = useReducer(reducer, null, stateInitializer);

  useEffect(() => {
    setTableUpdateTrigger(tableUpdateTrigger + 1);
  }, [state.open]);

  const replaceGenusWithType = () => {
    setDictionaryTarget(OPEN_TYPES);
  }

  const getEditModal = () => {
    switch (dictionaryTarget) {
      case OPEN_GENUSES:
        return <EditGenusModal genusId={state.itemId} openTypeCallback={replaceGenusWithType} dispatch={dispatch}/>
      case OPEN_TYPES:
        return <EditTypeModal typeId={state.itemId} dispatch={dispatch}/>
      case OPEN_PROPERTIES:
        return <EditPropertyModal propId={state.itemId} dispatch={dispatch}/>
    }
  }

  // TODO: Переход по первым символам названия
  return(
    <>
      <div style={{width: '70vw'}}>
        <Typography variant='h4' component='div' align='left'>Справочники приложения</Typography>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
          <ToggleButtonGroup
            value={dictionaryTarget}
            style={{display: 'flex', marginTop: '5px'}}
            onChange={(event, newTarget) => setDictionaryTarget(newTarget)}
            exclusive
          >
            <ToggleButton
              value={OPEN_GENUSES}
              color='primary'
              style={{width: '120px'}}
            >
              <Typography sx={{fontWeight: 'bold'}}>Роды</Typography>
            </ToggleButton>
            <ToggleButton
              value={OPEN_TYPES}
              color='primary'
              style={{width: '120px'}}
            >
              <Typography sx={{fontWeight: 'bold'}}>Виды</Typography>
            </ToggleButton>
            <ToggleButton
              value={OPEN_PROPERTIES}
              color='primary'
              style={{width: '120px'}}
            >
              <Typography sx={{fontWeight: 'bold'}}>Свойства</Typography>
            </ToggleButton>
          </ToggleButtonGroup>
          { dictionaryTarget &&
            <Button
            variant='contained'
            color='success'
            sx={{marginTop: '10px', display: 'flex'}}
            onClick={() => dispatch(openNewElem(dictionaryTarget))}
          >
            {`Добавить ${getDictionaryByTarget(dictionaryTarget)}`}
          </Button>}
        </div>
        <DictionaryTable dictionaryTarget={dictionaryTarget} dispatch={dispatch} updateTrigger={tableUpdateTrigger}/>
      </div>

      {/*Редактирование элемента*/}
      {state.open && getEditModal()}
      {/*Создание элемента*/}
      <NewElemModal elemType={state.newElemType} dispatch={dispatch} open={state.open}/>
    </>
  );
};

export default Dictionaries;