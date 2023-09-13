import { Box, Accordion, Button, Link } from '@mui/material';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useContext } from 'react';
import { EnvironmentContext } from '../context/EnvironmentContext';
import { useProject } from '../context/ProjectContext';
import { ProjectModel } from '../graphql/graphql';

export const Environment: React.FC = () => {
  const { study } = useContext(EnvironmentContext);
  const { project, updateProject } = useProject();

  const handleClick = (newValue: string) => {
    const newProject: ProjectModel = { name: newValue };
    updateProject(newProject);
  };

  const items = [
    {
      name: `Project: ${project?.name}`,
      subitems: [{ title: 'Project name 1' }, { title: 'Project name 2' }]
    },
    {
      name: `Study: ${study}`,
      subitems: [{ title: 'Study name 1' }, { title: 'Study name 2' }]
    }
  ];

  return (
    <Box>
      {items?.map((item: any) => (
        <Accordion key={item.name} disableGutters elevation={0} sx={{ '&:before': { display: 'none' } }}>
          <AccordionSummary key={item.name} expandIcon={<ExpandMoreIcon />}>
            <Link underline={'none'}>{item.name}</Link>
          </AccordionSummary>
          <AccordionDetails key={item.name}>
            {item.subitems?.map((subitem: any) => (
              <p key={subitem.title}>
                <Button
                  sx={{
                    fontSize: '15px',
                    color: 'black'
                  }}
                  key={subitem.title}
                  onClick={() => handleClick(subitem)}
                >
                  {subitem.title}
                </Button>
              </p>
            ))}
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};
