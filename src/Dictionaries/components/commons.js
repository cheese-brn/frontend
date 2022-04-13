import {OPEN_GENUSES, OPEN_PROPERTIES, OPEN_TYPES} from "../constants";

/**
 * Возвращает промис запроса обновления данных
 * @param dictionaryTarget
 * @param model
 * @returns {Promise<Response>}
 */
export const handleSubmitChange = (dictionaryTarget, model) => {
  let target;
  switch (dictionaryTarget) {
    case OPEN_GENUSES:
      target = 'rod';
      break;
    case OPEN_TYPES:
      target = 'vid';
      break;
    case OPEN_PROPERTIES:
      target = 'property';
      break;
  }
  debugger
  return fetch(`/${target}/send`, {
    method: 'POST',
    body: JSON.stringify(model)
  })
}

/**
 * Возвращает промис удаления элемента
 * @param dictionaryTarget
 * @param id
 * @returns {Promise<Response>}
 */
export const handleDeleteElement = (dictionaryTarget, id) => {
  let target = ''
  switch (dictionaryTarget) {
    case OPEN_GENUSES:
      target = 'rod'
      break;
    case OPEN_TYPES:
      target = 'vid'
      break;
    case OPEN_PROPERTIES:
      target = 'property'
      break;
  }
  return fetch(`/${target}/delete/${id}`)
}