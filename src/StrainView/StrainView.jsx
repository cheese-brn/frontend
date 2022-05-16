import React, {useEffect, useState} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {
  Paper,
  Typography,
  Grid,
  Divider,
  Stack,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Modal,
  IconButton, DialogTitle, DialogActions, Dialog, Checkbox, FormControlLabel
} from "@mui/material";
import PropertyInput from "./components/PropertyInput.jsx";
import CloseIcon from '@mui/icons-material/Close';

import CENTERED_MODAL from "../constants"

import AddBoxIcon from '@mui/icons-material/AddBox';
import DownloadIcon from '@mui/icons-material/Download';

import downloadStrainDocument from "../commons/utils";
import {useRequest} from "../commons/hooks";
import SimpleProperty from "./components/SimpleProperty.jsx";
import {PageHeader} from "../commons/components";

const basicFields = [
  {
    id: 'stain-view__name-field',
    label: 'Наименование',
    name: 'exemplar',
  },
  {
    id: 'stain-view__modification-field',
    label: 'Модификация',
    name: 'modification',
  },
  {
    id: 'stain-view__obtaining-method-field',
    label: 'Способ получения',
    name: 'obtainingMethod',
  },
  {
    id: 'stain-view__origin-field',
    label: 'Происхождение',
    name: 'origin',
  },
  {
    id: 'stain-view__annotation-field',
    label: 'Аннотация',
    name: 'annotation',
  },
]

