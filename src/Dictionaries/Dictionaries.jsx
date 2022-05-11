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

import DictionaryTable from "./components/DictionaryTable.jsx";
import NewElemModal from "./components/NewElemModal.jsx";
import EditGenusModal from "./components/EditGenusModal.jsx";
import EditTypeModal from "./components/EditTypeModal.jsx";
import EditPropertyModal from "./components/EditPropertyModal.jsx";
import {getDictionaryByTarget} from "./commons";
import {PageHeader} from "../commons/components";

const reducer = (state, action) => {
  switch (action.type) {
  case OPEN_EDIT_MODAL:
    return {...state, itemId: action.payload, open: true};
    case CLOSE_MODAL:
      return {...state, open: false, openNewElem: false}
  case OPEN_NEW_ELEM_MODAL:
    return {...state, newElemType: action.payload, openNewElem: true};
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
    document.title = 'Справочники приложения';
  }, [])

  useEffect(() => {
    setTableUpdateTrigger(tableUpdateTrigger + 1);
  }, [state.open, state.openNewElem]);

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
        <PageHeader header='Справочники приложения'/>
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
      <NewElemModal elemType={state.newElemType} dispatch={dispatch} open={state.openNewElem}/>
    </>
  );
};

export default Dictionaries;