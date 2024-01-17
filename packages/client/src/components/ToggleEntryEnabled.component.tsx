import { Switch } from '@mui/material';
import { useEffect, useState } from 'react';
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
        }
      });
    }
  }, [study]);
  console.log('isEntryEnabledResults',isEntryEnabledResults);
  

  useEffect(() => {
    console.log('setEntryEnabledResults: ', setEntryEnabledResults);

    if (setEntryEnabledResults.error) {
      //show error message
      console.log('error toggling entry', setEntryEnabledResults.error);
    } else {
    }
  }, [setEntryEnabledResults.data]);

  const handleToggleEnabled = async (entryId: string, checked: boolean) => {
    console.log('checked', checked);

    if (study) {
      confirmation.pushConfirmationRequest({
        title: 'Enable Entry',
        message: 'Are you sure you want to delete this study? Doing so will delete all contained tags',
        onConfirm: () => {
          setEntryEnabledMutation({
            variables: { study: study._id, entry: entryId, enabled: checked }
          });
        },
        onCancel: () => {}
      });
    } else {
      console.log('default study not selected', study);
    }
  };
  return (
    <>
      <Switch
        disabled={setEntryEnabledResults.loading || !isEntryEnabledResults.data}
        checked={isEntryEnabledResults.data?.isEntryEnabled}
        // checked={true}
        onChange={(event) => handleToggleEnabled(props.entryId, event.target.checked)}
        inputProps={{ 'aria-label': 'controlled' }}
      />
    </>
  );
}
