import React, {useEffect, useReducer, useState} from "react";
import {Paper, Typography, Button, Modal, Divider, TextField} from '@mui/material';
import DictionaryPage from "./components/DictionaryPage";
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
  const [elementData, setElementData] = useState(null);
  const [openNewElemModal, setOpenNewElemModal] = useState(false)

  const [state, dispatch] = useReducer(reducer, null, stateInitializer);

  useEffect(() => {
    if (!dictionaryTarget) {
      return;
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
      let path;
      switch(dictionaryTarget) {
      case OPEN_GENUSES:
        path = '/vids/rods';
        break;
      case OPEN_TYPES:
        path = '/strains/vids';
        break;
      case OPEN_PROPERTIES:
        path = '/subproperties/properties';
      }

      fetch(`${path}/${state.itemId}`)
        .then(response => response.json())
        .then(array => {
          const name = state.items.find(elem => elem.id === state.itemId).name;

          if (dictionaryTarget !== OPEN_PROPERTIES) {
            setElementData({
              elementName: name,
              elementType: dictionaryTarget,
              children: array,
              elementNewName: name,
            })
          } else {
            fetch(`/properties/${state.itemId}`)
              .then(response => response.json())
              .then(property => {
                debugger
                setElementData({
                  elementName: name,
                  elementType: dictionaryTarget,
                  children: array,
                  elementNewName: name,
                  element: property,
                })
              })
          }
        });
    }
  }, [state.itemId]);

  const replaceGenusWithType = (typeId, index) => {
    fetch(`/strains/vids/${typeId}`)
      .then(response => response.json())
      .then(array => {
        setElementData({
          elementName: elementData.children[index].name,
          elementType: OPEN_TYPES,
          children: array,
          elementNewName: elementData.children[index].name,
        })
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
                let dataCopy = JSON.parse(JSON.stringify(elementData))
                dataCopy.children[index].name = event.target.value;
                setElementData(dataCopy);
              }}
              style={{marginTop: '15px', marginBottom: '5px', width: '100%'}}
            />
            <Divider/>
          </>);
      });

  const handleSubmit = () => {
    // fetch('/strain/send', {
    //   method: 'POST', body: JSON.stringify(model)
    // });
    debugger
    switch (dictionaryTarget) {
    case OPEN_GENUSES:
      fetch('/rod/send', {
        method: 'POST',
        body: {rodId: state.itemId, name: elementData.elementNewName}
      })
      break;
    case OPEN_TYPES:
      fetch('/vid/send', {
        method: 'POST',
        body: {vidId: state.itemId, name: elementData.elementNewName, rodId}
      })
      break;
    case OPEN_PROPERTIES:
      fetch('/property/send', {
        method: 'POST',
        body: {
          id: state.itemId,
          name: elementData.elementNewName,
          description: elementData.element.description,
          isFunc: false,
          subProps: elementData.children
        }
      })
      break;
    }
    setElementData(null)
  }

  // TODO: Протестировать работу с большим количеством строк, если плохо - виртуализировать
  // TODO: Придумать, как нормально менять строку "связанные элементы" под конкретный тип
  return(
    <>
      <Paper sx={{margin: '0 10px 0 10px', padding: '10px'}}>
        <Typography variant='h4' component='div' align='left'>Справочники приложения</Typography>
        <div style={{display: 'flex'}}>
          <DictionaryPage displayName='Роды' onClick={() => setDictionaryTarget(OPEN_GENUSES)}/>
          <DictionaryPage displayName='Виды' onClick={() => setDictionaryTarget(OPEN_TYPES)}/>
          <DictionaryPage displayName='Свойства' onClick={() => setDictionaryTarget(OPEN_PROPERTIES)}/>
        </div>
        {dictionaryTarget &&
					<div style={{width: '70%', paddingLeft: '20px'}}>
					  {state.items?.map((row, index) =>
					    <div key={`dictionary-row-${index}`}>
					      <DictionaryRow data={row} dispatch={dispatch}/>
					      <Divider/>
					    </div>
					  )}
					  <Button
					    variant='contained'
					    color='success'
					    onClick={() => {
					      setOpenNewElemModal(true)
					    }}
					  >
					    {`Добавить ${getDictionaryByType(dictionaryTarget)}`}
					  </Button>
					</div>
        }
      </Paper>

      {/*Явно есть способ сделать модалку лучше, с учётом разности назначений.*/}
      {/*Скорее всего - вынести в компоненты*/}
      <Modal
        open={Boolean(elementData)}
        onClose={() => setElementData(null)}
        // TODO: разобраться с центрированием
        sx={{paddingTop: '200px'}}
      >
        {elementData !== null ?
					<Paper sx={{width: '600px', maxHeight: '450px', margin: 'auto', padding: '20px'}}>
					  <Typography variant='h5'>
					    {`Редактирование: ${getDictionaryByType(elementData.elementType)} - ${elementData.elementName}`}
					  </Typography>
            {/*Костыльно с выделением, но иначе это выносить в state, но не зачем*/}
            <TextField
              sx={{
                marginTop: '10px',
                marginBottom: '10px',
                width: '100%',
              }}
              label='Название элемента'
              value={elementData.elementNewName}
              onChange={event => {setElementData({...elementData, elementNewName: event.target.value})}}

              color={elementData.elementName !== elementData.elementNewName ? 'warning' : ''}
              focused={elementData.elementName !== elementData.elementNewName}
            />

					  {elementData.elementType === OPEN_PROPERTIES &&
						<div>
              <Button
                variant='outlined'
                onClick={() => {
                  let dataCopy = JSON.parse(JSON.stringify(elementData))
                  dataCopy.children.push({id: 0, name: '', dataType: 1});
                  setElementData(dataCopy);
                }}
              >
                Добавить подсвойство
              </Button>
						  <Typography style={{marginTop: '10px'}}>
								Подсвойства:
						  </Typography>
						  {makeSubpropComponents(elementData.children)}
						</div>
					  }

					  {elementData.elementType === OPEN_GENUSES &&
						<>
						  <Typography>
								Связанные виды:
						  </Typography>
						  {elementData.children.map((type, index) =>
						    <p
                  key={`type-${index}`}
                  style={{textDecoration: 'underline', cursor: 'pointer'}}
                  onClick={() => replaceGenusWithType(type.id, index)}
                >
                  {`${type.name}`}
						    </p>
						  )}
						</>
					  }

					  {elementData.elementType === OPEN_TYPES &&
						<div style={{marginBottom: '10px'}}>
						  <Typography>
								Связанные штаммы:
						  </Typography>
						  {elementData.children.map((strain, index) =>
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
              onClick={() => setElementData(null)}
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
        </Paper>
      </Modal>
    </>
  );
};

export default Dictionaries;