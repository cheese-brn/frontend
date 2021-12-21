import React, {useState, useEffect} from 'react';
import {TextField, Typography} from "@mui/material";
import PropTypes from "prop-types";

const PropertyEditModal = ({propertyId}) => {
  const [model, setModel] = useState({ name: '', description: '', subProps: []});

  useEffect(() => {
    fetch(`/properties/${propertyId}`)
      .then(response => response.json())
      .then(property => {
        setModel(property);
      });

    fetch(`'/subproperties/properties'/${propertyId}`)
      .then(response => response.json())
      .then(array => {
        setModel({...model, subProps: array});
      });
  }, []);


  return (<>
    <TextField
      id="edit-property__property-name-field"
      label="Наименование"

    />
    <TextField
      id="edit-property__property-description-field"
      lamel="Описание"
      multiline
    />
    <Typography>
      Подсвойства:
    </Typography>
    {model.subprops.map((subProp, index) =>
      <p key={`type-${index}`}>{`${subProp.name}`}</p>
    )}
  </>);
};

PropertyEditModal.propTypes = {
  propertyId: PropTypes.number,
};

export default PropertyEditModal;