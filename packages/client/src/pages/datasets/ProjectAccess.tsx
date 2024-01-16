import { Accordion, Box, Container, Typography } from '@mui/material';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { DatasetAccess } from '../../components/DatasetAccess.component';
import { useProject } from '../../context/Project.context';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

export const ProjectAccess: React.FC = () => {
  const { project } = useProject();

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', width: 200 },
  ];

  return (
    <>
      {project && (
        <>
          <Typography variant="h5">Project Access</Typography>
          <DataGrid
            columns={columns}
          />
        </>
      )}
    </>
  );
};
