import React, {useState, useEffect, useMemo} from "react";
import {Paper, Typography, Grid, Stack, Divider} from "@mui/material";
import {entityTypes} from "./constants";
import EntityElement from "./components/EntityElement";
import DeletedElement from "./components/DeletedElement";

const RestoreDeletedElements = () => {
  const [deletedElems, setDeletedElems] = useState(null);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [costilUpdater, setCostilUpdater] = useState(0);

  // TODO: Выделение цветом текущего элемента
  const entityElems = useMemo(() =>
    entityTypes.map((type, index) => <EntityElement label={type.name} onClick={() => setSelectedEntity(type)} key={`entity-${index}`}/> )
  , []);

  useEffect(() => {
    if (selectedEntity) {
      selectedEntity.getElems().then(response => response.json()).then(elems => {
        setDeletedElems(elems.map((elem, index) =>
          <DeletedElement
            label={elem.name}
            onRestore={() => {
              selectedEntity.restoreFunc(elem.id);
              setCostilUpdater(costilUpdater + 1);
            }}
            key={`deleted-element-${index}`}
          />
        ));
      })
    }
  }, [selectedEntity, costilUpdater]);

  return(
    <Paper sx={{margin: '0 10px 0 10px', padding: '10px'}}>
      <Typography variant='h5' align='left'>
        Восстановление удалённых элементов
      </Typography>
      <Grid container spacing={2}>
        <Grid item>
          <Stack>
            {entityElems}
          </Stack>
        </Grid>
        <Divider orientation='vertical'/>
        <Grid item>
          {!deletedElems &&
            <Typography style={{fontSize: '20px', color: 'grey'}}>{'Выберите тип элемента'}</Typography>
          }
          {deletedElems &&
            deletedElems.length === 0 &&
            <Typography style={{fontSize: '20px'}}>{'Нет элементов данного типа'}</Typography>
          }
          {deletedElems && deletedElems.length > 0}
        </Grid>
      </Grid>
    </Paper>
  )
};

export default RestoreDeletedElements;