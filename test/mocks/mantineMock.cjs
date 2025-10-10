const React = require('react');

// Keep only a short whitelist of props safe to pass through to DOM
const safePropNames = new Set([
  'id',
  'className',
  'style',
  'href',
  'role',
  'type',
  'value',
  'placeholder',
  'onChange',
  'onClick',
  'to',
  'aria-label',
  'aria-hidden',
  'title',
  'name',
  'defaultValue',
  'checked',
  'children',
  'data-testid',
  'data-discover',
]);

function safeProps(props) {
  if (!props) return {};
  const out = {};
  Object.keys(props).forEach((k) => {
    if (safePropNames.has(k)) out[k] = props[k];
    else if (k.startsWith('data-')) out[k] = props[k];
  });
  return out;
}

// CommonJS mock for @mantine/core used in tests. Avoids JSX so it can be
// required safely during Vitest's hoisted mock phase.

exports.MantineProvider = function MantineProvider(props) {
  return props.children;
};

exports.Paper = function Paper(props) {
  return React.createElement('div', safeProps(props), props.children);
};

exports.Group = function Group(props) {
  return React.createElement('div', safeProps(props), props.children);
};

exports.Button = function Button(props) {
  const { children, component: Component, ...rest } = props || {};
  if (Component) return React.createElement(Component, safeProps(rest), children);
  return React.createElement(
    'button',
    Object.assign({ type: 'button' }, safeProps(rest)),
    children,
  );
};

exports.Stack = function Stack(props) {
  return React.createElement('div', safeProps(props), props.children);
};

exports.Pagination = function Pagination(props) {
  // Render a simple nav/list for pagination in tests
  const { children } = props || {};
  return React.createElement(
    'nav',
    Object.assign({ 'data-testid': 'pagination' }, safeProps(props)),
    children,
  );
};

exports.TextInput = function TextInput(props) {
  const { value, onChange, placeholder, ...rest } = props || {};
  return React.createElement(
    'input',
    Object.assign(safeProps(rest), { value: value ?? '', placeholder, onChange }),
  );
};

exports.Center = function Center(props) {
  return React.createElement(
    'div',
    Object.assign(
      { style: { display: 'flex', justifyContent: 'center', alignItems: 'center' } },
      safeProps(props),
    ),
    props.children,
  );
};

exports.ThemeIcon = function ThemeIcon(props) {
  return React.createElement('div', safeProps(props), props.children);
};

exports.SegmentedControl = function SegmentedControl(props) {
  // Render options as buttons; call onChange with value when clicked
  const { data = [], value, onChange } = props || {};
  return React.createElement(
    'div',
    safeProps(props),
    (data || []).map((d, i) =>
      React.createElement(
        'button',
        {
          key: d.value ?? i,
          'data-value': d.value,
          onClick: () => onChange && onChange(String(d.value)),
          type: 'button',
        },
        d.label,
      ),
    ),
  );
};

exports.Title = function Title(props) {
  const { order = 3, children, ...rest } = props || {};
  const Tag = `h${order}`;
  return React.createElement(Tag, safeProps(rest), children);
};

exports.Anchor = function Anchor(props) {
  // Support Mantine's `component` prop (e.g. component={Link}) by rendering
  // the provided component when present. Otherwise render a plain <a>.
  const { component: Component, children, ...rest } = props || {};
  if (Component) {
    return React.createElement(Component, safeProps(rest), children);
  }

  return React.createElement('a', safeProps(rest), children);
};

exports.Text = function Text(props) {
  return React.createElement('span', safeProps(props), props.children);
};

exports.ActionIcon = function ActionIcon(props) {
  const { children, ...rest } = props || {};
  return React.createElement(
    'button',
    Object.assign({ type: 'button' }, safeProps(rest)),
    children,
  );
};

exports.Menu = function Menu(props) {
  return React.createElement('div', safeProps(props), props.children);
};
exports.MenuTarget = function MenuTarget(props) {
  return React.createElement('div', safeProps(props), props.children);
};
exports.MenuDropdown = function MenuDropdown(props) {
  return React.createElement(
    'div',
    Object.assign({ role: 'menu' }, safeProps(props)),
    props.children,
  );
};
exports.MenuItem = function MenuItem(props) {
  return React.createElement(
    'div',
    Object.assign({ role: 'menuitem' }, safeProps(props)),
    props.children,
  );
};
exports.MenuDivider = function MenuDivider(props) {
  return React.createElement('hr', safeProps(props));
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
