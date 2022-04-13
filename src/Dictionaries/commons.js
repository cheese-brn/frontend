import {OPEN_GENUSES, OPEN_PROPERTIES, OPEN_TYPES} from "./constants";

export const getDictionaryByTarget = (type) => {
  switch (type) {
    case OPEN_GENUSES:
      return 'Род';
    case OPEN_PROPERTIES:
      return 'Свойство';
    case OPEN_TYPES:
      return 'Вид';
    default:
      return '';
  }
};