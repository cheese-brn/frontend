import React, {useEffect, useState, useRef} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {Paper, Typography, Grid, TextField, Divider, Stack, Button, Select, MenuItem, FormControl, InputLabel} from "@mui/material";
import SimplePropertyInput from "./components/SimplePropertyInput";

const StrainView = () => {
  const navigate = useNavigate();
  const {strainId} = useParams();
  const [model, setModel] = useState({
    "id":0,
    "rod":-1,
    "vid":-1,
    "annotation":"",
    "exemplar":"",
    "modification":"",
    "obtainingMethod":"",
    "origin":"",
    "factParams":[],
  });

  const modelCopy = useRef(null);
  const [isReadOnly, setIsReadOnly] = useState(true);

  const [basicProps, setBasicProps] = useState([]);
  const [genusesList, setGenusesList] = useState(null);
  const [typesList, setTypesList] = useState(null);
  useEffect(() => {
    if(model.rod !== -1) {
      fetch(`/vids/rods/${model.rod}`).then(response => response.json()).then(res => {
        setTypesList(res);
      });
    }
  }, [model.rod]);

  useEffect(() => {
    fetch('/rods').then(response => response.json()).then(res => {
      setGenusesList(res);
    });

    if (!strainId) {
      setIsReadOnly(false);
    } else {
      fetch(`/strains/${strainId}`).then(response => response.json()).then(res => setModel(res));
    }
  }, []);

  useEffect(() => {
    const props = model?.factParams?.map((prop, key) => {
      return(<SimplePropertyInput
        prop={prop}
        propertyIndex={key}
        readOnly={isReadOnly}
        key={`basic-prop-${key}`}
        valueChangeCallback={handleSubPropChange}
      />);
    });
    setBasicProps(props);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model?.factParams, isReadOnly]);

  // TODO: Сделать нормально
  const costilStyle = {
    marginBottom: '14px'
  };

  const handleCommonFieldChange = (event) => {
    setModel({...model, [event.target.name]: event.target.value});
  };

  // TODO: Возможно, есть способ сделать это лучше
  const handleSubPropChange = (propKey, subPropKey, newValue) => {
    const newModel = JSON.parse(JSON.stringify(model));
    newModel.factParams[propKey].subProps[subPropKey].value = newValue;
    setModel(newModel);
  };

  // TODO: Разобраться с цветовой палитрой
  // TODO: Разобраться с внешним видом полей, чтобы точно было всё как надо
  return(
    <Paper sx={{margin: '0 10px 0 10px', padding: '10px'}}>
      <Grid container spacing='5'>
        <Grid container sm='6' md='7' lg='8' sx={{paddingRight: '15px', paddingLeft:'20px', }}>
          <Stack orientation='vertical' width={'100%'}>
            <Typography variant='h4'>
								Паспорт штамма
            </Typography>
            <FormControl>
              <InputLabel id='stain-view__genus-select-label'>Род</InputLabel>
              <Select
                sx={costilStyle}
                labelId='stain-view__genus-select-label'
                id='stain-view__genus-select'
                value={model.rod}
                name='rod'
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
                sx={costilStyle}
                labelId='stain-view__type-select-label'
                id='stain-view__type-select'
                value={model.vid}
                name='vid'
                onChange={handleCommonFieldChange}
                inputProps={{readOnly: isReadOnly || model.rod === -1}}
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
								>
									Добавить свойство
								</Button>
              }
            </div>
            {basicProps}
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
            {!isReadOnly && <>
              <Button
                variant='contained'
                color='success'
                sx={{marginTop: '20px'}}
                onClick={() => {
                  setIsReadOnly(true);
                  // TODO: отправка модели на бэк

                }}>
									Сохранить изменения
              </Button>
              <Button
                variant='contained'
                color='warning'
                sx={{marginTop: '20px'}}
                onClick={() => {
                  setIsReadOnly(true);
                  setModel({...modelCopy.current});
                }}>
									Отменить изменения
              </Button>
            </>}
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
          </Stack>

        </Grid>
      </Grid>
    </Paper>
  );
};

export default StrainView;