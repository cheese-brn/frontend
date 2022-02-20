import React, { useState, useEffect, useRef } from 'react';
import { Paper, Typography, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import APP_ACTIONS from "../constants";

// eslint-disable-next-line react/prop-types
const Catalogue = ({appDispatch}) => {
  const [displayData, setDisplayData] = useState(null);
  const genus = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    handleReturnToGenus();
  }, []);

  const handleItemSelect = (item) => {
    if (genus.current) {
      appDispatch(APP_ACTIONS.SET_QUERY_ACTION({rod: genus.current.id, vid: item.id}));
      navigate('/search');
    } else {
      genus.current = item;
      fetch(`/vids/rods/${item.id}`)
        .then(response => response.json())
        .then(json => {

          setDisplayData(json);
        });
    }

  };

  const handleReturnToGenus = () => {
    if (genus.current) {
      genus.current = null;
    }
    fetch('/rods')
      .then(response => response.json())
      .then(json => {
        setDisplayData(json);
      });

  };
  
  return(
    <Paper sx={{margin: '0 10px 0 10px', padding: '20px', height: '85%'}}>
      <Typography
        variant='h4'
        align='left'
      >
          Каталог микроорганизмов
      </Typography>
      <Typography align='left' variant='h5' onClick={handleReturnToGenus} sx={{marginLeft: '10px'}}>
        {`Род${genus.current ? `: ${genus.current.name}, Вид:` : ''}`}
      </Typography>
      <Divider/>
      <div style={{height: '80%' ,display: 'flex', flexDirection: 'column', overflowY: 'auto'}}>
        {/*TODO: Сделать нормальный стиль компонента*/}
        {displayData?.map((element, index) =>
          <div
            key={`catalogue-element-${index}`}
            onClick={() => handleItemSelect(element)}
            style={{width: '100px', height: '35px', textDecoration: 'underline', cursor: 'pointer'}}>
            <Typography sx={{fontSize: '25px',}} align='left'>
              {element.name}
            </Typography>
          </div>)}
      </div>
    </Paper>
  );
};

export default Catalogue;