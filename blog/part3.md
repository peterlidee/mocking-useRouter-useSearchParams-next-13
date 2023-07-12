# Mocking useSearchParams() and useRouter() with Jest in Next 13 (next/navigation)

Here is our custom hook again:

```ts
// hooks/useSort.ts

import { SortOrder } from '@/types';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import getSortOrderFromUseSearchParams from '../lib/getSortOrderFromUseSearchParams';

export default function useSort() {
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const sortOrder = getSortOrderFromUseSearchParams(params);

  const handleSort = (value: SortOrder) => {
    const newParams = new URLSearchParams(params.toString());
    newParams.set('sortOrder', value);
    router.push(`${pathname}?${newParams.toString()}`);
  };

  return { sortOrder, handleSort };
}
```

This hook does 2 things. It extracts `sortOrder` from our the query string. We tested the function that is responsible for this: `getSortOrderFromUseSearchParams` in the previous part.

Secondly, it returns a `handleSort` function. This function will be used as an `onClick` event handler for our sort buttons. It will be called as `handleSort('asc')` or `handleSort('desc')`.

`handleSort` creates a new `URLSearchParams` object from the old readonly `URLSearchParams` object that `useSearchParams` provides us. It then sets `sortOrder` to `asc` or `desc` on this new `URLSearchParams` object, creates a route and pushes that to router.

Good news, this is actually not that hard to test. Bad news: there is a complication and we start with that.

## Testing custom hooks

You cannot test a custom hook function in the same way you would test another function. The reason, custom hooks only work inside functional components.

So, in order to test our custom hooks, we have to call it inside a functional component, mount this component in our test and then perform our tests.

So, we write a functional component:

```jsx
function TestComponent() {
  const { sortOrder, handleSort } = useSort();
  return (
    <>
      <h1>{sortOrder}</h1>
      <button onClick={() => handleSort('bbbb')}>sort</button>
    </>
  );
}
```

We render `sortOrder` inside an `<h1>`, this makes it easy to query and we attach `handleSort` to a button. And we are ready to test.

## sortOrder

We have already tested the function `getSortOrderFromUseSearchParams` so we can simply mock it and then return a value from this mock. If we then mount our `<TestComponent />`, this return value should appear inside our `<h1>`. We will perform this test in a bit. This is also all the testing we need to do for `sortOrder`.

## handleSort()

`handleSort` makes use of 3 hooks: `useSearchParams()`, `usePathname()` and `useRouter()`. Since we mount `<TestComponent />` in `jest-dom`, we don't actually have a router, searchParams or a pathname. So we have to mock all of them. This is easy with `Jest` automatic mocking:

```js
import { usePathname, useSearchParams, useRouter } from 'next/navigation';

jest.mock('next/navigation');
```

We add a setup function and write our first test:

```js
function setup() {
  render(<TestComponent />);
  const heading = screen.getByRole('heading', { level: 1 });
  const button = screen.getByRole('button');
  return { heading, button };
}
```

Our setup function renders `<TestComponent />`, queries the `<h1>` and `<button>` and returns these. Our first test is this:

```js
test('TestComponent renders', () => {
  const { heading, button } = setup();
  expect(useSearchParams).toHaveBeenCalled();
  expect(usePathname).toHaveBeenCalled();
  expect(useRouter).toHaveBeenCalled();
  expect(heading).toHaveTextContent('aaaa');
  expect(button).toBeInTheDocument();
});
```

And it passes successfully. All the hooks we just mocked, got called. On top of that, our `<h1>` correctly displays the `aaaa` value we returned from our mock.

```js
jest.mock('../../lib/getSortOrderFromUseSearchParams');
getSortOrderFromUseSearchParams.mockReturnValue('aaaa');
```

In other words, we tested `sortOrder` as we said we would. But, now we run into problems because we actually need return values from our mocked hooks.

### useSearchParams()

`useSearchParams` returns a `URLSearchParams` object. We already know how to mock this because we did it to test the `getSortOrderFromUseSearchParams` function. This means we already know how to mock `useSearchParams`.

`useSort` only calls one method: `toString()`. So, from the `useSearchParams()` mock we will return an object with this method. What this method returns depends on the test, so we will have to use our setup function for this:

```js
function setup(toString = '') {
  useSearchParams.mockReturnValue({
    toString: () => toString,
  });
  render(<TestComponent />);
  const heading = screen.getByRole('heading', { level: 1 });
  const button = screen.getByRole('button');
  return { heading, button };
}
```

