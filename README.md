# Buttercup UI Components
[![Buttercup](https://cdn.rawgit.com/buttercup-pw/buttercup-assets/6582a033/badge/buttercup-slim.svg)](https://buttercup.pw) [![npm version](https://badge.fury.io/js/%40buttercup%2Fui.svg)](https://www.npmjs.com/package/@buttercup/ui) [![Build Status](https://travis-ci.org/buttercup/ui.svg?branch=master)](https://travis-ci.org/buttercup/ui)

React UI Components used in [Buttercup](https://buttercup.pw) product series.

## Preview Components

```shell
npm install
npm run storybook
```

Then head to [http://localhost:6006/](http://localhost:6006/).

## Use Components

```shell
yarn add @buttercup/ui
# or
npm install @buttercup/ui --save
```

```javascript
import { Button } from '@buttercup/ui';

const MyComponent = () => (
  <Button danger>Delete</Button>
);
```

## Available Components

### Password generator
The password generator comes bundled in a popover, which can be used like so:

```javascript
import { Generator } from "@buttercup/ui";

const Comp = () => (
  <Generator
    onGenerate={handleGenerated}
    isOpen={isOpen}
  >
    <div>
      <Button onClick={toggleGenerator}>
        Generate Password
      </Button>
    </div>
  </Generator>
);
```

If you just require the _body_ of the generator, you can import `GeneratorUserInterface` instead.

### Password Strength Indicator
The indicator can be used like so:

```javascript
import { Meter } from "@buttercup/ui";

const Comp = () => (
  <Meter input={inputValue} />
);
```

### Button
Available as `Button`.

TBA.

### Input
Available as `Input`.

TBA.

### Center
Available as `Center`.

TBA.

### SmallType
Available as `SmallType`.

TBA.

## Translations / i18n

Parts of this UI library are internationalised. You can find the translations at `src/i18n/translations`. When adding _new_ translations, make sure to update the index at `src/i18n/translations/index.js` so that the language is made available.

To change the language, import `changeLanguage` and call it with a 2-character language code, such as `en`.

## Testing
Run `npm t` to execute the tests.

To update component snapshots run `npm run test:updateSnapshots`.
