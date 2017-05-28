# Buttercup UI Components 
[![Buttercup](https://cdn.rawgit.com/buttercup-pw/buttercup-assets/6582a033/badge/buttercup-slim.svg)](https://buttercup.pw) 

React UI Components used in [Buttercup](https://buttercup.pw) product series.

## Preview Components

```shell
yarn install
yarn storybook
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

## List of Components

- `Button`
- Password Generator Popup (`Generator`)
- Password Strength Indicator (`Meter`)
- `Input`
- `Center`, `SmallType`
