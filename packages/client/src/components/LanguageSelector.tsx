import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import '../i18n';
import { useTranslation } from 'react-i18next';
import { Paper } from '@mui/material';

const languages = ['en', 'es'];

export const LanguageSelector: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = React.useState(i18n.resolvedLanguage);

  const handleChange = (event: SelectChangeEvent) => {
    const newLang = event.target.value as string;
    i18n.changeLanguage(newLang);
    setLanguage(newLang);
  };

  return (
    <Paper sx={{ padding: 1, marginTop: 5, minWidth: '200px' }}>
      <FormControl sx={{ minWidth: '200px' }}>
        <InputLabel>{t('components.languageSelector.selectLanguage')}</InputLabel>
        <Select value={language} label="Language" onChange={handleChange}>
          {languages.map((lang) => (
            <MenuItem value={lang}>{t('languages.' + lang)}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </Paper>
  );
};
