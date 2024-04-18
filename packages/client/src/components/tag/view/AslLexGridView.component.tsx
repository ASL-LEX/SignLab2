import { TagColumnViewProps, TagViewTest, NOT_APPLICABLE, GetGridColDefs } from '../../../types/TagColumnView';
import { useLexiconByKeyQuery } from '../../../graphql/lex';
import { useEffect, useState } from 'react';
import { VideoEntryView } from '../../VideoView.component';
import i18next from 'i18next';

const AslLexGridViewVideo: React.FC<TagColumnViewProps> = ({ data }) => {
  const videoUrl = data as string;

  return (
    <>
      {videoUrl && (
        <VideoEntryView
          url={videoUrl}
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

const AslLexGridViewKey: React.FC<TagColumnViewProps> = ({ data }) => {
  return data;
};

const AslLexGridViewPrimary: React.FC<TagColumnViewProps> = ({ data }) => {
  const [primary, setPrimary] = useState<string | null>(null);

  const lexiconByKeyResult = useLexiconByKeyQuery({
    variables: { lexicon: import.meta.env.VITE_ASL_LEXICON_ID, key: data }
  });

  useEffect(() => {
    if (lexiconByKeyResult.data) {
      setPrimary(lexiconByKeyResult.data.lexiconByKey.primary);
    }
  }, [lexiconByKeyResult]);

  return primary || '';
};

export const aslLexTest: TagViewTest = (uischema, _schema, _context) => {
  if (
    uischema.options != undefined &&
    uischema.options.customType != undefined &&
    uischema.options.customType == 'asl-lex'
  ) {
    return 5;
  }
  return NOT_APPLICABLE;
};

export const getAslLexCols: GetGridColDefs = (uischema, schema, property) => {
  return [
    {
      field: `${property}-video`,
      headerName: `${property}: ${i18next.t('common.video')}`,
      width: 350,
      valueGetter: (params) => params.row.data[property]?.field?.lexiconEntry.video,
      renderCell: (params) =>
        params.value && (
          <AslLexGridViewVideo data={params.value} schema={schema} uischema={uischema} />
        )
    },
    {
      field: `${property}-key`,
      headerName: `${property}: ${i18next.t('common.key')}`,
      valueGetter: (params) => params.row.data[property]?.field?.lexiconEntry.key,
      renderCell: (params) =>
        params.value && (
          <AslLexGridViewKey data={params.value} schema={schema} uischema={uischema} />
        )
    },
    {
      field: `${property}-primary`,
      headerName: `${property}: ${i18next.t('common.primary')}`,
      valueGetter: (params) => params.row.data[property]?.field?.lexiconEntry.primary,
      renderCell: (params) =>
        params.value && (
          <AslLexGridViewPrimary data={params.value} schema={schema} uischema={uischema} />
        )
    }
  ];
};
