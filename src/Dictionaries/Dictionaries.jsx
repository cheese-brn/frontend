import React, {useEffect, useReducer, useState} from "react";
import {
  Paper,
  Typography,
  Button, Modal,
  Divider,
  TextField,
  ToggleButtonGroup,
  ToggleButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Dialog,
  DialogActions,
  DialogTitle,
} from '@mui/material';

import {Link} from 'react-router-dom'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import styles from './styles.css';

import {
  OPEN_GENUSES,
  OPEN_PROPERTIES,
  OPEN_TYPES,
  SET_DATA,
  EDIT_ITEM,
  DELETE_ITEM,
  ADD_ITEM, OPEN_NEW_ELEM_MODAL,
} from "./constants";
import CENTERED_MODAL from "../constants";
import CloseIcon from "@mui/icons-material/Close";
import DictionaryTable from "./components/DictionaryTable";
import NewElemModal from "./components/NewElemModal";

const reducer = (state, action) => {
  switch (action.type) {
  case EDIT_ITEM:
    return({...state, itemId: action.payload});
  case SET_DATA:
    return {...state, items: action.payload};
  case DELETE_ITEM:
    alert('удаление');
    return state;
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

const getDictionaryByType = (type) => {
  switch (type) {
  case OPEN_GENUSES:
    return 'Род';
  case OPEN_PROPERTIES:
    return 'Свойство';
  case OPEN_TYPES:
    return 'Вид';
  default:
    return '';
  }
};

const Dictionaries = () => {
  // TODO: Сделать нормальное состояние компонента
  const [dictionaryTarget, setDictionaryTarget] = useState(null);

  const [openNewElemModal, setOpenNewElemModal] = useState(false);
  const [model, setModel] = useState(null);

  const [tableUpdateTrigger, setTableUpdateTrigger] = useState(0);

  const [state, dispatch] = useReducer(reducer, null, stateInitializer);

  const [openConfirmDeleteDialog, setOpenConfirmDeleteDialog] = useState(false);

  // TODO: протестировать баг с не обновляющимся списком
  useEffect(() => {
    setTableUpdateTrigger(tableUpdateTrigger + 1);
  }, [state.newElemType]);

  useEffect(() => {
    if (state.itemId) {
      let childrenPath, elemPath;
      let elementModel = {};

      switch(dictionaryTarget) {
        case OPEN_GENUSES:
          childrenPath = '/vids/rods';
          elemPath = '/rods';
          break;
        case OPEN_TYPES:
          childrenPath = '/strains/vids';
          elemPath = '/vids';
          break;
        case OPEN_PROPERTIES:
          childrenPath = '/subproperties/properties';
          elemPath = '/properties';
      }

      fetch(`${elemPath}/${state.itemId}`)
        .then(response => response.json())
        .then(elemData => {
          elementModel = elemData;
          elementModel['newName'] = elemData.name;
          elementModel['elementType'] = dictionaryTarget;
          fetch(`${childrenPath}/${state.itemId}`)
            .then(response => response.json())
            .then(array => {
              elementModel['children'] = array;

              // Дополнительно вносим список родов в модель, если цель - вид
              if (dictionaryTarget === OPEN_TYPES) {
                fetch(`/rods`)
                  .then(response => response.json())
                  .then(array => {
                    elementModel['availableGenuses'] = array;
                    setModel(elementModel);
                  })
              } else {
                setModel(elementModel);
              }
            })
        });
    }
  }, [state.itemId]);

  const replaceGenusWithType = (typeId) => {
    fetch(`/vids/${typeId}`)
      .then(response => response.json())
      .then(type => {
        fetch(`/strains/vids/${typeId}`)
          .then(response => response.json())
          .then(strainsArray => {
            type['children'] = strainsArray;
            type['elementType'] = OPEN_TYPES;
            type['newName'] = type.name;
            setModel(type)
          });
      });
  }

  const removeSubproperty = (elementIndex) => {
    let modelCpy = JSON.parse(JSON.stringify(model));
    modelCpy.children.splice(elementIndex, 1);
    setModel(modelCpy);
  };

  const makeSubpropComponents = (subprops) =>
      subprops.map((subProp, index) => {
        return (
          <>
            <div style={{display: 'flex', alignItems: 'center'}}>
              <TextField
                label='Название подсвойства'
                value={subProp.name}
                size='small'
                onChange={event => {
                  let dataCopy = JSON.parse(JSON.stringify(model))
                  dataCopy.children[index].name = event.target.value;
                  setModel(dataCopy);
                }}
                style={{marginTop: '15px', marginBottom: '5px'}}
                fullWidth
              />
              <IconButton
                className='dictionary-button-delete'
                onClick={() => removeSubproperty(index)}
              >
                <DeleteOutlineIcon/>
              </IconButton>
            </div>
            <Divider/>
          </>);
      });

  const handleSubmitChange = () => {
    switch (dictionaryTarget) {
    case OPEN_GENUSES:
      fetch('/rod/send', {
        method: 'POST',
        body: JSON.stringify({rodId: state.itemId, name: model.newName})
      })
      break;
    case OPEN_TYPES:
      fetch('/vid/send', {
        method: 'POST',
        body: JSON.stringify({vidId: state.itemId, name: model.newName, rodId: model.rodId})
      })
      break;
    case OPEN_PROPERTIES:
      fetch('/property/send', {
        method: 'POST',
        body: JSON.stringify({
          id: model.id,
          name: model.newName,
          description: model.description,
          isFunc: model.isFunc,
          subProps: model.children
        })
      })
      break;
    }
    setModel(null);
    state.itemId = null;
  }

  const handleDeleteElement = () => {
    setOpenConfirmDeleteDialog(false);
    switch (dictionaryTarget) {
    case OPEN_GENUSES:
      fetch(`/rod/delete/${state.itemId}`)
      break;
    case OPEN_TYPES:
      fetch(`/vid/delete/${state.itemId}`)
      break;
    case OPEN_PROPERTIES:
      fetch(`/property/delete/${state.itemId}`)
      break;
    }
    setModel(null);
    state.itemId = null;
  }

  // TODO: Переход по первым символам названия
  // TODO: Объединить модалку создания и редактирования, мб вынести в компонент
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
      <Modal
        open={Boolean(model) && !openNewElemModal}
        onClose={() => {
          setModel(null);
          state.itemId = null;
        }}
        style={CENTERED_MODAL}
      >
          {model !== null && !openNewElemModal ?
            <Paper sx={{width: '600px', maxHeight: '350px', margin: 'auto', padding: '20px', overflowY: 'scroll'}}>
              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <Typography variant='h5'>
                  {`Редактирование: ${getDictionaryByType(model.elementType)} - ${model.name}`}
                </Typography>
                <IconButton onClick={() => {
                  setModel(null);
                  state.itemId = null;
                }}>
                  <CloseIcon/>
                </IconButton>
              </div>
              <TextField
                sx={{
                  marginTop: '10px',
                  marginBottom: '10px',
                  width: '100%',
                }}
                label='Название элемента'
                value={model.newName}
                onChange={event => {setModel({...model, newName: event.target.value})}}
              />

              {model.elementType === OPEN_PROPERTIES &&
              <div>
                <Button
                  variant='outlined'
                  onClick={() => {
                    let dataCopy = JSON.parse(JSON.stringify(model))
                    dataCopy.children.push({id: 0, name: '', dataType: 'string'});
                    setModel(dataCopy);
                  }}
                >
                  Добавить подсвойство
                </Button>
                <Typography style={{marginTop: '10px'}}>
                  Подсвойства:
                </Typography>
                {makeSubpropComponents(model.children)}
              </div>
              }

              {model.elementType === OPEN_GENUSES &&
              <div style={{marginBottom: '10px'}}>
                <Typography>
                  Связанные виды:
                </Typography>
                {model.children.map((type, index) =>
                  <p
                    key={`type-${index}`}
                    style={{textDecoration: 'underline', cursor: 'pointer'}}
                    onClick={() => replaceGenusWithType(type.id)}
                  >
                    {`${type.name}`}
                  </p>
                )}
              </div>
              }

              {model.elementType === OPEN_TYPES &&
              <div style={{marginBottom: '10px'}}>
                <FormControl
                  sx={{
                    marginTop: '10px',
                    marginBottom: '10px',
                    width: '100%',
                  }}>
                  <InputLabel id='dictionaries__edit-type__genus-select-label'>Относится к роду</InputLabel>
                  <Select
                    labelId='dictionaries__edit-type__genus-select-label'
                    id='dictionaries__edit-type__genus-select'
                    value={model.rodId || 0}
                    name='rodId'

                    onChange={(event => {setModel({...model, rodId: event.target.value})})}
                  >
                    {model.availableGenuses?.map(genus =>
                      <MenuItem value={genus.id} key={genus.id}>{genus.name}</MenuItem>
                    )}
                  </Select>
                </FormControl>
                <Typography>
                  Связанные штаммы:
                </Typography>
                {model.children.map((strain, index) =>
                  <Link
                    to={`/strain/${strain.id}`}
                    key={`strain-${index}`}
                    style={{display: 'block', marginTop: '10px', textDecoration: 'underline', color: 'black'}}
                    target="_blank"
                  >
                    {`${strain.name}`}
                  </Link>
                )}
              </div>
              }

              <Button
                style={{marginTop: '10px', marginRight: '10px'}}
                variant='outlined'
                color='success'
                onClick={handleSubmitChange}
              >
                Сохранить изменения
              </Button>
              <Button
                style={{marginTop: '10px', marginRight: '10px'}}
                variant='outlined'
                color='warning'
                onClick={() => {
                  setModel(null);
                  state.itemId = null;
                }}
              >
                Отменить изменения
              </Button>
              <Button
                style={{marginTop: '10px', marginRight: '10px'}}
                variant='outlined'
                color='error'
                onClick={() => setOpenConfirmDeleteDialog(true)}
              >
                Удалить элемент
              </Button>
            </Paper> : <p>Груземса</p>
          }
      </Modal>

      <NewElemModal elemType={state.newElemType} dispatch={dispatch}/>

      {/*Подтверждение удаления элемента словаря*/}
      <Dialog
        open={openConfirmDeleteDialog}
        onClose={() => setOpenConfirmDeleteDialog(false)}
      >
        <DialogTitle>
          Вы уверены, что хотите удалить этот элемент?
        </DialogTitle>
        <DialogActions>
          <Button
            onClick={() => setOpenConfirmDeleteDialog(false)}
          >
            Отменить
          </Button>
          <Button
            onClick={handleDeleteElement}
          >
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Dictionaries;