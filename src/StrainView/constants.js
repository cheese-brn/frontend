export const actions = {
  ADD_PROPERTY: 'add-property',
  REMOVE_PROPERTY: 'remove-property',
  ADD_SUBPROPERTY: 'add-subproperty',
  REMOVE_SUBPROPERTY: 'remove-subproperty',
}

export const addProperty = (propertyIndex) => { return { type: actions.ADD_PROPERTY, payload: propertyIndex}};
export const removeProperty = (propertyIndex) => { return { type: actions.REMOVE_PROPERTY, payload: propertyIndex}};
