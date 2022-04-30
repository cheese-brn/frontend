import React, { useState, useEffect} from 'react';
import {Typography, Paper} from "@mui/material";
import {TreeView, TreeItem} from "@mui/lab"
import SearchRow from "../StrainSearch/components/SearchRow.jsx";

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import {PageHeader} from "../commons/components";

const Catalogue = () => {
  const [displayData, setDisplayData] = useState(null);

  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`/rods/rodsWithVids`)
      .then(response => response.json())
      .then(data => {
        setData(data)
      })
  }, []);

  const handleLoadStrains = (strainId) => {
    fetch(`/strains/vids/${strainId}`)
      .then(response => response.json())
      .then(strains => {
        setDisplayData(strains);
      })
  }
  
  return(
    <div>
      <PageHeader header='Каталог микроорганизмов'/>
        <div style={{display: 'flex', marginTop: '30px'}}>
          <Paper elevation={3} style={{width: '25%', marginRight: '20px'}}>
            <Typography variant='h5'>Рода и виды</Typography>
            <TreeView
              defaultCollapseIcon={<ExpandMoreIcon />}
              defaultExpandIcon={<ChevronRightIcon />}
              style={{marginTop: '5%', width: '95%'}}
            >
              {data?.map(genus => {
                  return (<TreeItem nodeId={`genus-${genus.id}`} label={genus.name}>
                    {genus.vids.map(type =>
                      <TreeItem
                        nodeId={`type-${type.id}`}
                        label={type.name}
                        onClick={() => handleLoadStrains(type.id)}
                      />)}
                  </TreeItem>)
                }
              )}
            </TreeView>
          </Paper>

          <div style={{width: '70%'}}>
            <Typography variant='h5' align='left'>Штаммы:</Typography>
            {displayData ?
              displayData.map(strain => <SearchRow strainId={strain.id} strainName={strain.name}/> )
              : <p style={{color: 'grey'}}>Нет данных или не выбран вид</p>}
          </div>
        </div>
    </div>
  );
};

export default Catalogue;