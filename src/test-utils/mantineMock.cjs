const React = require('react');

// CommonJS mock for @mantine/core used in tests. Avoids JSX so it can be
// required safely during Vitest's hoisted mock phase.

exports.MantineProvider = function MantineProvider(props) {
  return props.children;
};

exports.Paper = function Paper(props) {
  return React.createElement('div', props, props.children);
};

exports.Group = function Group(props) {
  return React.createElement('div', props, props.children);
};

exports.Anchor = function Anchor(props) {
  // Support Mantine's `component` prop (e.g. component={Link}) by rendering
  // the provided component when present. Otherwise render a plain <a>.
  const { component: Component, children, ...rest } = props || {};
  if (Component) {
    return React.createElement(Component, rest, children);
  }

  return React.createElement('a', rest, children);
};

exports.Text = function Text(props) {
  return React.createElement('span', props, props.children);
};

exports.ActionIcon = function ActionIcon(props) {
  const { children, ...rest } = props || {};
  return React.createElement('button', Object.assign({ type: 'button' }, rest), children);
};

exports.Menu = function Menu(props) {
  return React.createElement('div', props, props.children);
};
exports.MenuTarget = function MenuTarget(props) {
  return React.createElement('div', props, props.children);
};
exports.MenuDropdown = function MenuDropdown(props) {
  return React.createElement('div', Object.assign({ role: 'menu' }, props), props.children);
};
exports.MenuItem = function MenuItem(props) {
  return React.createElement('div', Object.assign({ role: 'menuitem' }, props), props.children);
};
exports.MenuDivider = function MenuDivider(props) {
  return React.createElement('hr', props);
};

// Attach subcomponents to Menu so usages like <Menu.Target> resolve.
exports.Menu.Target = exports.MenuTarget;
exports.Menu.Dropdown = exports.MenuDropdown;
exports.Menu.Item = exports.MenuItem;
exports.Menu.Divider = exports.MenuDivider;

exports.createTheme = function createTheme(t) {
  return Object.assign({}, t);
};

exports.default = Object.assign({}, exports);
