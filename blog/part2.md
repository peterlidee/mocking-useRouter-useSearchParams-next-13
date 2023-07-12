# Mocking URLSearchParams, searchParams and useSearchParams with Jest

In the [previous part](TODO) we setup an example of a little project that uses the `searchParams` page prop, the `useSearchParams` hook and the `useRouter` hook. We went over all the files to get a good understanding how everything works.

In this part, we will test all of the files, functions and hooks. The files and test can be found on [github](TODO).

## Overview

Components to test:

- `page.js`
- `<List />`
- `<ListControlesButtons />`

Functions to test:

- `getSortOrderFromSearchParams()`
- `getSortOrderFromUseSearchParams()`
- `validateSortOrder()`

Custom Hook:

- `useSort()`

As we talked about in the previous chapter, I wrote the code in such a way that `searchParams`, `useSearchParams` and `useRouter` are nicely separated from our `jsx` in functions and a custom hook. Testing these functions will be the focus of this part. In the third part we will test our custom hook.

While we will not review the tests of our components, they do exist. You can view them in on [github](TODO). The test files are in a `__test__` folder on the same root as the component files.

## validateSortOrder()

This function receives a value, checks if this value equals `asc` or `desc` and returns that boolean. It's also a type predicate. When returning true, Typescript will threat values as of type `SortOrder`. But that doesn't matter for testing. Here's the function:

```ts
// lib/validateSortOrder.ts

import { SortOrder } from '@/types';

export default function validateSortOrder(value: string): value is SortOrder {
  const validOptions: [SortOrder[0], SortOrder[1]] = ['asc', 'desc'];
  return validOptions.includes(value as SortOrder);
}
```

The test is pretty straightforward. We test 4 scenario's: when value is `asc` or `desc`, the function returns true. When value is invalid: `foobar` of `undefined`, the function returns false. No tricks, no magic, just a simple test.

```ts
// lib/__test__/validateSortOrder.test.js

import validateSortOrder from '../validateSortOrder';

describe('@/lib/isValidSortOrder', () => {
  test('It correctly validates "asc"', () => {
    const result = validateSortOrder('asc');
    expect(result).toBe(true);
  });

  test('It correctly validates "desc"', () => {
    const result = validateSortOrder('desc');
    expect(result).toBe(true);
  });

  test('It returns invalid for value undefined', () => {
    const result = validateSortOrder(undefined);
    expect(result).toBe(false);
  });

  test('It returns invalid for value "foobar"', () => {
    const result = validateSortOrder('foobar');
    expect(result).toBe(false);
  });
});
```

## `getSortOrderFrom...`

`getSortOrderFromSearchParams()` and `getSortOrderFromUseSearchParams()` are twin functions. They do the same thing but they take a different type of parameter. The first takes an object (from `searchParams` page prop), the second takes an `URLSearchParams` object (from `useSearchParams` hook).

The goal of these functions is to take a url query and:

- Check if this query has a prop called `sortOrder`.
- Check if the value of this `sortOrder` props is not empty.

If these conditions are met, these functions call `validateSortOrder`, else they return a default value: `asc`.

```ts
// lib/getSortOrderFromSearchParams.ts

import { SearchParams, SortOrder } from '@/types';
import validateSortOrder from './validateSortOrder';

export default function getSortOrderFromSearchParams(
  searchParams: SearchParams
): SortOrder {
  const sortOrderParam = searchParams.sortOrder;
  let sortOrder: SortOrder = 'asc';
  if ('sortOrder' in searchParams && sortOrderParam) {
    if (validateSortOrder(sortOrderParam)) {
      sortOrder = sortOrderParam;
    }
  }
  return sortOrder;
}
```

```ts
// lib/getSortOrderFromUseSearchParams.ts

import { SortOrder } from '@/types';
import { ReadonlyURLSearchParams } from 'next/navigation';
import validateSortOrder from '../lib/validateSortOrder';

export default function getSortOrderFromUseSearchParams(
  params: ReadonlyURLSearchParams
) {
  const sortOrderParam = params.get('sortOrder');
  let sortOrder: SortOrder = 'asc';
  if (params.has('sortOrder') && sortOrderParam) {
    if (validateSortOrder(sortOrderParam)) {
      sortOrder = sortOrderParam;
    }
  }
  return sortOrder;
}
```

### getSortOrderFromSearchParams()

Let's test the first one first. This is the one that takes an object, f.e. `{ sortOrder: 'asc' }`. We already tested `validateSortOrder` so we will mock this function and return a value from this mock (true of false). We run every possible combination. Notice how we 'mock' our object by writing an object ourselves:

- No `sortOrder` param: `{}`
- `sortOrder` with empty or undefined value: `{ sortOrder: '' }`
- `sortOrder` with non-empty values `{ sortOrder: 'foobar' }` + true or false return values from the `validateSortOrder` mock.

```ts
// lib/__test__/getSortOrderFromSearchParams.test.js

import getSortOrderFromSearchParams from '../getSortOrderFromSearchParams';
import validateSortOrder from '../validateSortOrder';

jest.mock('../validateSortOrder');

describe('@/lib/getSortOrderFromSearchParams', () => {
  test('It returns default "asc" when no sortOrder property', () => {
    validateSortOrder.mockReturnValue(true);
    const result = getSortOrderFromSearchParams({});
    expect(result).toBe('asc');
  });

  test('It returns default "asc" when sortOrder is empty', () => {
    validateSortOrder.mockReturnValue(true);
    const result = getSortOrderFromSearchParams({ sortOrder: '' });
    expect(result).toBe('asc');
  });

  test('It returns default "asc" when sortOrder is undefined', () => {
    validateSortOrder.mockReturnValue(true);
    const result = getSortOrderFromSearchParams({ sortOrder: undefined });
    expect(result).toBe('asc');
  });

  test('It returns default "asc" when validateSortOrder returns false', () => {
    validateSortOrder.mockReturnValue(false);
    const result = getSortOrderFromSearchParams({ sortOrder: 'foobar' });
    expect(result).toBe('asc');
  });

  test('It returns sortOrder value when validateSortOrder returns true', () => {
    validateSortOrder.mockReturnValue(true);
    const result = getSortOrderFromSearchParams({ sortOrder: 'foobar' });
    expect(result).toBe('foobar');
  });
});
```

