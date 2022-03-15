import React, { useState, useEffect} from 'react';
import {Typography} from "@mui/material";
import {TreeView, TreeItem,} from "@mui/lab"
import SearchRow from "../StrainSearch/components/SearchRow";

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

// eslint-disable-next-line react/prop-types
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
      <Typography
        variant='h4'
        align='left'
      >
          Каталог микроорганизмов
      </Typography>
        <div style={{display: 'flex', marginTop: '30px'}}>
          <div>
            <p>Рода и виды</p>
            <TreeView
              defaultCollapseIcon={<ExpandMoreIcon />}
              defaultExpandIcon={<ChevronRightIcon />}
              style={{marginRight: '5%'}}
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
          </div>

          <div style={{width: '70%'}}>
            {displayData ?
              displayData.map(strain => <SearchRow strainId={strain.id} strainName={strain.name}/> )
              : <p>Нет данных или не выбран вид</p>}
          </div>
        </div>
    </div>
  );
};

export default Catalogue;