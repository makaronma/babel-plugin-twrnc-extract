# babel-plugin-twrnc-extract

This plugin let you use className in your React Native project with twrnc.

## Usage
```tsx
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

You should have a "tw.ts" or "tw.js" file. See the documentation for example. <https://github.com/jaredh159/tailwind-react-native-classnames#customization>

```js
// lib/utils/tailwind.ts
import { create } from 'twrnc';

// create the customized version...
const tw = create(require(`../../tailwind.config.js`)); // <- your path may differ

// ... and then this becomes the main function your app uses
export default tw;
```

Add it as a plugin in `.babelrc`:

```js
{
  "plugins": [
    [
      "twrnc-extract",
      {
        "twPath": "lib/utils/tw" // default "lib/tw"
      }
    ],
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

```typescript
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


## How it works

**In**

```js
const YourComponent = () => {
  return (
    <View className="bg-black flex-1">
      <Text className="text-white">Hello World!</Text>
    </View>
  );
}
```

**Out**

```js
import tw from "./lib/tw";

const YourComponent = () => {
  return (
    <View style={twStyles._attr_str}>
      <Text style={twStyles._attr2_str}>Hello World!</Text>
    </View>
  );
};

const twStyles = {
  _attr_str: tw`bg-black flex-1`,
  _attr2_str: tw`text-white`
};
```
