import { Box, Stack } from '@mui/material';

export interface StatusProcessCirclesProps {
  /** List of statuses to display */
  isComplete: boolean[];
  /** Handle when a user clicks a circle */
  setState: (index: number) => void;
  /** The active index */
  activeIndex: number;
}

export const StatusProcessCircles: React.FC<StatusProcessCirclesProps> = (props) => {
  console.log(props.isComplete);
  return (
    <Stack direction="row" spacing={2}>
      {props.isComplete.map((isComplete, index) => (
        <StatusProcessCircle
          key={index}
          isComplete={isComplete}
          onClick={() => props.setState(index)}
          activeIndex={props.activeIndex}
          index={index}
        />
      ))}
    </Stack>
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
  const circleSize = '50px';

  return (
    <Box
      sx={{
        width: circleSize,
        height: circleSize,
        borderRadius: '50%',
        backgroundColor: props.isComplete ? 'success.main' : '',
        cursor: 'pointer',
        border: '4px solid',
        borderColor: props.activeIndex === props.index ? 'primary.main' : 'text.secondary'
      }}
      onClick={props.onClick}
    />
  );
};
