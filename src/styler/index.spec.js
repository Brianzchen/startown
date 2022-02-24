// @flow
import { lorem, datatype } from '@faker-js/faker';

import styler from '.';

describe('styler', () => {
  const baseTheme = {
    mobileWidth: datatype.number(),
    tabletWidth: datatype.number(),
    spacing: () => 5,
  };

  it('accepts just an object', () => {
    const obj = {
      [lorem.word()]: lorem.word(),
      [lorem.word()]: lorem.word(),
      [lorem.word()]: lorem.word(),
    };

    // $FlowExpectedError[prop-missing] missing theme props
    expect(styler(obj, baseTheme)).toEqual(obj);
  });

  it('accepts a func and return parsed obj', () => {
    const testingTheme = {
      ...baseTheme,
      colors: {
        primary: () => 'green',
      },
    };

    const style = (theme) => ({
      test: theme.colors.primary(),
      another: 'thing',
    });

    // $FlowExpectedError[prop-missing] missing theme props
    expect(styler(style, testingTheme)).toEqual({
      test: 'green',
      another: 'thing',
    });
  });

  it('can recursively get the function', () => {
    const testingTheme = {
      ...baseTheme,
      elevations: {
        hover: 100,
      },
      colors: {
        primary: () => 'green',
      },
    };

    const innerStyle = (theme) => ({
      superTest: theme.colors.primary(),
    });

    const style = (theme, innerStyled) => innerStyled(innerStyle, theme, {
      color: 'hi',
      zIndex: theme.elevations.hover,
    });

    // $FlowExpectedError[prop-missing] missing theme props
    expect(styler(style, testingTheme)).toEqual({
      color: 'hi',
      superTest: 'green',
      zIndex: 100,
    });
  });

  it('does a deep nesting', () => {
    const testingTheme = {
      ...baseTheme,
      some: {
        thing: {
          blah: lorem.word(),
        },
        another: lorem.word(),
      },
    };

    const target = {
      color: testingTheme.some.thing.blah,
      backgroundColor: 'World',
      ':after': {
        fontSize: '',
        borderRadius: 123,
        still: 'here!',
      },
    };

    const style = (theme) => ({
      outline: 'Universe',
      height: theme.spacing(1),
      '::-ms-clear': {
        textAlign: 'start',
        still: '',
      },
    });

    // $FlowExpectedError[prop-missing] missing theme props
    expect(styler(style, testingTheme, target)).toEqual({
      '::-ms-clear': {
        textAlign: 'start',
        still: '',
      },
      ':after': {
        borderRadius: 123,
        fontSize: '',
        still: 'here!',
      },
      backgroundColor: 'World',
      color: testingTheme.some.thing.blah,
      height: 5,
      outline: 'Universe',
    });
  });

  it('does not mutate the target object', () => {
    const target = {
      ':before': {
        color: 'stays',
      },
    };

    const style = {
      test: '123',
    };

    // $FlowExpectedError[prop-missing] missing theme props
    styler(style, baseTheme, target);

    expect(target).toEqual({
      ':before': {
        color: 'stays',
      },
    });
  });

  describe('media shorthands', () => {
    it('accepts a starfall shorthand max sm', () => {
      const fakeTheme = {
        mobileWidth: datatype.number(),
        tabletWidth: datatype.number(),
      };

      const style = (theme) => ({
        test: '123',
        [`@media (max-width: ${theme.mobileWidth}px)`]: {
          color: 'black',
        },
        ':sf-max(sm)': {
          backgroundColor: 'blue',
        },
      });

      // $FlowExpectedError[prop-missing] missing theme props
      expect(styler(style, fakeTheme)).toEqual({
        test: '123',
        [`@media (max-width: ${fakeTheme.mobileWidth}px)`]: {
          color: 'black',
          backgroundColor: 'blue',
        },
      });
    });

    it('accepts a starfall shorthand min sm', () => {
      const fakeTheme = {
        mobileWidth: datatype.number(),
        tabletWidth: datatype.number(),
      };

      const style = (theme) => ({
        test: '123',
        [`@media (min-width: ${theme.mobileWidth + 1}px)`]: {
          color: 'black',
        },
        ':sf-min(sm)': {
          backgroundColor: 'blue',
        },
      });

      // $FlowExpectedError[prop-missing] missing theme props
      expect(styler(style, fakeTheme)).toEqual({
        test: '123',
        [`@media (min-width: ${fakeTheme.mobileWidth + 1}px)`]: {
          color: 'black',
          backgroundColor: 'blue',
        },
      });
    });

    it('accepts a starfall shorthand max md', () => {
      const fakeTheme = {
        mobileWidth: datatype.number(),
        tabletWidth: datatype.number(),
      };

      const style = (theme) => ({
        test: '123',
        [`@media (max-width: ${theme.tabletWidth}px)`]: {
          color: 'black',
        },
        ':sf-max(md)': {
          backgroundColor: 'blue',
        },
      });

      // $FlowExpectedError[prop-missing] missing theme props
      expect(styler(style, fakeTheme)).toEqual({
        test: '123',
        [`@media (max-width: ${fakeTheme.tabletWidth}px)`]: {
          color: 'black',
          backgroundColor: 'blue',
        },
      });
    });

    it('accepts a starfall shorthand min md', () => {
      const fakeTheme = {
        mobileWidth: datatype.number(),
        tabletWidth: datatype.number(),
      };

      const style = (theme) => ({
        test: '123',
        [`@media (min-width: ${theme.tabletWidth + 1}px)`]: {
          color: 'black',
        },
        ':sf-min(md)': {
          backgroundColor: 'blue',
        },
      });

      // $FlowExpectedError[prop-missing] missing theme props
      expect(styler(style, fakeTheme)).toEqual({
        test: '123',
        [`@media (min-width: ${fakeTheme.tabletWidth + 1}px)`]: {
          color: 'black',
          backgroundColor: 'blue',
        },
      });
    });

    it('merges shorthands from style and target', () => {
      const fakeTheme = {
        mobileWidth: datatype.number(),
        tabletWidth: datatype.number(),
      };

      const style = {
        test: '123',
        ':sf-min(md)': {
          backgroundColor: 'blue',
        },
      };

      // $FlowExpectedError[prop-missing] missing theme props
      expect(styler(style, fakeTheme, {
        ':sf-min(md)': {
          color: 'black',
        },
      })).toEqual({
        test: '123',
        [`@media (min-width: ${fakeTheme.tabletWidth + 1}px)`]: {
          color: 'black',
          backgroundColor: 'blue',
        },
      });
    });
  });
});