We added a `toString` argument to `setup` with a default empty string value. The `toString` argument becomes the return value of the `.toString()` method on the object we return from of our `useSearchParams` mock. We will use this setup in later tests.

Looking at our `handleSort` function inside `useSort`:

```js
const handleSort = (value: SortOrder) => {
  const newParams = new URLSearchParams(params.toString());
  newParams.set('sortOrder', value);
  router.push(`${pathname}?${newParams.toString()}`);
};
```

You may be wondering: don't we also use the `set()` method? The answer is no. We have 2 `URLSearchParams` objects. One, returned from `useSearchParams` hook that we will mock and a second new one that we save into the `newParams` variable.

We do not need to mock this second one. (I'm not even sure we can!) Why not mock? Because we are not testing the `URLSearchParams` constructor. We assume it is stable and we just use it in the same way we don't mock `useState` or `useEffect`.

Also note that we mocked `params.toString()` but this does **not** mock `newParams.toString()`.

### usePathname()

`usePathname()` simply return a string: f.e. `localhost/sortList`. We only use it to construct a route. So for testing purposes, we will return a value `example.com` from it. We will use this in a bit in a test.

```ts
usePathname.mockReturnValue('example.com');
```

### useRouter()

We already mocked `useRouter` and successfully ran a test on it. But `handleSort` calls the router `push` method and we want to test that. This means we have to:

- Add a mock for this `push` function.
- Test if the mocked `push` function was called.
- Test if the mocked `push` function was called with the correct route.

Right now, mocked `useRouter` return nothing (undefined). We need it to return a `push` method:

```js
useRouter.mockReturnValue({
  push: jest.fn(),
});
```

This setup would work. `<TestComponent />` will be successfully rendered. But, there is a flaw. We don't have access to `push`. This test:

```js
expect(push).toHaveBeenCalled();
```

Would lead to this error: `ReferenceError: push is not defined`. Why is this? Because we don't have a reference to `jest.fn()`. It's like an anonymous function. The solution is simple. We create a reference to `jest.fn()` and pass that reference.

```js
const pushMock = jest.fn();
jest.mock('next/navigation');
useRouter.mockReturnValue({
  push: pushMock,
});
```

Now, we are able to test `push` by using `pushMock`:

```js
expect(pushMock).toHaveBeenCalled();
```

And that's it, we've returned values from all our mocks. Here is an overview of where we are at:

```js
import { screen, render } from '@testing-library/react';

import useSort from '../useSort';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import getSortOrderFromUseSearchParams from '../../lib/getSortOrderFromUseSearchParams';

jest.mock('next/navigation');
const pushMock = jest.fn();

usePathname.mockReturnValue('example.com');
useRouter.mockReturnValue({
  push: pushMock,
});

jest.mock('../../lib/getSortOrderFromUseSearchParams');
getSortOrderFromUseSearchParams.mockReturnValue('aaaa');

function setup(toString = '') {
  useSearchParams.mockReturnValue({
    toString: () => toString,
  });
  render(<TestComponent />);
  const heading = screen.getByRole('heading', { level: 1 });
  const button = screen.getByRole('button');
  return { heading, button };
}

function TestComponent() {
  const { sortOrder, handleSort } = useSort();
  return (
    <>
      <h1>{sortOrder}</h1>
      <button onClick={() => handleSort('bbbb')}>sort</button>
    </>
  );
}

describe('hooks/useSort in TestComponent', () => {
  test('TestComponent renders', () => {
    const { heading, button } = setup();
    expect(useSearchParams).toHaveBeenCalled();
    expect(usePathname).toHaveBeenCalled();
    expect(useRouter).toHaveBeenCalled();
    expect(heading).toHaveTextContent('aaaa');
    expect(button).toBeInTheDocument();
  });
});
```

The only thing there is left to do is actually write our tests for `handleSort`. Let's look at `handleSort` one more time:

```js
const handleSort = (value: SortOrder) => {
  const newParams = new URLSearchParams(params.toString());
  newParams.set('sortOrder', value);
  router.push(`${pathname}?${newParams.toString()}`);
};
```

And here is the test:

```js
test('handleSort calls router.push mock with the correct string', async () => {
  const user = userEvent.setup();
  const { button } = setup();
  await user.click(button);
  expect(pushMock).toHaveBeenCalledWith(`example.com?sortOrder=bbbb`);
});
```

This test compiles everything we talked about. We simulate a button click in `<TestComponent />`. This will call: `handleSort('bbbb')`. We called our setup function with no argument. This means that the `toString` method will return an empty string. (This is the equivalent of a route with no parameters, f.e. `localhost/sortList`).

`sortOrder` passes this empty string into a new `URLSearchParams` and then adds parameter `sortOrder` with the value passed from `handleSort`: 'bbbb' to this new object.

Finally, the `push` method is called with a route:

```js
router.push(`${pathname}?${newParams.toString()}`);
```

We mocked the return value of `usePathname` to be 'example.com'. And our `newParams.toString()` will return `sortOrder=bbbb`. And that is what we expected `pushMock` to have been called with (don't forget `?`):

```js
expect(pushMock).toHaveBeenCalledWith(`example.com?sortOrder=bbbb`);
```

We wrote 2 more tests. In the next test we return a parameter from the `useSearchParams` mock. This simulates this url: `localhost/sortList?foo=bar`. We then test if the new `sortOrder` parameter was correctly added.

```js
test('handleSort adds our sortOrder parameter to existing parameters', async () => {
  const user = userEvent.setup();
  const { button } = setup('foo=bar');
  await user.click(button);
  expect(pushMock).toHaveBeenCalledWith(`example.com?foo=bar&sortOrder=bbbb`);
});
```

In our last test, we return the value `sortOrder=cccc` from the `useSearchParams` hook. We want to test if it gets correctly overwritten. The test succeeds:

```js
test('handleSort adds overwrites an existing sortOrder parameter', async () => {
  const user = userEvent.setup();
  const { button } = setup('sortOrder=cccc');
  await user.click(button);
  expect(pushMock).toHaveBeenCalledWith(`example.com?sortOrder=bbbb`);
});
```

Here is our final full test file:

```js
// hooks/__test__/useSort.test.js
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import useSort from '../useSort';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import getSortOrderFromUseSearchParams from '../../lib/getSortOrderFromUseSearchParams';

jest.mock('next/navigation');
const pushMock = jest.fn();

usePathname.mockReturnValue('example.com');
useRouter.mockReturnValue({
  push: pushMock,
});

jest.mock('../../lib/getSortOrderFromUseSearchParams');
getSortOrderFromUseSearchParams.mockReturnValue('aaaa');

function setup(toString = '') {
  useSearchParams.mockReturnValue({
    toString: () => toString,
  });
  render(<TestComponent />);
  const heading = screen.getByRole('heading', { level: 1 });
  const button = screen.getByRole('button');
  return { heading, button };
}

function TestComponent() {
  const { sortOrder, handleSort } = useSort();
  return (
    <>
      <h1>{sortOrder}</h1>
      <button onClick={() => handleSort('bbbb')}>sort</button>
    </>
  );
}

describe('hooks/useSort in TestComponent', () => {
  test('TestComponent renders', () => {
    const { heading, button } = setup();
    expect(useSearchParams).toHaveBeenCalled();
    expect(usePathname).toHaveBeenCalled();
    expect(useRouter).toHaveBeenCalled();

    expect(heading).toHaveTextContent('aaaa');
    expect(button).toBeInTheDocument();
  });

  describe('handleSort function, returned from useSort works correctly', () => {
    test('It calls router.push mock with the correct string', async () => {
      const user = userEvent.setup();
      const { button } = setup();
      await user.click(button);
      expect(pushMock).toHaveBeenCalledWith(`example.com?sortOrder=bbbb`);
    });

    test('It adds our sortOrder parameter to existing parameters', async () => {
      const user = userEvent.setup();
      const { button } = setup('foo=bar');
      await user.click(button);
      expect(pushMock).toHaveBeenCalledWith(
        `example.com?foo=bar&sortOrder=bbbb`
      );
    });

    test('It adds overwrites an existing sortOrder parameter', async () => {
      const user = userEvent.setup();
      const { button } = setup('sortOrder=cccc');
      await user.click(button);
      expect(pushMock).toHaveBeenCalledWith(`example.com?sortOrder=bbbb`);
    });
  });
});
```

## Conclusion

To test custom hooks, you need to call them inside a functional component.

Mocking `useSearchParams` equals mocking a `URLSearchParams` object. You do this by creating an object and adding all the methods you need on it.

Finally, mocking `useRouter` is not that hard. Return an object with all the methods you need from the `useRouter` mock. To test these methods individually, you will need to manually create a mocking function for each method.
