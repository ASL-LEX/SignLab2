import { GridColDef } from '@mui/x-data-grid';
import { TagColumnViewProps, TagViewTest, NOT_APPLICABLE, GetGridColDefs } from '../../../types/TagColumnView';
import i18next from 'i18next';
import { useEntryFromIdQuery } from '../../../graphql/entry/entry';
import { Entry } from '../../../graphql/graphql';
import { useEffect, useState } from 'react';
import { VideoEntryView } from '../../VideoView.component';

const VideoGridView: React.FC<TagColumnViewProps> = ({ data }) => {
  const [entry, setEntry] = useState<Entry | null>(null);
  const entryFromIdResult = useEntryFromIdQuery({ variables: { entry: data } });

  useEffect(() => {
    if (entryFromIdResult.data) {
      setEntry(entryFromIdResult.data.entryFromID);
    }
  }, [entryFromIdResult]);

  return (
    <>
      {entry && (
        <VideoEntryView
          url={entry.signedUrl}
          width={300}
          pauseFrame="middle"
          autoPlay={true}
          mouseOverControls={true}
          displayControls={true}
        />
      )}
    </>
  );
};

export const videoViewTest: TagViewTest = (uischema, _schema, _context) => {
  if (uischema.options && uischema.options.customType && uischema.options.customType === 'video') {
    return 5;
  }
  return NOT_APPLICABLE;
};

export const getVideoCols: GetGridColDefs = (uischema, schema, property) => {
  const minVideos = uischema.options!.minimumRequired!;

  let maxVideos = uischema.options!.maximumRequired;
  if (!maxVideos) {
    maxVideos = minVideos;
  }

  const columns: GridColDef[] = [];

  for (let i = 0; i < maxVideos; i++) {
    columns.push({
      field: `${property}-video-${i + 1}`,
      headerName: `${property}: ${i18next.t('common.video')} ${i + 1}`,
      width: 350,
      renderCell: (params) =>
        params.row.data &&
        params.row.data[property] && (
          <VideoGridView data={params.row.data[property][i]} schema={schema} uischema={uischema} />
        )
    });
  }

  return columns;
};
