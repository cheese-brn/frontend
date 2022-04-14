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

import {editItem, OPEN_GENUSES} from "../constants";
import CloseIcon from "@mui/icons-material/Close";
import {handleSubmitChange, handleDeleteElement} from "./commons";

const EditGenusModal = ({genusId, openTypeCallback, dispatch}) => {
  if (!genusId) {
    return <></>
  }

  const [model, setModel] = useState({name: ''});
  const [types, setTypes] = useState([]);
  const [openConfirmDeleteDialog, setOpenConfirmDeleteDialog] = useState(false);

  useEffect(() => {
    fetch(`/rods/${genusId}`)
      .then(response => response.json())
      .then(genusData => setModel(genusData));
    fetch(`/vids/rods/${genusId}`)
      .then(response => response.json())
      .then(typesList => setTypes(typesList));
  }, [genusId]);

  return (
    <>
      <Modal
        open={Boolean(genusId)}
        onClose={() => {
          dispatch(editItem(null));
        }}
        style={CENTERED_MODAL}
      >
        <Paper sx={{width: '600px', maxHeight: '350px', margin: 'auto', padding: '20px', overflowY: 'scroll'}}>
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <Typography variant='h5'>
              {`Редактирование рода "${model.name || '...'}":`}
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
            label='Название рода'
            value={model.name}
            onChange={event => {
              setModel({...model, name: event.target.value})
            }}
          />
          <Divider/>
          <div style={{marginBottom: '10px'}}>
            <Typography>
              Связанные виды:
            </Typography>
            {types.map((type, index) =>
              <p
                key={`type-${index}`}
                style={{textDecoration: 'underline', cursor: 'pointer'}}
                onClick={() => {
                  openTypeCallback(type.id);
                  dispatch(editItem(index));
                }
                }
              >
                {`${type.name}`}
              </p>
            )}
          </div>
          <Divider/>
          <Button
            style={{marginTop: '10px', marginRight: '10px'}}
            variant='outlined'
            color='success'
            onClick={() => handleSubmitChange(OPEN_GENUSES, model)}
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
          Вы уверены, что хотите удалить этот род?
        </DialogTitle>
        <DialogActions>
          <Button
            onClick={() => setOpenConfirmDeleteDialog(false)}
          >
            Отменить
          </Button>
          <Button
            onClick={() => {
              handleDeleteElement(OPEN_GENUSES, genusId);
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

export default EditGenusModal;