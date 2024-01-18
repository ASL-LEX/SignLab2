import { Switch } from '@mui/material';
import { useEffect } from 'react';
import { useIsEntryEnabledLazyQuery, useSetEntryEnabledMutation } from '../graphql/tag/tag';
import { useStudy } from '../context/Study.context';
import { useConfirmation } from '../context/Confirmation.context';

export default function ToggleEntryEnabled(props: { entryId: string }) {
  const [isEntryEnabled, isEntryEnabledResults] = useIsEntryEnabledLazyQuery();
  const [setEntryEnabledMutation, setEntryEnabledResults] = useSetEntryEnabledMutation();

  const { study } = useStudy();
  const confirmation = useConfirmation();

  useEffect(() => {
    if (study) {
      isEntryEnabled({
        variables: {
          study: study._id,
          entry: props.entryId
        },
        fetchPolicy: 'network-only'
      });
    }
  }, [study, setEntryEnabledResults.data]);

  useEffect(() => {
    if (setEntryEnabledResults.called) {
      if (setEntryEnabledResults.error) {
        //show error message
        console.log('error toggling entry', setEntryEnabledResults.error);
      }
    }
  }, [setEntryEnabledResults.data]);

  const handleToggleEnabled = async (entryId: string, checked: boolean) => {
    if (study) {
      if (!checked) {
        confirmation.pushConfirmationRequest({
          title: 'Disable Entry',
          message: 'Are you sure you want to disable this entry? Doing so will exclude this entry from study',
          onConfirm: () => {
            setEntryEnabledMutation({
              variables: { study: study._id, entry: entryId, enabled: checked }
            });
          },
          onCancel: () => {}
        });
      } else {
        setEntryEnabledMutation({
          variables: { study: study._id, entry: entryId, enabled: checked }
        });
      }
    }
  };

  return (
    <Switch
      disabled={setEntryEnabledResults.loading || !isEntryEnabledResults.data}
      checked={isEntryEnabledResults.data ? isEntryEnabledResults.data.isEntryEnabled : false}
      onChange={(event) => handleToggleEnabled(props.entryId, event.target.checked)}
      inputProps={{ 'aria-label': 'controlled' }}
    />
  );
}
