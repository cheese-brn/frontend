import React, { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Paper,
  Typography,
  Grid,
  TextField,
  Divider,
  Stack,
  Button,
} from '@mui/material'
import SimplePropertyInput from './components/SimplePropertyInput'

const StainView = () => {
  const navigate = useNavigate()
  const { strainID } = useParams()
  const [model, setModel] = useState({
    id: 0,
    rod: '',
    vid: '',
    annotation: '',
    exemplar: '',
    modification: '',
    obtainingMethod: '',
    origin: '',
    factParams: [],
  })
  const modelCopy = useRef(null)
  const [isReadOnly, setIsReadOnly] = useState(true)
  const [basicProps, setBasicProps] = useState([])

  useEffect(() => {
    // TODO: получать id штамма извне
    fetch('/strain/6')
      .then((response) => response.json())
      .then((res) => {
        console.log(res)
        setModel(res)
      })
    modelCopy.current = model
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [strainID])

  useEffect(() => {
    let props = model?.factParams?.map((prop, key) => {
      return (
        <SimplePropertyInput
          prop={prop}
          propertyIndex={key}
          readOnly={isReadOnly}
          key={`basic-prop-${key}`}
          valueChangeCallback={handleSubPropChange}
        />
      )
    })
    setBasicProps(props)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model?.factParams, isReadOnly])

  // TODO: Сделать нормально
  const costilStyle = {
    marginBottom: '14px',
  }

  const handleCommonFieldChange = (event) => {
    setModel({ ...model, [event.target.name]: event.target.value })
  }
  const handleSubPropChange = (propKey, subPropKey, newValue) => {
    let newModel = JSON.parse(JSON.stringify(model))
    newModel.factParams[propKey].subProps[subPropKey].value = newValue
    setModel(newModel)
  }

  // TODO: Разобраться с цветовой палитрой
  return (
    <Paper sx={{ margin: '0 10px 0 10px', padding: '10px' }}>
      <Grid container spacing="5">
        <Grid
          container
          sm="6"
          md="7"
          lg="8"
          sx={{ paddingRight: '15px', paddingLeft: '20px' }}
        >
          <Stack orientation="vertical" width={'100%'}>
            <Typography variant="h4">Паспорт штамма</Typography>
            <TextField
              sx={costilStyle}
              id="stain-view__genus-field"
              label="Род"
              name="rod"
              inputProps={{ readOnly: isReadOnly }}
              value={model?.rod}
              onChange={handleCommonFieldChange}
            />
            <TextField
              sx={costilStyle}
              id="stain-view__type-field"
              label="Вид"
              name="vid"
              inputProps={{ readOnly: isReadOnly }}
              value={model?.vid}
              onChange={handleCommonFieldChange}
            />
            <TextField
              sx={costilStyle}
              id="stain-view__name-field"
              label="Наименование"
              name="exemplar"
              inputProps={{ readOnly: isReadOnly }}
              value={model?.exemplar}
              onChange={handleCommonFieldChange}
            />
            <TextField
              sx={costilStyle}
              id="stain-view__modification-field"
              label="Модификация"
              name="modification"
              inputProps={{ readOnly: isReadOnly }}
              value={model?.modification}
              onChange={handleCommonFieldChange}
            />
            <TextField
              sx={costilStyle}
              id="stain-view__obtaining-method-field"
              label="Способ получения"
              name="obtainingMethod"
              inputProps={{ readOnly: isReadOnly }}
              value={model?.obtainingMethod}
              onChange={handleCommonFieldChange}
              multiline
            />
            <TextField
              sx={costilStyle}
              id="stain-view__origin-field"
              label="Происхождение"
              name="origin"
              inputProps={{ readOnly: isReadOnly }}
              value={model?.origin}
              onChange={handleCommonFieldChange}
              multiline
            />
            <TextField
              sx={costilStyle}
              id="stain-view__annotation-field"
              label="Аннотация"
              name="annotation"
              inputProps={{ readOnly: isReadOnly }}
              value={model?.annotation}
              onChange={handleCommonFieldChange}
              multiline
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '10px',
              }}
            >
              <Typography variant="h5" align="left">
                Свойства штамма
              </Typography>
              {!isReadOnly && (
                <Button
                  variant="contained"
                  color="success"
                  sx={{ padding: '3px 8px 3px 8px' }}
                >
                  Добавить свойство
                </Button>
              )}
            </div>
            {basicProps}
          </Stack>
        </Grid>
        <Divider orientation="vertical" flexItem />
        <Grid item sx={{ textAlign: 'left', marginLeft: '15px' }}>
          <Stack>
            <Typography variant="h6">{`Последнее редактирование:`}</Typography>
            {/*TODO: доделать, связано с CB-8*/}
            {/*<Typography>*/}
            {/*	{`${model.author}, ${model.lastEdit}`}*/}
            {/*</Typography>*/}
            {isReadOnly && (
              <Button
                variant="contained"
                onClick={() => {
                  setIsReadOnly(false)
                }}
              >
                Редактировать
              </Button>
            )}
            {!isReadOnly && (
              <>
                <Button
                  variant="contained"
                  color="success"
                  sx={{ marginTop: '20px' }}
                  onClick={() => {
                    setIsReadOnly(true)
                    // TODO: отправка модели на бэк
                  }}
                >
                  Сохранить изменения
                </Button>
                <Button
                  variant="contained"
                  color="warning"
                  sx={{ marginTop: '20px' }}
                  onClick={() => {
                    setIsReadOnly(true)
                    setModel({ ...modelCopy.current })
                  }}
                >
                  Отменить изменения
                </Button>
              </>
            )}
            <Button
              variant="outlined"
              color="error"
              sx={{ marginTop: '20px' }}
              onClick={() => {
                // TODO: Модалка подтверждения удаления
                fetch(`/strain/delete/${model.id}`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                })
                navigate(-1)
              }}
            >
              Удалить штамм
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Paper>
  )
}

export default StainView
