import CENTERED_MODAL from "../../constants";
import {
  Button, Dialog,
  DialogActions,
  DialogTitle,
  Divider, FormControl,
  IconButton, InputLabel, MenuItem,
  Modal,
  Paper, Select,
  TextField,
  Typography
} from "@mui/material";
import React, {useEffect, useState} from "react";

import {editItem, OPEN_TYPES} from "../constants";
import CloseIcon from "@mui/icons-material/Close";
import {handleSubmitChange, handleDeleteElement} from "./commons";
import {Link} from "react-router-dom";

const EditTypeModal = ({typeId, dispatch}) => {
  if (!typeId) {
    return <></>
  }

  const [model, setModel] = useState({name: ''});
  const [genuses, setGenuses] = useState([]);
  const [strains, setStrains] = useState([]);
  const [openConfirmDeleteDialog, setOpenConfirmDeleteDialog] = useState(false);

  useEffect(() => {
    fetch(`/vids/${typeId}`)
      .then(response => response.json())
      .then(typeData => setModel(typeData));
    fetch(`/strains/vids/${typeId}`)
      .then(response => response.json())
      .then(strainsList => setStrains(strainsList));
    fetch('/rods')
      .then(response => response.json())
      .then(rods => setGenuses(rods));
  }, [typeId]);

  return (
    <>
      <Modal
        open={Boolean(typeId)}
        onClose={() => {
          dispatch(editItem(null));
        }}
        style={CENTERED_MODAL}
      >
        <Paper sx={{width: '600px', maxHeight: '350px', margin: 'auto', padding: '20px', overflowY: 'scroll'}}>
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <Typography variant='h5'>
              {`Редактирование вида "${model.name || '...'}":`}
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
            label='Название вида'
            value={model.name}
            onChange={event => {
              setModel({...model, name: event.target.value})
            }}
          />
          <FormControl
            sx={{
              marginTop: '10px',
              marginBottom: '10px',
              width: '100%',
            }}>
            <InputLabel id='dictionaries__edit-type__genus-select-label'>Относится к роду</InputLabel>
            <Select
              labelId='dictionaries__edit-type__genus-select-label'
              id='dictionaries__edit-type__genus-select'
              value={model.rodId || 0}
              name='rodId'
              onChange={(event => {setModel({...model, rodId: event.target.value})})}
            >
              {genuses.map(genus =>
                <MenuItem value={genus.id} key={genus.id}>{genus.name}</MenuItem>
              )}
            </Select>
          </FormControl>
          <Divider/>

          <div style={{marginBottom: '10px'}}>
            <Typography>
              Связанные штаммы:
            </Typography>
            {strains.map((strain, index) =>
              <Link
                to={`/strain/${strain.id}`}
                key={`strain-${index}`}
                style={{display: 'block', marginTop: '10px', textDecoration: 'underline', color: 'black'}}
                target="_blank"
              >
                {`${strain.name}`}
              </Link>
            )}
          </div>
          <Divider/>

          <Button
            style={{marginTop: '10px', marginRight: '10px'}}
            variant='outlined'
            color='success'
            onClick={() => handleSubmitChange(OPEN_TYPES, {...model, vidId: model.id})}
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
              handleDeleteElement(OPEN_TYPES, typeId);
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

export default EditTypeModal;