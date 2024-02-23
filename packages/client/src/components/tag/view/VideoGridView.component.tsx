import { GridColDef } from '@mui/x-data-grid';
import { TagColumnViewProps, TagViewTest, NOT_APPLICABLE, GetGridColDefs } from '../../../types/TagColumnView';
import i18next from 'i18next';

const VideoGridView: React.FC<TagColumnViewProps> = ({ data }) => {
  return (
    'hello world'
  )
}

export const videoViewTest: TagViewTest = (uischema, _schema, _context) => {
  if (uischema.options && uischema.options.customType && uischema.options.customType === 'video') {
    return 5;
  }
  return NOT_APPLICABLE;
}

export const getVideoCols: GetGridColDefs = (uischema, schema, property) => {
  const minVideos = uischema.options!.minimumRequired!;

  let maxVideos = uischema.options!.maximumRequired;
  if (!maxVideos) {
    maxVideos = minVideos;
  }

  const columns: GridColDef[] = [];

  for (let i = 0; i < maxVideos; i++) {
    columns.push({
      field: `${property}-video-${i+1}`,
      headerName: `${property}: ${i18next.t('common.video')} ${i + 1}`,
      renderCell: (params) => params.row.data && params.row.data[property] && <VideoGridView data={params.row.data[property]} schema={schema} uischema={uischema} />
    })
  }

  return columns;
}
