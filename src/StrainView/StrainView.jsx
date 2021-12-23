import React, {useEffect, useState, useRef, useMemo} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {Paper, Typography, Grid, TextField, Divider, Stack, Button, Select, MenuItem, FormControl, InputLabel, Modal} from "@mui/material";
import SimplePropertyInput from "./components/SimplePropertyInput";

const StrainView = () => {
  const navigate = useNavigate();
  const {strainId} = useParams();

  // TODO: Реализовать сохранение модели в LocalStorage, чтобы при перезагрузке не терялись данные
  // TODO: Быстрое редактирование текста приводит к тормозам. Нужно как-то буферизировать модель локально или типо того
  const [model, setModel] = useState({
    "id": null,
    "rodId":-1,
    "vidId":-1,
    "annotation":"",
    "exemplar":"",
    "modification":"",
    "obtainingMethod":"",
    "origin":"",
    "factParams":[],
  });
  const modelCopy = useRef(null);

  const [isReadOnly, setIsReadOnly] = useState(true);
  const [addPropModalOpened, setAddPropModalOpened] = useState(false);

  const [newPropId, setNewPropId] = useState(0);
  // const [basicProps, setBasicProps] = useState([]);
  const [genusesList, setGenusesList] = useState(null);
  const [typesList, setTypesList] = useState(null);
  const [propertiesList, setPropertiesList] = useState(null);

  // TODO: Возможно, стоит инициализировать списки через useMemo.
  //  Проблема в том, что не вызывается ре-рендер, в отличии от useState

  useEffect(() => {
    fetch('/rods').then(response => response.json()).then(res => {
      setGenusesList(res);
    });
    fetch('/properties').then(response => response.json()).then(res => {
      setPropertiesList(res);
    });

    if (!strainId) {
      setIsReadOnly(false);
    } else {
      fetch(`/strains/${strainId}`).then(response => response.json()).then(res => {
        setModel(res);
        modelCopy.current = res;
      });
    }
  }, []);

  useEffect(() => {
    if(model.rodId !== -1) {
      fetch(`/vids/rods/${model.rodId}`).then(response => response.json()).then(res => {
        setTypesList(res);
      });
    }
  }, [model.rodId]);

  // TODO: Сделать нормально
  const costilStyle = {
    marginBottom: '14px'
  };

  // TODO: перейти с хэндлов на экшны
  const handleCommonFieldChange = (event) => {
    setModel({...model, [event.target.name]: event.target.value});
  };

  const handleSubPropChange = (propKey, subPropKey, newValue) => {
    const newModel = JSON.parse(JSON.stringify(model));
    newModel.factParams[propKey].subProps[subPropKey].value = newValue;
    setModel(newModel);
  };

  const handleAddSimpleProperty = () => {
    const newModel = JSON.parse(JSON.stringify(model));

    fetch(`/properties/${newPropId}`).then(response => response.json()).then(propertyData => {
      propertyData.subProps = [];
      newModel.factParams.push(propertyData);
      setModel(newModel);
    });
    setAddPropModalOpened(false);
  }

  const handleRemoveSimpleProperty = (propIndex) => {
    const newModel = JSON.parse(JSON.stringify(model));
    newModel.factParams.splice(propIndex, 1);
    setModel(newModel);
  }

  const handleAddSubproperty = (propKey, value) => {
    const newModel = JSON.parse(JSON.stringify(model));
    newModel.factParams[propKey].subProps.push(value);
    setModel(newModel);
  }
  // TODO: Разобраться с цветовой палитрой
  // TODO: Разобраться с внешним видом полей, чтобы точно было всё как надо
  // TODO: Оптимизация вида readOnly
  return(
    <>
      <Paper sx={{margin: '0 10px 0 10px', padding: '10px'}}>
        <Grid container spacing='5'>
          <Grid container sm='6' md='7' lg='8' sx={{paddingRight: '15px', paddingLeft:'20px', }}>
            <Stack orientation='vertical' width={'100%'}>
              <Typography variant='h4' sx={{margin: '15px', textAlign: 'left'}}>
                  Паспорт штамма
              </Typography>
              <FormControl>
                <InputLabel id='stain-view__genus-select-label'>Род</InputLabel>
                <Select
                  sx={{...costilStyle, textAlign: 'left'}}
                  labelId='stain-view__genus-select-label'
                  id='stain-view__genus-select'
                  value={model.rodId}
                  name='rodId'
                  onChange={handleCommonFieldChange}
                  inputProps={{readOnly: isReadOnly}}

                >
                  {genusesList?.map(genus =>
                    <MenuItem value={genus.id} key={genus.id}>{genus.name}</MenuItem>
                  )}
                </Select>
              </FormControl>

              <FormControl>
                <InputLabel id='stain-view__type-select-label'>Вид</InputLabel>
                <Select
                  sx={{...costilStyle, textAlign: 'left'}}
                  labelId='stain-view__type-select-label'
                  id='stain-view__type-select'
                  value={model.vidId}
                  name='vidId'
                  onChange={handleCommonFieldChange}
                  inputProps={{readOnly: isReadOnly || model.rodId === -1}}
                >
                  {typesList?.map(type =>
                    <MenuItem value={type.id} key={type.id}>{type.name}</MenuItem>
                  )}
                </Select>
              </FormControl>

              <TextField
                sx={costilStyle}
                id='stain-view__name-field'
                label='Наименование'
                name='exemplar'
                inputProps={{readOnly: isReadOnly}}
                value={model?.exemplar}
                onChange={ handleCommonFieldChange }
              />
              <TextField
                sx={costilStyle}
                id='stain-view__modification-field'
                label='Модификация'
                name='modification'
                inputProps={{readOnly: isReadOnly}}
                value={model?.modification}
                onChange={ handleCommonFieldChange }
              />
              <TextField
                sx={costilStyle}
                id='stain-view__obtaining-method-field'
                label='Способ получения'
                name='obtainingMethod'
                inputProps={{readOnly: isReadOnly}}
                value={model?.obtainingMethod}
                onChange={ handleCommonFieldChange }
                multiline
              />
              <TextField
                sx={costilStyle}
                id='stain-view__origin-field'
                label='Происхождение'
                name='origin'
                inputProps={{readOnly: isReadOnly}}
                value={model?.origin}
                onChange={ handleCommonFieldChange }
                multiline
              />
              <TextField
                sx={costilStyle}
                id='stain-view__annotation-field'
                label='Аннотация'
                name='annotation'
                inputProps={{readOnly: isReadOnly}}
                value={model?.annotation}
                onChange={ handleCommonFieldChange }
                multiline
              />
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '10px'}}>
                <Typography variant='h5' align='left'>
                    Свойства штамма
                </Typography>
                {!isReadOnly &&
                  <Button
                    variant='contained'
                    color='success'
                    sx={{padding: '3px 8px 3px 8px'}}
                    onClick={() => setAddPropModalOpened(true)}
                  >
                    Добавить свойство
                  </Button>
                }
              </div>
              {model?.factParams?.map((prop, key) => {
                return(<SimplePropertyInput
                  prop={prop}
                  propertyIndex={key}
                  readOnly={isReadOnly}
                  key={`basic-prop-${key}`}
                  valueChangeCallback={handleSubPropChange}
                  removePropCallback={handleRemoveSimpleProperty}
                  addSubpropCallback={handleAddSubproperty}
                />);
              })}
            </Stack>
          </Grid>
          <Divider orientation="vertical" flexItem/>
          <Grid item sx={{textAlign: 'left', marginLeft: '15px'}}>
            <Stack>
              <Typography variant='h6'>
                {`Последнее редактирование:`}
              </Typography>
              {/*TODO: доделать, связано с CB-8*/}
              {/*<Typography>*/}
              {/*	{`${model.author}, ${model.lastEdit}`}*/}
              {/*</Typography>*/}
              {isReadOnly &&
                <Button
                  variant='contained'
                  onClick={() => {
                    setIsReadOnly(false);
                  }}
                >
                  Редактировать
                </Button>
              }
              {!isReadOnly &&
                <Button
                  variant='contained'
                  color='success'
                  sx={{marginTop: '20px'}}
                  onClick={() => {
                    setIsReadOnly(true);
                    fetch('/strain/send', {
                      method: 'POST', body: JSON.stringify(model)
                    });
                  }}>
                    Сохранить изменения
                </Button>}
              {!isReadOnly && model.id &&
              <Button
                variant='contained'
                color='warning'
                sx={{marginTop: '20px'}}
                onClick={() => {
                  setIsReadOnly(true);
                  setModel(modelCopy.current);
                }}>
                Отменить изменения
              </Button>
              }
              {isReadOnly &&
                <Button
                  variant='outlined'
                  color='error'
                  sx={{marginTop: '20px'}}
                  onClick={() => {
                    // TODO: Модалка подтверждения удаления
                    fetch(`/strain/delete/${model.id}`, {method: 'POST', headers: {'Content-Type': 'application/json'}});
                    navigate(-1);
                  }}
                >
                  Удалить штамм
                </Button>
              }
            </Stack>

          </Grid>
        </Grid>
      </Paper>
      <Modal
        open={addPropModalOpened}
        onClose={() => setAddPropModalOpened(false)}
      >
        <Paper sx={{width: '600px', maxHeight: '450px', margin: 'auto', padding: '20px'}}>
          <Typography variant='h5'>
            Добавление нового свойства
          </Typography>
          <Typography>Выберите свойство:</Typography>
          <Select
            sx={{width: '100%'}}
            id='stain-view__new-property-type-select'
            value={newPropId}
            name='vid'
            onChange={event => setNewPropId(event.target.value)}
          >
            {propertiesList
              ?.filter(prop => !Boolean(model.factParams.find(fp => fp.id === prop.id)))
              .map(property =>
              <MenuItem value={property.id} key={property.id}>{property.name}</MenuItem>
            )}
          </Select>
          <Button
            variant='contained'
            color='success'
            sx={{padding: '3px 8px 3px 8px'}}
            onClick={handleAddSimpleProperty}
            >
            Добавить
          </Button>
        </Paper>
      </Modal>
    </>
  );
};

export default StrainView;