// TODO: Сделать предупреждение при перезагрузке/закрытии страницы в режиме редактирования
const StrainView = () => {
  const navigate = useNavigate();
  const {strainId} = useParams();
  const makeRequest = useRequest()

  // TODO: Реализовать сохранение модели в LocalStorage, чтобы при перезагрузке не терялись данные
  const [model, setModel] = useState({
    id: null,
    rodId: -1,
    vidId: -1,
    isLost: false,
    annotation: "",
    exemplar:"",
    modification:"",
    obtainingMethod:"",
    origin:"",
    factParams:[],
  });

  const [isReadOnly, setIsReadOnly] = useState(true);
  const [addPropModalOpened, setAddPropModalOpened] = useState(false);
  const [openConfirmDeleteDialog, setOpenConfirmDeleteDialog] = useState(false);

  const [newPropId, setNewPropId] = useState(0);

  // Справочники
  const [genusesList, setGenusesList] = useState(null);
  const [typesList, setTypesList] = useState(null);
  const [propertiesList, setPropertiesList] = useState(null);

  const loadModel = () => {
    console.log('in load function')
    fetch(`http://127.0.0.1:8080/strains/${strainId}`).then(response => response.json()).then(res => {
      setModel(res);

    });
  }

  useEffect(() => {
    document.title = 'Редактирование паспорта штамма';

    fetch('http://127.0.0.1:8080/rods').then(response => response.json()).then(res => {
      setGenusesList(res);
    });
    fetch('http://127.0.0.1:8080/properties').then(response => response.json()).then(res => {
      setPropertiesList(res);
    });

    if (!strainId) {
      setIsReadOnly(false);
    } else {
      loadModel()
    }
  }, []);

  useEffect(() => {
    if(model.rodId !== -1) {
      fetch(`http://127.0.0.1:8080/vids/rods/${model.rodId}`).then(response => response.json()).then(res => {
        setTypesList(res);
      });
    }
  }, [model.rodId]);


  // TODO: Сделать нормально
  const costilStyle = {
    marginBottom: '14px'
  };
  
  const handleCommonFieldChange = (event) => {
    setModel({...model, [event.target.name]: event.target.value});
  };

  const handleAddProperty = () => {
    const newModel = JSON.parse(JSON.stringify(model));

    fetch(`http://127.0.0.1:8080/properties/${newPropId}`).then(response => response.json()).then(propertyData => {
      propertyData.subProps = [];
      propertyData.functions = [];
      newModel.factParams = [propertyData, ...newModel.factParams];
      setModel(newModel);
    });
    setAddPropModalOpened(false);
  }

  const handleRemoveProperty = (propIndex) => {
    const newModel = JSON.parse(JSON.stringify(model));
    newModel.factParams.splice(propIndex, 1);
    setModel(newModel);
  }

  const handleDeleteStrain = () => {
    makeRequest(`/strain/delete/${model.id}`, {})
    navigate('/');
  }

  const handleDownloadDocument = () => {
    fetch('http://127.0.0.1:8080/strains')
      .then(response => response.json())
      .then(strainsList => {
        let strain = strainsList.find(elem => elem.id === model.id);
        downloadStrainDocument(strain.name, model.id)
      })
  }

  const handleSave = () => {
    setIsReadOnly(true);
    makeRequest('/strain/send', {
      method: 'POST', body: JSON.stringify(model)
    }).then(val => {
      if (val && (val !== true)) {
        const newModel = JSON.parse(JSON.stringify(model));
        newModel.id = val;
        setModel(newModel);
      }
    })
  }

  const makeModification = () => {
    const newModel = JSON.parse(JSON.stringify(model));
    newModel.id = null;
    setIsReadOnly(false);
    setModel(newModel);
  }


  const handleUpdateProperty = (propIndex, newVal) => {
    const newModel = JSON.parse(JSON.stringify(model));
    newModel.factParams[propIndex] = newVal;
    setModel(newModel);
  }

  // TODO: Оптимизация вида readOnly
  return(
    <>
      <div>
        <div style={{display: 'flex', flexDirection:'row'}}>
            <Stack orientation='vertical' width='70%'>
              <PageHeader header='Паспорт штамма'/>
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

              {basicFields.map((field, key) =>
                <SimpleProperty
                  key={`basic-field-${key}`}
                  id={field.id}
                  label={field.label}
                  name={field.name}
                  readOnly={isReadOnly}
                  value={model[field.name]}
                  updateCallback={handleCommonFieldChange}
                />
              )}
              <FormControlLabel
                control={
                  <Checkbox name='isLost'/>
                }
                disabled={isReadOnly}
                sx={costilStyle}
                onChange={ (event) => {
                  setModel({...model, isLost: event.target.checked})
                }}
                checked={model?.isLost}
                label="Штамм утерян"
              />
              <Divider/>

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
              {model?.factParams?.map((propData, key) =>
                <PropertyInput
                    prop={propData}
                    propertyIndex={key}
                    readOnly={isReadOnly}
                    updatePropCallback={(newData) => handleUpdateProperty(key, newData)}
                    removePropCallback={handleRemoveProperty}
                    key={`basic-prop-${key}`}
                />
              )}
            </Stack>

          <Divider orientation="vertical" flexItem/>
          <Grid item sx={{textAlign: 'left', marginLeft: '15px'}}>
            <Stack>
              {model.id && isReadOnly &&
                <Button
                  variant='contained'
                  onClick={handleDownloadDocument}
                >
                  <DownloadIcon/> Скачать паспорт
                </Button>
              }
              {model.id &&
                <Button
                  variant='contained'
                  onClick={makeModification}
                  sx={{marginTop: '20px'}}
                >
                  Создать модификацию
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
              {!isReadOnly && model.id &&
              <Button
                variant='contained'
                color='warning'
                sx={{marginTop: '20px'}}
                onClick={() => {
                  setIsReadOnly(true);
                  loadModel();
                }}>
                Отменить изменения
              </Button>
              }
              {!isReadOnly &&
                <>
                  <Button
                    variant='contained'
                    color='success'
                    sx={{marginTop: '20px'}}
                    onClick={handleSave}>
                    Сохранить изменения
                  </Button>
                  <Button
                    sx={{marginTop: '20px'}}
                    onClick={() => {
                      fetch('http://127.0.0.1:8080/properties').then(response => response.json()).then(res => {
                        setPropertiesList(res);
                      });
                      fetch('http://127.0.0.1:8080/rods').then(response => response.json()).then(res => {
                        setGenusesList(res);
                      });
                    }}
                  >
                    Обновить справочники
                  </Button>
                </>
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
        </div>
      </div>

      <Modal
        open={addPropModalOpened}
        onClose={() => setAddPropModalOpened(false)}
        style={CENTERED_MODAL}
      >
          <Paper sx={{width: '600px', maxHeight: '450px', margin: 'auto', padding: '20px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              <Typography variant='h5'>
                Добавление свойства в паспорт
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
              onClick={handleAddProperty}
            >
              Добавить
            </Button>
          </Paper>
      </Modal>

      {/*Модальное окно удаления паспорта*/}
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