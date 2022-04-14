import React, {useEffect, useReducer, useState} from "react";
import {
  Typography,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';

import styles from './styles.css';

import {
  OPEN_GENUSES,
  OPEN_PROPERTIES,
  OPEN_TYPES,
  EDIT_ITEM,
  OPEN_NEW_ELEM_MODAL,
} from "./constants";

import DictionaryTable from "./components/DictionaryTable";
import NewElemModal from "./components/NewElemModal";
import EditGenusModal from "./components/EditGenusModal";
import EditTypeModal from "./components/EditTypeModal";
import EditPropertyModal from "./components/EditPropertyModal";

const reducer = (state, action) => {
  switch (action.type) {
  case EDIT_ITEM:
    return({...state, itemId: action.payload});
  case OPEN_NEW_ELEM_MODAL:
    return {...state, newElemType: action.payload};
  default:
    return state;
  }
};

const stateInitializer = (initialState) => {
  return {
    itemId: initialState,
    items: initialState,
    newElemType: null,
  };
};

const Dictionaries = () => {
  const [dictionaryTarget, setDictionaryTarget] = useState(null);

  const [tableUpdateTrigger, setTableUpdateTrigger] = useState(0);

  const [state, dispatch] = useReducer(reducer, null, stateInitializer);

  useEffect(() => {
    setTableUpdateTrigger(tableUpdateTrigger + 1);
  }, [state.newElemType]);

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
      <div >
        <Typography variant='h4' component='div' align='left'>Справочники приложения</Typography>
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
        <DictionaryTable dictionaryTarget={dictionaryTarget} dispatch={dispatch} updateTrigger={tableUpdateTrigger}/>
      </div>

      {/*Редактирование элемента*/}
      {getEditModal()}
      {/*Создание элемента*/}
      <NewElemModal elemType={state.newElemType} dispatch={dispatch}/>
    </>
  );
};

export default Dictionaries;