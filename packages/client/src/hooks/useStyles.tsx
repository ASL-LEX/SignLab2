import { makeStyles } from '@mui/material';

const useStyles = makeStyles((theme: any) => ({
  root: {
    margin: theme.spacing(3),
    width: 345
  },
  media: {
    height: 140
  },
  title: {
    color: theme.palette.primary.main
  }
}));

export { useStyles };
