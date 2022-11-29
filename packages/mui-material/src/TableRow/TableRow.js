import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { unstable_composeClasses as composeClasses } from '@mui/base';
import { alpha } from '@mui/system';
import Tablelvl2Context from '../Table/Tablelvl2Context';
import useThemeProps from '../styles/useThemeProps';
import styled from '../styles/styled';
import tableRowClasses, { getTableRowUtilityClass } from './tableRowClasses';
import TableContext from '../Table/TableContext';

const useUtilityClasses = (ownerState) => {
  const { classes, selected, hover, head, footer, stackResponsive } = ownerState;

  const slots = {
    root: [
      'root',
      selected && 'selected',
      hover && 'hover',
      head && 'head',
      footer && 'footer',
      stackResponsive && 'stackResponsive',
    ],
  };

  return composeClasses(slots, getTableRowUtilityClass, classes);
};

const TableRowRoot = styled('tr', {
  name: 'MuiTableRow',
  slot: 'Root',
  overridesResolver: (props, styles) => {
    const { ownerState } = props;

    return [styles.root, ownerState.head && styles.head, ownerState.footer && styles.footer];
  },
})(({ theme, ownerState }) => {
  return {
    color: 'inherit',
    display: 'table-row',
    verticalAlign: 'middle',
    // We disable the focus ring for mouse, touch and keyboard users.
    outline: 0,
    [`&.${tableRowClasses.hover}:hover`]: {
      backgroundColor: (theme.vars || theme).palette.action.hover,
    },
    [`&.${tableRowClasses.selected}`]: {
      backgroundColor: theme.vars
        ? `rgba(${theme.vars.palette.primary.mainChannel} / ${theme.vars.palette.action.selectedOpacity})`
        : alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
      '&:hover': {
        backgroundColor: theme.vars
          ? `rgba(${theme.vars.palette.primary.mainChannel} / calc(${theme.vars.palette.action.selectedOpacity} + ${theme.vars.palette.action.hoverOpacity}))`
          : alpha(
              theme.palette.primary.main,
              theme.palette.action.selectedOpacity + theme.palette.action.hoverOpacity,
            ),
      },
    },
    ...(ownerState.stackResponsive && {
      [theme.breakpoints.down('sm')]: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        borderBottom: '1px solid rgba(210, 210, 233)',
      },
    }),
    ...(ownerState.stackResponsive &&
      ownerState.head && {
        [theme.breakpoints.down('sm')]: {
          border: 'none',
        },
      }),
  };
});

const defaultComponent = 'tr';
/**
 * Will automatically set dynamic row height
 * based on the material table element parent (head, body, etc).
 */
const TableRow = React.forwardRef(function TableRow(inProps, ref) {
  const props = useThemeProps({ props: inProps, name: 'MuiTableRow' });
  const {
    className,
    component = defaultComponent,
    hover = false,
    selected = false,
    ...other
  } = props;
  const tablelvl2 = React.useContext(Tablelvl2Context);
  const tableContext = React.useContext(TableContext);
  const ownerState = {
    ...props,
    component,
    hover,
    selected,
    head: tablelvl2 && tablelvl2.variant === 'head',
    footer: tablelvl2 && tablelvl2.variant === 'footer',
    stackResponsive: tableContext.stackResponsive,
  };

  const classes = useUtilityClasses(ownerState);

  return (
    <TableRowRoot
      as={component}
      ref={ref}
      className={clsx(classes.root, className)}
      role={component === defaultComponent ? null : 'row'}
      ownerState={ownerState}
      {...other}
    />
  );
});

TableRow.propTypes /* remove-proptypes */ = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // |     To update them edit the d.ts file and run "yarn proptypes"     |
  // ----------------------------------------------------------------------
  /**
   * Should be valid <tr> children such as `TableCell`.
   */
  children: PropTypes.node,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  /**
   * @ignore
   */
  className: PropTypes.string,
  /**
   * The component used for the root node.
   * Either a string to use a HTML element or a component.
   */
  component: PropTypes.elementType,
  /**
   * If `true`, the table row will shade on hover.
   * @default false
   */
  hover: PropTypes.bool,
  /**
   * If `true`, the table row will have the selected shading.
   * @default false
   */
  selected: PropTypes.bool,
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
};

export default TableRow;
