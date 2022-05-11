import {Button, Chip, Typography} from "@mui/material";
import TimelineIcon from "@mui/icons-material/Timeline";
import FunctionDataModal from "./FunctionDataModal.jsx";
import React, {useState} from "react";


const FunctionalSubproperty = ({data, updateData, funcIndex, propIndex, readOnly}) => {
  const [openGraphModal, setOpenGraphModal] = useState(false);

  const closeModal = () => {
    setOpenGraphModal(false)
  };

  return(
    <div
      key={`prop-${propIndex}-subprop-${funcIndex}`}
      style={{textAlign: 'left', display: 'flex', flexDirection: 'column'}}
    >
      {readOnly &&
      <div>
        <Typography variant={'p'} style={{marginRight: '1rem'}}><i>{data.name}</i></Typography>
        <Chip icon={<TimelineIcon />} label="Открыть график" variant="outlined" onClick={() => setOpenGraphModal(true)}/>
      </div>
      }
      {!readOnly &&
      <div style={{display: 'flex', alignContent: 'center'}}>
        <TimelineIcon />
        <Typography variant='p' style={{marginRight: '1em'}}>{data.name}</Typography>
        <Button variant='outlined' size='small' onClick={() => {
          setOpenGraphModal(true);
        }}
        >
          Редактировать данные
        </Button>
      </div>
      }
      {openGraphModal &&
      <FunctionDataModal
        data={data}
        open={openGraphModal}
        closeCallback={closeModal}
        saveDataCallback={updateData}
        edit={!readOnly}
      />}
    </div>
  )
}

export default FunctionalSubproperty;