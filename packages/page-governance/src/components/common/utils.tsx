import { upperFirst } from 'lodash';

// formatter camel, like HelloWorld -> Hello World
export const camelToDisplay = (str: string): string => {
  return upperFirst(str.replace(/([A-Z])/g, ' $1'));
};
