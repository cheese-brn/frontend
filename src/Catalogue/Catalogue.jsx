import React, { useState, useEffect, useRef } from 'react';
import {Paper, Typography, Divider, Grid} from "@mui/material";
import {TreeView, TreeItem,} from "@mui/lab"
import { useNavigate } from "react-router-dom";
import APP_ACTIONS from "../constants";

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

// eslint-disable-next-line react/prop-types
const Catalogue = ({appDispatch}) => {
  const [displayData, setDisplayData] = useState(null);
  const genus = useRef(null);
  const navigate = useNavigate();

  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`/rods`)
      .then(response => response.json())
      .then(genuses => {

        // TODO: Убрать этот костыль
        let result = genuses.map(genus => ({
          ...genus,
          children: fetch(`/vids/rods/${genus.id}`).then(response => response.json)
        }))
        setData(result)
      })
    handleReturnToGenus();
  }, []);

  const handleItemSelect = (item) => {
    if (genus.current) {
      appDispatch(APP_ACTIONS.SET_QUERY_ACTION({genus: genus.current.id, type: item.id}));
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
      <Grid container spacing="2">
        <TreeView
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
        >
          {data?.map(genus => {
            debugger
              return (<TreeItem nodeId={`genus-${genus.id}`} label={genus.name}>
                {genus.children?.map(type => <TreeItem nodeId={`type-${type.id}`} label={type.name}/>)}
              </TreeItem>);
            }
          )}
        </TreeView>
      </Grid>
      {/*<Typography align='left' variant='h5' onClick={handleReturnToGenus} sx={{marginLeft: '10px'}}>*/}
      {/*  {`Род${genus.current ? `: ${genus.current.name}, Вид:` : ''}`}*/}
      {/*</Typography>*/}
      {/*<Divider/>*/}
      {/*<div style={{height: '80%' ,display: 'flex', flexDirection: 'column', overflowY: 'auto'}}>*/}
      {/*  /!*TODO: Сделать нормальный стиль компонента*!/*/}
      {/*  {displayData?.map((element, index) =>*/}
      {/*    <div*/}
      {/*      key={`catalogue-element-${index}`}*/}
      {/*      onClick={() => handleItemSelect(element)}*/}
      {/*      style={{height: '35px', textDecoration: 'underline', cursor: 'pointer'}}>*/}
      {/*      <Typography sx={{fontSize: '25px',}} align='left'>*/}
      {/*        {element.name}*/}
      {/*      </Typography>*/}
      {/*    </div>)}*/}
      {/*</div>*/}
    </Paper>
  );
};

export default Catalogue;