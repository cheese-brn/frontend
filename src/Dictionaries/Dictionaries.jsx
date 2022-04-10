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
import DictionaryRow from "./components/DictionaryRow.jsx";
import {Link} from 'react-router-dom'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import {debounce} from "debounce";

import styles from './styles.css';

import {
  OPEN_GENUSES,
  OPEN_PROPERTIES,
  OPEN_TYPES,
  SET_DATA,
  EDIT_ITEM,
  DELETE_ITEM,
} from "./constants";
import CENTERED_MODAL from "../constants";
import CloseIcon from "@mui/icons-material/Close";

const reducer = (state, action) => {
  switch (action.type) {
  case EDIT_ITEM:
    return({...state, itemId: action.payload});
  case SET_DATA:
    return {...state, items: action.payload};
  case DELETE_ITEM:
    alert('удаление');
    return state;
  default:
    return state;
  }
};

const stateInitializer = (initialState) => {
  return {
    itemId: initialState,
    items: initialState,
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
  const [dictionaryElements, setDictionaryElements] = useState(null);

  const [openNewElemModal, setOpenNewElemModal] = useState(false);
  const [model, setModel] = useState(null);

  const [state, dispatch] = useReducer(reducer, null, stateInitializer);

  const [openConfirmDeleteDialog, setOpenConfirmDeleteDialog] = useState(false);
  const [searchString, setSearchString] = useState('');

  useEffect(() => {
    if (!dictionaryTarget) {
      return;
    }
    fetch(`/${dictionaryTarget}`)
      .then(response => response.json())
      .then(dataArray => {
        setDictionaryElements(dataArray);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dictionaryTarget]);

  useEffect(() => {
    if (state.itemId) {
      let childrenPath, elemPath;
      switch(dictionaryTarget) {
      case OPEN_GENUSES:
        childrenPath = '/vids/rods';
        elemPath = '/rods'
        break;
      case OPEN_TYPES:
        childrenPath = '/strains/vids';
        elemPath = '/vids'
        break;
      case OPEN_PROPERTIES:
        childrenPath = '/subproperties/properties';
        elemPath = '/properties'
      }
      let elementModel = {};
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

  const updateItemsList = () => {
    setTimeout(() => {
      fetch(`/${dictionaryTarget}`)
      .then(response => response.json())
      .then(dataArray => {
        setDictionaryElements(dataArray);
        state.itemId = null;
      });
    }, 1000);
  }

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
    updateItemsList();
  }

  const prepareNewElemModal = () => {
    switch (dictionaryTarget) {
    case OPEN_GENUSES:
      setModel({rodId: 0, name: ''});
      setOpenNewElemModal(true);
      break;
    case OPEN_TYPES:
      fetch('/rods')
        .then(response => response.json())
        .then(genusList => {
          setModel({rodId: genusList[0].id, vidId: null, name: '', genusList});
          setOpenNewElemModal(true);
        })
      break;
    case OPEN_PROPERTIES:
      setModel({
        id: 0,
        name: '',
        description: '',
        isFunc: false,
        subProps: [],
      })
      setOpenNewElemModal(true);
      break;
    }
  }

  const handleNewElemSubmit = () => {
    switch (dictionaryTarget) {
    case OPEN_GENUSES:
      fetch('/rod/send', {
        method: 'POST',
        body: JSON.stringify(model),
      })
      break;
    case OPEN_TYPES:
      fetch('/vid/send',{
        method: 'POST',
        body: JSON.stringify({
          vidId: model.vidId,
          rodId: model.rodId,
          name: model.name,
        })
      })
      break;
    case OPEN_PROPERTIES:
      fetch('/property/send',{
        method: 'POST',
        body: JSON.stringify(model),
      });
      break;
    }
    setModel(null);
    setOpenNewElemModal(false);
    updateItemsList();
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
    updateItemsList();
  }

  const handleSearch = debounce((query) => {
      switch (dictionaryTarget) {
      case OPEN_GENUSES:
        fetch(`/rods/searchByName`, {
          method: 'POST',
          body: query,
        }).then(response => response.json())
          .then(genusesList => {
            setDictionaryElements(genusesList);
          })
        break;
      case OPEN_TYPES:
        fetch(`/vids/searchByName`, {
          method: 'POST',
          body: query,
        }).then(response => response.json())
          .then(typesList => {
            setDictionaryElements(typesList);
          })
        break;
      case OPEN_PROPERTIES:
        // TODO: ожидаем реализацию бэка
        fetch(`/property/searchByName`, {
          method: 'POST',
          body: query,
        }).then(response => response.json())
          .then(propsList => {
            setDictionaryElements(propsList);
          })
        break;
      }

  }, 700);

  // TODO: Переход по первым символам названия
  // TODO: Объединить модалку создания и редактирования, мб вынести в компонент
  return(
    <>
      <div >
        <Typography variant='h4' component='div' align='left'>Справочники приложения</Typography>
        <div style={{display: 'flex', marginTop: '5px'}}>
          <ToggleButtonGroup
            value={dictionaryTarget}
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
        </div>
        {dictionaryTarget &&
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
            >

            </TextField>
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
					    onClick={prepareNewElemModal}
					  >
					    {`Добавить ${getDictionaryByType(dictionaryTarget)}`}
					  </Button>
					</div>
        }
        {!dictionaryTarget &&
          <Typography variant='h5' align='left' color='#9e9e9e'>Выберите справочник для отображения</Typography>
        }
      </div>

      {/*Скорее всего - вынести в компоненты*/}
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

      <Modal
        open={openNewElemModal}
        onClose={() => {
          setOpenNewElemModal(false);
          setModel(null)
        }}
        style={CENTERED_MODAL}
      >
          {openNewElemModal &&
          <Paper sx={{width: '600px', maxHeight: '350px', margin: 'auto', padding: '20px', overflowY: 'scroll'}}>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              <Typography variant='h5'>
                {`Создать элемент: ${getDictionaryByType(dictionaryTarget)}`}
              </Typography>
              <IconButton onClick={() => {
                setOpenNewElemModal(false);
                setModel(null)
              }}>
                <CloseIcon/>
              </IconButton>
            </div>
            <TextField
              label='Название элемента'
              style={{marginTop: '10px', width: '100%', marginBottom: '10px'}}
              value={model.name}
              onChange={(event) => setModel({...model, name: event.target.value})}
            />
            {dictionaryTarget === OPEN_TYPES &&
            <FormControl sx={{marginTop: '10px', marginBottom: '10px', width: '100%'}}>
              <InputLabel id='dictionaries__new-element-genus-field-label'>Относится к роду</InputLabel>
              <Select
                label='Осносится к роду:'
                id='dictionaries__new-element-genus-field'
                labelId='dictionaries__new-element-genus-field-label'
                value={model?.rodId}
                onChange={event => setModel({...model, rodId: event.target.value})}
              >
                {model?.genusList?.map((genus, key) =>
                  <MenuItem value={genus.id} key={key}>{genus.name}</MenuItem>
                )}
              </Select>
            </FormControl>
            }
            <Button
              variant='outlined'
              color='success'
              onClick={handleNewElemSubmit}
            >
              Создать
            </Button>
            <Button
              variant='outlined'
              color='warning'
              onClick={() => {
                setModel(false);
                setOpenNewElemModal(false);
              }}
            >
              Отменить
            </Button>
          </Paper>}
      </Modal>

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