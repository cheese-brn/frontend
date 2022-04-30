import React, {useState, useEffect, useMemo} from "react";
import {Typography, Stack, Divider} from "@mui/material";
import {entityTypes} from "./constants";
import EntityElement from "./components/EntityElement.jsx";
import DeletedElement from "./components/DeletedElement.jsx";
import {PageHeader} from "../commons/components";

const RestoreDeletedElements = () => {
  const [deletedElems, setDeletedElems] = useState(null);
  const [selectedEntity, setSelectedEntity] = useState(null);
  // TODO: сделать нормально
  const [costilUpdater, setCostilUpdater] = useState(0);

  // TODO: Выделение цветом текущего элемента
  const entityElems = useMemo(() =>
    entityTypes.map((type, index) =>
      <EntityElement
        label={type.name}
        onClick={() => setSelectedEntity(type)}
        key={`entity-${index}`}
      />
      )
  , []);

  const restoreItem = (id) => {
    selectedEntity.restoreFunc(id);
    setCostilUpdater(costilUpdater + 1);
  }

  const updateItems = () => {
    if (selectedEntity) {
      selectedEntity.getElems().then(response => response.json()).then(elems => setDeletedElems(elems))
    }
  }

  useEffect(() => {
    updateItems();
  }, [selectedEntity, costilUpdater]);

  return(
    <div>
      <PageHeader header='Восстановление удалённых элементов'/>
      <Typography variant='h5' align='left'>
        Восстановление удалённых элементов
      </Typography>
      <div style={{display: 'flex', flexDirection: 'row'}}>
        <Stack style={{marginRight: '10px'}}>
          {entityElems}
        </Stack>
        <Divider orientation='vertical' style={{marginRight: '10px'}} flexItem/>
        {!deletedElems &&
          <Typography style={{fontSize: '20px', color: 'grey'}}>{'Выберите тип элемента'}</Typography>
        }
        {deletedElems && deletedElems.length === 0 &&
          <Typography style={{fontSize: '20px'}}>{'Нет элементов данного типа'}</Typography>
        }
        <Stack style={{width: '500px'}}>
            {deletedElems?.map((elem, index) =>
              <DeletedElement
                label={elem.name}
                onRestore={() => restoreItem(elem.id)}
                key={`deleted-element-${index}`}
              />
            )}
        </Stack>
      </div>
    </div>
  )
};

export default RestoreDeletedElements;