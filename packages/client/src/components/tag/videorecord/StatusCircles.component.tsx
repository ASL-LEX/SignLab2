import { Box } from '@mui/material';

export interface StatusProcessCirclesProps {
  /** List of statuses to display */
  isComplete: boolean[];
  /** Handle when a user clicks a circle */
  setState: (index: number) => void;
  /** The active index */
  activeIndex: number;
};

export const StatusProcessCircles: React.FC<StatusProcessCirclesProps> = (props) => {
  return (
    <Box sx={{ justifyContent: 'space-between', display: 'flex', maxWidth: '80%', margin: 'auto' }}>
      {props.isComplete.map((isComplete, index) => (
        <StatusProcessCircle
          key={index}
          isComplete={isComplete}
          onClick={() => props.setState(index)}
          activeIndex={props.activeIndex}
          index={index}
        />
      ))}
    </Box>
  );
};

interface StatusProcessCircleProps {
  /** Whether the circle is complete */
  isComplete: boolean;
  /** Handle when a user clicks a circle */
  onClick: () => void;
  /** The active index */
  activeIndex: number;
  /** The index of the circle */
  index: number;
}

const StatusProcessCircle: React.FC<StatusProcessCircleProps> = (props) => {
  return (
    <Box
      sx={{
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        backgroundColor: props.isComplete ? 'success.main' : '',
        cursor: 'pointer',
        border: '4px solid',
        borderColor: props.activeIndex === props.index ? 'primary.main' : 'text.secondary'
      }}
      onClick={props.onClick}
    />
  );
}
