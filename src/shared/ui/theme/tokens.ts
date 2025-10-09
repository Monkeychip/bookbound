// Central design tokens for the app (colors, spacing, etc.)
// Keep theme values here so they can be reused or exported to design tools.

export const colors: {
  tealBrand: readonly [
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
  ];
  cream: readonly [string, string, string, string, string, string, string, string, string, string];
  orangeAccent: readonly [
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
  ];
} = {
  tealBrand: [
    '#e7f3f2',
    '#cbe3e2',
    '#a9d0ce',
    '#84bbb8',
    '#5ca39f',
    '#3f8c89',
    '#2f7472',
    '#1f5c5a',
    '#134846',
    '#0c3736',
  ],
  cream: [
    '#fffdf8',
    '#fff7ea',
    '#fef0d7',
    '#fde7bf',
    '#f8ddb0',
    '#f1d3a3',
    '#eac998',
    '#e2bf8c',
    '#d9b581',
    '#d0ab77',
  ],
  orangeAccent: [
    '#fff2e8',
    '#ffd9bf',
    '#ffbf94',
    '#ffa56b',
    '#ff8b44',
    '#f87324',
    '#e45f17',
    '#c74e12',
    '#a9420f',
    '#8a370c',
  ],
};

export const spacing = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
};

export default { colors, spacing };
