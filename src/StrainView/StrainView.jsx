import React, {useEffect, useState, useRef} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {
  Paper,
  Typography,
  Grid,
  TextField,
  Divider,
  Stack,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Modal,
  IconButton, DialogTitle, DialogActions, Dialog,
} from "@mui/material";
import SimplePropertyInput from "./components/SimplePropertyInput.jsx";
import CloseIcon from '@mui/icons-material/Close';

import CENTERED_MODAL from "../constants"

import AddBoxIcon from '@mui/icons-material/AddBox';
import DownloadIcon from '@mui/icons-material/Download';

import downloadStrainDocument from "../commons/utils";

// TODO: Сделать предупреждение при перезагрузке/закрытии страницыв режиме редактирования
const StrainView = () => {
  const navigate = useNavigate();
  const {strainId} = useParams();

  // TODO: Реализовать сохранение модели в LocalStorage, чтобы при перезагрузке не терялись данные
  // TODO: Быстрое редактирование текста приводит к тормозам. Нужно как-то буферизировать части локально или типо того
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

  const [openConfirmDeleteDialog, setOpenConfirmDeleteDialog] = useState(false);

  const [isReadOnly, setIsReadOnly] = useState(true);
  const [addPropModalOpened, setAddPropModalOpened] = useState(false);

  const [newPropId, setNewPropId] = useState(0);
  // const [basicProps, setBasicProps] = useState([]);
  const [genusesList, setGenusesList] = useState(null);
  const [typesList, setTypesList] = useState(null);
  const [propertiesList, setPropertiesList] = useState(null);

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

  const handleRemoveSubproperty = (propIndex, subpropIndex) => {
    const newModel = JSON.parse(JSON.stringify(model));
    newModel.factParams[propIndex].subProps.splice(subpropIndex, 1);
    setModel(newModel);
  }

  const handleDeleteStrain = () => {
    fetch(`/strain/delete/${model.id}`, {method: 'POST', headers: {'Content-Type': 'application/json'}})
    navigate('/');
  }

  const handleDownloadDocument = () => {
    fetch('/strains')
      .then(response => response.json())
      .then(strainsList => {
        let strain = strainsList.find(elem => elem.id === model.id);
        downloadStrainDocument(strain.name, model.id)
      })

  }

  // TODO: Разобраться с цветовой палитрой
  // TODO: Разобраться с внешним видом полей, чтобы точно было всё как надо
  // TODO: Оптимизация вида readOnly
  return(
    <>
      <div>
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
                  size='small'
                >
                  <MenuItem value={-1}>Не выбрано</MenuItem>
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
                  size='small'
                >
                  <MenuItem value={-1}>Не выбрано</MenuItem>
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
                size='small'
              />
              <TextField
                sx={costilStyle}
                id='stain-view__modification-field'
                label='Модификация'
                name='modification'
                inputProps={{readOnly: isReadOnly}}
                value={model?.modification}
                onChange={ handleCommonFieldChange }
                size='small'
              />
              <TextField
                sx={costilStyle}
                id='stain-view__obtaining-method-field'
                label='Способ получения'
                name='obtainingMethod'
                inputProps={{readOnly: isReadOnly}}
                value={model?.obtainingMethod}
                onChange={ handleCommonFieldChange }
                size='small'
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
                size='small'
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
                size='small'
                multiline
              />

              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px'}}>
                <Typography variant='h5' align='left'>
                    Свойства штамма
                </Typography>
                {!isReadOnly &&
                  <IconButton color='success' onClick={() => setAddPropModalOpened(true)}>
                    <AddBoxIcon sx={{height: '30px', width: '30px'}}/>
                  </IconButton>
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
                  removeSubpropCallback={handleRemoveSubproperty}
                />);
              })}
            </Stack>
          </Grid>
          <Divider orientation="vertical" flexItem/>
          <Grid item sx={{textAlign: 'left', marginLeft: '15px'}}>
            <Stack>
              {/*TODO: доделать, связано с CB-8*/}
              {/*<Typography variant='h6'>*/}
              {/*  {`Последнее редактирование:`}*/}
              {/*</Typography>*/}
              {/*<Typography>*/}
              {/*	{`${model.author}, ${model.lastEdit}`}*/}
              {/*</Typography>*/}
              {model.id && isReadOnly &&
                <Button
                  variant='contained'
                  onClick={handleDownloadDocument}
                >
                  <DownloadIcon/> Скачать паспорт
                </Button>
              }
              {isReadOnly &&
                <Button
                  variant='contained'
                  onClick={() => {
                    setIsReadOnly(false);
                  }}
                  sx={{marginTop: '20px'}}
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
                  onClick={() => setOpenConfirmDeleteDialog(true)}
                >
                  Удалить штамм
                </Button>
              }
            </Stack>
          </Grid>
        </Grid>
      </div>

      <Modal
        open={addPropModalOpened}
        onClose={() => setAddPropModalOpened(false)}
        style={CENTERED_MODAL}
      >
          <Paper sx={{width: '600px', maxHeight: '450px', margin: 'auto', padding: '20px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              <Typography variant='h5'>
                Добавление нового свойства
              </Typography>
              <IconButton onClick={() => setAddPropModalOpened(false)}>
                <CloseIcon/>
              </IconButton>
            </div>
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

      <Dialog
        open={openConfirmDeleteDialog}
        onClose={() => setOpenConfirmDeleteDialog(false)}
      >
        <DialogTitle>
          Вы уверены, что хотите удалить этот элемент?
        </DialogTitle>
        <DialogActions>
          <Button onClick={() => setOpenConfirmDeleteDialog(false)}>
            Отменить
          </Button>
          <Button onClick={handleDeleteStrain}>
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default StrainView;