/* eslint-disable react/prop-types */
import React, {useState, useEffect} from 'react';
import {Paper, Typography} from "@mui/material";
import { useNavigate } from "react-router-dom";

const StrainsList = ({query}) => {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`/strains/vids/${query.vid}`)
      .then(response => response.json())
      .then(result => {
        setData(result);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleItemSelect = (strainId) => {
    navigate(`/strain/${strainId}`);
  };

  return(
    <Paper sx={{margin: '0 10px 0 10px', padding: '10px'}}>
      <Typography>Страница-заглушка, тут должна быть соответствующая логике гибкого поиска выдача</Typography>
      <Typography align='left'>Паспорта штаммов</Typography>
      <div style={{display: 'flex', flexDirection: 'column'}}>
        {data?.map((element, index) =>
          <div
            key={`strains-list-element-${index}`}
            onClick={() => handleItemSelect(element.id)}
            style={{height: '30px', textDecoration: 'underline', cursor: 'pointer'}}>
            <Typography sx={{fontSize: '25px',}} align='left'>
              {element.name}
            </Typography>
          </div>)}
      </div>
    </Paper>
  );
};

export default StrainsList;