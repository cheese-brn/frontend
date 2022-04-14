import {useSnackbar} from "notistack";

export const useRequest = () => {
  const { enqueueSnackbar } = useSnackbar();

  return (endpoint, init) =>
    fetch(endpoint, init)
      .then(response => {
        return response.text()
          .then(text => {
            if (response.status !== 200) {
              enqueueSnackbar(`${text}`, {variant: 'error'})
              return false;
            }
            enqueueSnackbar(`${text}`, {variant: 'success'});
            return true;
          })
      });
}