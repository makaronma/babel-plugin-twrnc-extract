# babel-plugin-twrnc-extract

This plugin let you use className in your React Native project with twrnc.

## Usage
```ts
import React from 'react';

const YourComponent = () => {
  return (
    <View className="bg-black flex-1">
      <Text className="text-white">Hello World!</Text>
    </View>
  );
}

```

## Installation

npm:
```shell
npm i -D babel-plugin-twrnc-extract
```

yarn:
```shell
yarn add -D babel-plugin-twrnc-extract
```

## Use

Add it as a plugin in `.babelrc`:

```js
{
  "plugins": [
    "twrnc-extract",
    // other plugins. . .
  ]
}
```

or Add it as a plugin in `babel.config.js`:

```js
module.exports = (api) => {
  api.cache(true);
  return {
    plugins: [
      "twrnc-extract",
      // other plugins. . .
    ],
  };
};
```

Then, Add a global type file e.g. `rn.d.ts`:

```ts
import "react-native";

declare module "react-native" {
  interface FlatListProps<ItemT> extends VirtualizedListProps<ItemT> {
    className?: string;
  }

  interface ImagePropsBase {
    className?: string;
  }

  interface ViewProps {
    className?: string;
  }

  interface TextProps {
    className?: string;
  }

  interface SwitchProps {
    className?: string;
  }

  interface InputAccessoryViewProps {
    className?: string;
  }

  interface TouchableWithoutFeedbackProps {
    className?: string;
  }
}
```