import CENTERED_MODAL from "../../constants";
import {
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem, Modal,
  Paper,
  Select,
  TextField,
  Typography
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {closeModal, OPEN_GENUSES, OPEN_PROPERTIES, OPEN_TYPES} from "../constants";
import React, {useState, useEffect} from "react";
import {openNewElem} from "../constants";

import {getDictionaryByTarget} from "../commons";

import {useRequest} from "../../commons/hooks";


const NewElemModal = ({elemType, dispatch, open}) => {
  const [model, setModel] = useState({name: ''})
  const [genusList, setGenusList] = useState([]);

  const makeRequest = useRequest();

  useEffect(() => {
    if (elemType !== OPEN_TYPES) {
      return
    }

    fetch('http://127.0.0.1:8080/rods')
      .then(response => response.json())
      .then(genusList => setGenusList(genusList));
  }, [elemType])

  if (!elemType) {
    return <></>;
  }

  const handleCloseModal = () => {
    setModel({name: ''});
    dispatch(closeModal());
  }

  const handleNewElemSubmit = () => {
    let targetString;
    switch (elemType) {
      case OPEN_GENUSES:
        targetString = '/rod/send';
        break;
      case OPEN_TYPES:
        targetString = '/vid/send';
        break;
      case OPEN_PROPERTIES:
        targetString = '/property/send';
        break;
    }

    makeRequest(targetString, {
      method: 'POST',
      body: JSON.stringify(model),
    }).then((res) => {
      if (res){
        handleCloseModal()
      }
    })
  }

  return(
    <Modal
      open={open}
      onClose={handleCloseModal}
      style={CENTERED_MODAL}
    >
      { open &&
      <Paper sx={{width: '600px', maxHeight: '350px', margin: 'auto', padding: '20px', overflowY: 'scroll'}}>
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <Typography variant='h5'>
            {`Создать элемент: ${getDictionaryByTarget(elemType)}`}
          </Typography>

          <IconButton onClick={handleCloseModal}>
            <CloseIcon/>
          </IconButton>
        </div>

        <TextField
          label='Название элемента'
          id='new-elem-modal__elem-name-field'
          style={{marginTop: '10px', width: '100%', marginBottom: '10px'}}
          value={model.name}
          onChange={(event) => setModel({...model, name: event.target.value})}
        />

        {elemType === OPEN_TYPES &&
        <FormControl sx={{marginTop: '10px', marginBottom: '10px', width: '100%'}}>
          <InputLabel id='dictionaries__new-element-genus-field-label'>Относится к роду</InputLabel>
          <Select
            label='Осносится к роду:'
            id='dictionaries__new-element-genus-field'
            labelId='dictionaries__new-element-genus-field-label'
            value={model?.rodId}
            onChange={event => setModel({...model, rodId: event.target.value})}
          >
            {genusList?.map((genus, key) =>
              <MenuItem value={genus.id} key={key}>{genus.name}</MenuItem>
            )}
          </Select>
        </FormControl>
        }
        <Button
          variant='outlined'
          color='success'
          onClick={handleNewElemSubmit}
        >
          Создать
        </Button>
        <Button
          variant='outlined'
          color='warning'
          onClick={() => {
            dispatch(openNewElem(null));
          }}
        >
          Отменить
        </Button>
      </Paper>
      || <></>}
    </Modal>
  )
}

export default NewElemModal;