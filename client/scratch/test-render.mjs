import React from 'react';
import { renderToString } from 'react-dom/server';
import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteEmpty,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
} from './components/reui/autocomplete.js';

try {
  const html = renderToString(
    React.createElement(
      Autocomplete,
      { value: 'DHA', items: [{ id: '1', value: 'DHA' }] },
      React.createElement(AutocompleteInput, { showTrigger: true })
    )
  );
  console.log('Render success:', html.length);
} catch (e) {
  console.error('Render error:', e);
}
