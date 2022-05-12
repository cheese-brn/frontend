export const utilsList = [
  {
    name: 'restoreDeletedElements',
    label: 'Восстановление удалённых элементов',
    link:'utils/restoreDeletedElements',
  },
]

export const entityTypes = [
  {
    name: 'Штаммы',
    getElems: () => fetch('http://127.0.0.1:8080/deleted_strains'),
    restoreFunc: (id) => fetch(`http://127.0.0.1:8080/strain/restore/${id}`)
  },
  {
    name: 'Рода',
    getElems: () => fetch('http://127.0.0.1:8080/deleted_rods'),
    restoreFunc: (id) => fetch(`http://127.0.0.1:8080/rod/restore/${id}`)
  },
  {
    name: 'Виды',
    getElems: () => fetch('http://127.0.0.1:8080/deleted_vids'),
    restoreFunc: (id) => fetch(`http://127.0.0.1:8080/vid/restore/${id}`)
  },
  {
    name: 'Свойства',
    getElems: () => fetch('http://127.0.0.1:8080/deleted_properties'),
    restoreFunc: (id) => fetch(`http://127.0.0.1:8080/property/restore/${id}`)
  },
]