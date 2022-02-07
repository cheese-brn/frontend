import React, {useEffect, useReducer, useState} from "react";
import {Paper, Typography, Button, Modal, Divider, TextField, ToggleButtonGroup, ToggleButton} from '@mui/material';
import DictionaryRow from "./components/DictionaryRow";
import {Link} from 'react-router-dom'

import styles from './styles.css';

// TODO: Может, есть способ сделать это адекватно?
import {
  OPEN_GENUSES,
  OPEN_PROPERTIES,
  OPEN_TYPES,
  SET_DATA,
  EDIT_ITEM,
  DELETE_ITEM,
  setData
} from "./constants";
import {elementType} from "prop-types";


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

  const [openNewElemModal, setOpenNewElemModal] = useState(false);
  const [newElementModel, setNewElementModel] = useState(null);
  const [model, setModel] = useState(null);

  const [state, dispatch] = useReducer(reducer, null, stateInitializer);

  useEffect(() => {
    if (!dictionaryTarget) {
      return;
    }

    switch (dictionaryTarget) {
    case OPEN_GENUSES:
      setNewElementModel({rodId: 0, name: ''})
      break;
    case OPEN_TYPES:
      setNewElementModel({rodId: 1, vidId: 0, name: ''})
      break;
    case OPEN_PROPERTIES:
      setNewElementModel({
        id: 0,
        name: '',
        description: '',
        isFunc: false,
        subProps: [],
      })
      break;
    }

    fetch(`/${dictionaryTarget}`)
      .then(response => response.json())
      .then(dataArray => {
        dispatch(setData(dataArray));
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
              setModel(elementModel);
            })
        })
    }
  }, [state.itemId]);

  const replaceGenusWithType = (typeId, index) => {
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

  const makeSubpropComponents = (subprops) =>
      subprops.map((subProp, index) => {
        return (
          <>
            <TextField
              label='Название подсвойства'
              value={subProp.name}
              onChange={event => {
                let dataCopy = JSON.parse(JSON.stringify(model))
                dataCopy.children[index].name = event.target.value;
                setModel(dataCopy);
              }}
              style={{marginTop: '15px', marginBottom: '5px', width: '100%'}}
            />
            <Divider/>
          </>);
      });

  const handleSubmit = () => {
    switch (dictionaryTarget) {
    case OPEN_GENUSES:
      fetch('/rod/send', {
        method: 'POST',
        body: {rodId: state.itemId, name: model.elementNewName}
      })
      break;
    case OPEN_TYPES:
      fetch('/vid/send', {
        method: 'POST',
        body: {vidId: state.itemId, name: model.elementNewName, rodId: model.rodId}
      })
      break;
    case OPEN_PROPERTIES:
      fetch('/property/send', {
        method: 'POST',
        body: {
          id: model.itemId,
          name: model.newName,
          description: model.description,
          isFunc: model.isFunc,
          subProps: model.children
        }
      })
      break;
    }
    setModel(null)
  }

  // TODO: Протестировать работу с большим количеством строк, если плохо - виртуализировать
  // TODO: bug - нельзя открыть один и тот же элемент 2 раза подряд
  return(
    <>
      <Paper sx={{margin: '0 0 0 10px', padding: '20px'}}>
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
					<div style={{width: '70%', marginTop: '15px'}}>
					  {state.items?.map((row, index) =>
					    <div key={`dictionary-row-${index}`}>
					      <DictionaryRow data={row} dispatch={dispatch}/>
					      <Divider/>
					    </div>
					  )}
					  <Button
					    variant='contained'
					    color='success'
              sx={{marginTop: '10px'}}
					    onClick={() => {
					      setOpenNewElemModal(true)
					    }}
					  >
					    {`Добавить ${getDictionaryByType(dictionaryTarget)}`}
					  </Button>
					</div>
        }
      </Paper>

      {/*Скорее всего - вынести в компоненты*/}
      <Modal
        open={Boolean(model)}
        onClose={() => setModel(null)}
        // TODO: разобраться с центрированием
        sx={{paddingTop: '200px'}}
      >
        {model !== null ?
					<Paper sx={{width: '600px', maxHeight: '650px', margin: 'auto', padding: '20px', overflowY: 'scroll'}}>
					  <Typography variant='h5'>
					    {`Редактирование: ${getDictionaryByType(model.elementType)} - ${model.name}`}
					  </Typography>
            {/*Костыльно с выделением, но иначе это выносить в state, но не зачем*/}
            <TextField
              sx={{
                marginTop: '10px',
                marginBottom: '10px',
                width: '100%',
              }}
              label='Название элемента'
              value={model.newName}
              onChange={event => {setModel({...model, newName: event.target.value})}}

              color={model.name !== model.newName ? 'warning' : ''}
              focused={model.name !== model.newName}
            />

					  {model.elementType === OPEN_PROPERTIES &&
						<div>
              <Button
                variant='outlined'
                onClick={() => {
                  let dataCopy = JSON.parse(JSON.stringify(model))
                  dataCopy.children.push({id: 0, name: '', dataType: 1});
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
                  onClick={() => replaceGenusWithType(type.id, index)}
                >
                  {`${type.name}`}
						    </p>
						  )}
						</div>
					  }

					  {model.elementType === OPEN_TYPES &&
						<div style={{marginBottom: '10px'}}>
						  <Typography>
								Связанные штаммы:
						  </Typography>
						  {model.children.map((strain, index) =>
                <Link
                  to={`/strain/${strain.id}`}
                  key={`strain-${index}`}
                  style={{display: 'block', marginTop: '10px', textDecoration: 'underline'}}
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
              onClick={handleSubmit}
            >
              Сохранить изменения
            </Button>
            <Button
              style={{marginTop: '10px', marginRight: '10px'}}
              variant='outlined'
              color='warning'
              onClick={() => setModel(null)}
            >
              Отменить изменения
            </Button>
            {/*TODO: Удаление элемента*/}
            <Button
              style={{marginTop: '10px', marginRight: '10px'}}
              variant='outlined'
              color='error'
            >
              Удалить элемент
            </Button>
					</Paper> : <p>Груземса</p>
        }
      </Modal>

      <Modal
        open={openNewElemModal}
        onClose={() => setOpenNewElemModal(false)}
        sx={{paddingTop: '200px'}}
      >
        <Paper sx={{width: '600px', maxHeight: '450px', margin: 'auto', padding: '20px'}}>
          <Typography variant='h5'>
            {`Создать элемент: ${getDictionaryByType(dictionaryTarget)}`}
          </Typography>
          <TextField
            label='Название элемента'
            style={{marginTop: '10px', marginBottom: '10px'}}
          />
          {dictionaryTarget === OPEN_PROPERTIES &&
          <p>a</p>
          }
          {dictionaryTarget === OPEN_GENUSES &&
          <p>б</p>
          }
          {dictionaryTarget === OPEN_TYPES &&
          <p>в</p>
          }
          <Button
            variant='outlined'
            color='success'
          >
            Создать
          </Button>
          <Button
            variant='outlined'
            color='warning'
          >
            Отменить
          </Button>
        </Paper>
      </Modal>
    </>
  );
};

export default Dictionaries;