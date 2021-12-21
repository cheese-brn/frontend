export const OPEN_GENUSES = 'rods';
export const OPEN_TYPES = 'vids';
export const OPEN_PROPERTIES = 'properties';
export const CLOSE_ITEM = 'close-item';
export const CHANGE_PAGE = 'change-page';
export const DELETE_ITEM = 'delete-item';
export const EDIT_ITEM = 'edit-item';

export const SET_DATA = 'set-data';

export const changePage = (targetPage) => {
  return { type: CHANGE_PAGE, payload: targetPage };
};

export const setData = (data) => {
  return {type: SET_DATA, payload: data};
};

export const deleteItem = (id) => {
  return {type: DELETE_ITEM, payload: id};
};

export const editItem = (id) => {
  return {type: EDIT_ITEM, payload: id};
};

export const closeItem = () => {
  return {type: CLOSE_ITEM};
};