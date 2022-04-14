import CENTERED_MODAL from "../../constants";
import {
  Button, Dialog,
  DialogActions,
  DialogTitle,
  Divider,
  IconButton,
  Modal,
  Paper,
  TextField,
  Typography
} from "@mui/material";
import React, {useEffect, useState} from "react";

import {editItem, OPEN_PROPERTIES} from "../constants";
import CloseIcon from "@mui/icons-material/Close";
import {handleSubmitChange, handleDeleteElement} from "./commons";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddBoxIcon from '@mui/icons-material/AddBox';

const EditPropertyModal = ({propId, dispatch}) => {
  if (!propId) {
    return <></>
  }

  const [model, setModel] = useState({name: ''});
  const [subprops, setSubprops] = useState([]);
  const [funcs, setFuncs] = useState([]);
  const [openConfirmDeleteDialog, setOpenConfirmDeleteDialog] = useState(false);

  useEffect(() => {
    fetch(`/properties/${propId}`)
      .then(response => response.json())
      .then(prop => {
        setModel(prop)
        debugger
      });
    fetch(`/subproperties/properties/${propId}`)
      .then(response => response.json())
      .then(subprops => {
        setSubprops(subprops.properties);
        setFuncs(subprops.functions);
        debugger
      })
  }, [propId]);

  const makeSubpropsComponents = () =>
    subprops.map((subProp, index) => {
        return (
          <div style={{display: 'flex', alignItems: 'center'}}>
            <TextField
              label='Название подсвойства'
              value={subProp.name}
              size='small'
              onChange={event => {
                let dataCopy = JSON.parse(JSON.stringify(subprops))
                dataCopy[index].name = event.target.value;
                setSubprops(dataCopy);
              }}
              style={{marginTop: '15px', marginBottom: '5px'}}
              fullWidth
            />
            <IconButton
              className='dictionary-button-delete'
              onClick={() => {
                const copy = JSON.parse(JSON.stringify(subprops)).splice(index, 1);
                debugger
                setSubprops(copy);
              }}
            >
              <DeleteOutlineIcon/>
            </IconButton>
          </div>
        )
      }
    );

  const makeFunctionalComponents = () =>
    funcs.map((func, index) => {
      return <p>ф</p>
    })

  return (
    <>
      <Modal
        open={Boolean(propId)}
        onClose={() => {
          dispatch(editItem(null));
        }}
        style={CENTERED_MODAL}
      >
        <Paper sx={{width: '600px', maxHeight: '350px', margin: 'auto', padding: '20px', overflowY: 'scroll'}}>
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <Typography variant='h5'>
              {`Редактирование свойства "${model.name || '...'}":`}
            </Typography>
            <IconButton onClick={() => {
              setModel(null);
              dispatch(editItem(null));
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
            label='Название свойства'
            value={model.name}
            onChange={event => {
              setModel({...model, name: event.target.value})
            }}
          />
          <TextField
            sx={{
              marginTop: '10px',
              marginBottom: '10px',
              width: '100%',
            }}
            label='Название свойства'
            value={model.name}
            onChange={event => {
              setModel({...model, name: event.target.value})
            }}
          />
          <Divider/>

          <div style={{marginBottom: '10px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              <Typography>
                Подсвойства:
              </Typography>
              <IconButton onClick={() => {
                setSubprops([...subprops, {name: '', id: 0}])
              }}>
                <AddBoxIcon/>
              </IconButton>
            </div>
            {makeSubpropsComponents()}
          </div>
          <Divider/>

          <div style={{marginBottom: '10px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              <Typography>
                Функциональные подсвойства:
              </Typography>
              <IconButton onClick={() => {
                setFuncs([...funcs, {name: '', firstParam: {name: '', unit: ''}, secondParam: {name: '', unit: ''}}])
              }}>
                <AddBoxIcon/>
              </IconButton>
            </div>

            {makeFunctionalComponents()}
          </div>
          <Divider/>

          <Button
            style={{marginTop: '10px', marginRight: '10px'}}
            variant='outlined'
            color='success'
            onClick={() => {
              handleSubmitChange(OPEN_PROPERTIES, {...model, properties: subprops, functions: funcs})
                .then(response => {
                  debugger
                })
            }

            }
          >
            Сохранить изменения
          </Button>
          <Button
            style={{marginTop: '10px', marginRight: '10px'}}
            variant='outlined'
            color='warning'
            onClick={() => {
              dispatch(editItem(null));
            }}
          >
            Отменить изменения
          </Button>
          <Button
            style={{marginTop: '10px', marginRight: '10px'}}
            variant='outlined'
            color='error'
            onClick={() => {
              setOpenConfirmDeleteDialog(true)
            }}
          >
            Удалить элемент
          </Button>
        </Paper>
      </Modal>

      <Dialog
        open={openConfirmDeleteDialog}
        onClose={() => setOpenConfirmDeleteDialog(false)}
      >
        <DialogTitle>
          Вы уверены, что хотите удалить это свойство?
        </DialogTitle>
        <DialogActions>
          <Button
            onClick={() => setOpenConfirmDeleteDialog(false)}
          >
            Отменить
          </Button>
          <Button
            onClick={() => {
              handleDeleteElement(OPEN_PROPERTIES, propId);
              // TODO: получить ответ обработки, только затем закрыть
              dispatch(editItem(null));
            }}
          >
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default EditPropertyModal;