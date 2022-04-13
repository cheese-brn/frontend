import CENTERED_MODAL from "../../constants";
import {Divider, IconButton, Modal, Paper, TextField, Typography} from "@mui/material";
import React, {useEffect, useState} from "react";

import {editItem} from "../constants";
import CloseIcon from "@mui/icons-material/Close";

const EditGenusModal = ({genusId, openTypeCallback, dispatch}) => {
  if (!genusId) {
    return <></>
  }

  const [model, setModel] = useState({name: ''});
  const [types, setTypes] = useState([]);

  useEffect(() => {
    fetch(`/rods/${genusId}`)
      .then(response => response.json())
      .then(genusData => setModel(genusData));
    fetch(`/vids/rods/${genusId}`)
      .then(response => response.json())
      .then(typesList => setTypes(typesList));
  }, [genusId]);

  return (
    <Modal
    open={genusId}
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
      </Paper>
  </Modal>)
}

export default EditGenusModal;