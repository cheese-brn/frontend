import {useSnackbar} from "notistack";

export const useRequest = () => {
  const { enqueueSnackbar } = useSnackbar();

  return (endpoint, init) =>
    fetch(endpoint, init)
      .then(response => {
        return response.json()
          .then(res => {
            if (response.status !== 200) {
              enqueueSnackbar(`${res.message}`, {variant: 'error'})
              return res.data;
            }
            enqueueSnackbar(`${res.message}`, {variant: 'success'});
            if (!res.data) {
              res.data = true;
            }
            return res.data;
          })
      });
}