### getSortOrderFromUseSearchParams()

As said earlier, we don't pass an object but an `URLSearchParams` object to the second function `getSortOrderFromUseSearchParams`. So, we will have to 'mock' this interface somehow. How do we do this? We just write a object that has all the methods that are used in our function.

Our function `getSortOrderFromUseSearchParams` uses the methods `.has()` and `.get()`. So, the test object we pass into our function needs to have these 2 methods:

```js
{
  get: () => 'some value',
  has: () => true // (or false)
}

```

As we need to run multiple tests on this function, I wrote a setup function to keep things DRY:

```js
function setup(value, hasValue) {
  const param = {
    get: () => value,
    has: () => hasValue,
  };
  return getSortOrderFromUseSearchParams(param);
}
```

We call this function inside a test. We pass it the value we want to see returned from `get` and a boolean we want to return from `has`. Our setup function then returns the return value from `getSortOrderFromUseSearchParams`: `asc` | `desc`.

Here is an example of one of our test to make things clear:

```js
test('It returns default "asc" when validateSortOrder returns false', () => {
  validateSortOrder.mockReturnValue(false);
  const result = setup('foobar', true);
  expect(result).toBe('asc');
});
```

And here is our function again:

```ts
function getSortOrderFromUseSearchParams(params: ReadonlyURLSearchParams) {
  const sortOrderParam = params.get('sortOrder');
  let sortOrder: SortOrder = 'asc';
  if (params.has('sortOrder') && sortOrderParam) {
    if (validateSortOrder(sortOrderParam)) {
      sortOrder = sortOrderParam;
    }
  }
  return sortOrder;
}
```

We call the setup function:

```js
const result = setup('foobar', true);
```

This equals:

```js
const result = getSortOrderFromUseSearchParams({
  get: () => 'foobar',
  has: () => true,
});
```

`getSortOrderFromUseSearchParams` receives our object and runs these `has()` and `get()` methods on this object.

As both the conditions are now met:

```js
if(params.has('sortOrder') && sortOrderParam)
```

`getSortOrderFromUseSearchParams` continues and calls `validateSortOrder`. But, we mocked that function and gave a return value of `false`.

```js
validateSortOrder.mockReturnValue(false);
```

This leads the following condition inside `getSortOrderFromUseSearchParams` to fail:

```ts
if (validateSortOrder(sortOrderParam)) {
  sortOrder = sortOrderParam;
}
```

As this condition fails, `sortOrder` will not be overwritten (with `'foobar'`) and `getSortOrderFromUseSearchParams` will return the default value of `asc`. And that is what our test asserted:

```ts
expect(result).toBe('asc');
```

Let's go over this one more time. `getSortOrderFromUseSearchParams` expects an object with a `has()` and a `get()` method. As we test this function in isolation we need to fabricate this object ourselves.

We setup a setup function where we return different values from the `has()` and `get()` methods. This allows us to test `getSortOrderFromUseSearchParams` in different scenario's.

Inside `getSortOrderFromUseSearchParams` we mocked `validateSortOrder` and set different return values on it along our needs. This makes the test a bit complex but flexible.

We end up testing the same cases we tested in the earlier twin function, using a different parameter. Here are all the tests for `getSortOrderFromUseSearchParams`:

```js
// lib/__test__/getSortOrderFromUseSearchParams.test.js

import getSortOrderFromUseSearchParams from '../getSortOrderFromUseSearchParams';
import validateSortOrder from '../validateSortOrder';

jest.mock('../validateSortOrder');

function setup(value, hasValue) {
  const param = {
    get: () => value,
    has: () => hasValue,
  };
  return getSortOrderFromUseSearchParams(param);
}

describe('@/lib/getSortOrderFromUseSearchParams', () => {
  test('It returns default "asc" when no sortOrder property', () => {
    validateSortOrder.mockReturnValue(true);
    const result = setup('foobar', false);
    expect(result).toBe('asc');
  });

  test('It returns default "asc" when no sortOrder is empty', () => {
    validateSortOrder.mockReturnValue(true);
    const result = setup('', true);
    expect(result).toBe('asc');
  });

  test('It returns default "asc" when no sortOrder is undefined', () => {
    validateSortOrder.mockReturnValue(true);
    const result = setup(undefined, true);
    expect(result).toBe('asc');
  });

  test('It returns default "asc" when validateSortOrder returns false', () => {
    validateSortOrder.mockReturnValue(false);
    const result = setup('foobar', true);
    expect(result).toBe('asc');
  });

  test('It returns sortOrder value when validateSortOrder returns true', () => {
    validateSortOrder.mockReturnValue(true);
    const result = setup('foobar', true);
    expect(result).toBe('foobar');
  });
});
```

## Conclusion

The main takeaway there is how we 'mocked' `URLSeachParams`. Our function used 2 methods from this object: `get()` and `has()`. By simply creating an object with these 2 methods, we successfully mocked `URLSeachParams`. On top of that we added flexibility with a setup function. This allowed us to test different scenarios.

In the [third and last part](todo) we will test our custom `useSort` hook.
