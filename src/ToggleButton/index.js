// @flow
import * as React from 'react';

import isReactElement from '../internal/isReactElement';

import BaseButton from '../BaseButton';
import type { BaseButtonT } from '../BaseButton';
import styler from '../styler';
import useTheme from '../useTheme';
import type { StyleT } from '../types';

export type ToggleButtonT = {
  ...BaseButtonT,
  /** child element inside the button */
  children?: React.Node,
  /** overrides styling for root element */
  style?: StyleT,
  /** whether the toggle is enabled */
  selected?: boolean,
  /**
   * whether the button is disabled, which would apply disabled
   * styling and not trigger onClick when clicked
   */
  disabled?: boolean,
  ...
};

const ToggleButton: React$AbstractComponent<ToggleButtonT, HTMLElement> = React.forwardRef<ToggleButtonT, HTMLElement>(({
  children = null,
  style = {},
  selected = false,
  disabled = false,
  ...otherProps
}: ToggleButtonT, ref) => {
  const theme = useTheme();

  // ToggleButton modifies the styling if child is `Icon`
  const isIcon = isReactElement(children, 'Icon');

  const styles = {
    button: () => styler(style, theme, {
      color: selected && isIcon ? theme.colors.secondary() : theme.colors[isIcon ? 'monoTertiary' : 'monoPrimary'](),
      backgroundColor: selected ? theme.colors.secondary(-0.5) : theme.colors.monoInverse(),
      fontSize: isIcon ? theme.fonts.heading2.px : theme.fonts.smallButton.px,
      fontWeight: theme.fonts.smallButton.style,
      lineHeight: theme.fonts.smallButton.leading,
      border: `${theme.line(1)} solid ${theme.colors[selected ? 'secondary' : 'monoMid']()}`,
      borderRadius: theme.corner(2),
      padding: `${theme.spacing(2) - (isIcon ? 1 * theme.scale : 0)}px ${theme.spacing(4)}px`,
      ...disabled
        ? {
          opacity: 0.5,
        }
        : { ...null },
    }),
  };

  return (
    <BaseButton
      {...otherProps}
      ref={ref}
      style={styles.button}
      disabled={disabled}
      focusEffect="inner"
      is-selected={selected.toString()}
    >
      {children}
    </BaseButton>
  );
});

ToggleButton.displayName = 'ToggleButton';

export default ToggleButton;
