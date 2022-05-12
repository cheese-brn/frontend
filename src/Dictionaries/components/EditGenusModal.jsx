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

import {closeModal, openEditModal} from "../constants";
import CloseIcon from "@mui/icons-material/Close";
import {useRequest} from "../../commons/hooks";

const EditGenusModal = ({genusId, openTypeCallback, dispatch}) => {
  if (!genusId) {
    return <></>
  }

  const [model, setModel] = useState({name: ''});
  const [types, setTypes] = useState([]);
  const [openConfirmDeleteDialog, setOpenConfirmDeleteDialog] = useState(false);

  const makeRequest = useRequest();

  useEffect(() => {
    fetch(`http://127.0.0.1:8080/rods/${genusId}`)
      .then(response => response.json())
      .then(genusData => setModel(genusData));
    fetch(`http://127.0.0.1:8080/vids/rods/${genusId}`)
      .then(response => response.json())
      .then(typesList => setTypes(typesList));
  }, [genusId]);

  const handleCloseModal = () => {
    setModel(null);
    dispatch(closeModal());
  }

  return (
    <>
      <Modal
        open={Boolean(model)}
        onClose={handleCloseModal}
        style={CENTERED_MODAL}
      >
        { Boolean(model) &&
        <Paper sx={{width: '600px', maxHeight: '350px', margin: 'auto', padding: '20px', overflowY: 'scroll'}}>
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <Typography variant='h5'>
              {`Редактирование рода "${model.name || '...'}":`}
            </Typography>
            <IconButton onClick={handleCloseModal}>
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
                  dispatch(openEditModal(index));
                }}
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
            onClick={() => {
              makeRequest('/rod/send', {method: 'POST', body:JSON.stringify(model)});
            }}
          >
            Сохранить изменения
          </Button>
          <Button
            style={{marginTop: '10px', marginRight: '10px'}}
            variant='outlined'
            color='warning'
            onClick={handleCloseModal}
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
        || <></>}
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
              makeRequest(`/rod/delete/${genusId}`, {})
                .then(res => {
                  if (res) {
                    setOpenConfirmDeleteDialog(false)
                    handleCloseModal()
                  }
                })
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