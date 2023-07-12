# Using searchParams, useSearchParams and useRouter in Next 13

A while back I wrote a fairly popular article on dev.to: [How to mock Next router with Jest ](https://dev.to/peterlidee/how-to-mock-next-router-with-jest-3p6b). Since then, `Next 13` has arrived and brought us a new router and new router hooks.

In this first part we will build a little project using all these new hooks. In the second and third parts we will learn how to test these new hooks and functions. All the files we use are available on [github](https://github.com/peterlidee/mocking-useRouter-useSearchParams-next-13).

## The plan

We are building a project where you can sort a list of fruits by clicking sort buttons.

[insert image sortList.png]

Clicking a button pushes a new route with a `sortOrder` parameter to the router: `/sortList?sortOrder=asc` or `/sortList?sortOrder=desc`. The list of fruits is sorted accordingly.

I used a fresh `create-next-app` (13.4.8) install with typescript and eslint. Cleaned out the boilerplate, added all `Jest` packages, added `eslint` packages for `Jest` and configured them.

Note: I originally tried building this with radio inputs but due to a bug in `Next 13`, it didn't work properly. I left the [files in the repo](https://github.com/peterlidee/mocking-useRouter-useSearchParams-next-13/tree/main/app/sortListBugged) in case you are interested.

## Get query strings

There are 2 ways to get access to url parameters:

1. `searchParams` page prop in the root of a route (the page file) returns an object with the parameters: f.e. `{ foo: 'bar' }`
2. The `useSearchParams` hook returns a readonly `URLSearchParams` interface.

> The URLSearchParams interface defines utility methods to work with the query string of a URL.
>
> source: [MDN](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams)

Among others, it allow you to get or set a parameter, to check if a parameter is present, to get the keys and values of all the parameters,... In short, it is a handy set of tools to read and update query strings.

## Project outline

There are 3 things we want to work with:

1. `searchParams` page prop
2. `useSearchParams` hook
3. `useRouter` hook

We will make a `<List />` component that is responsible for sorting our list of fruits and rendering it. To read the `sortOrder` parameter from the url, we use `searchParams` in the page root and pass it to `<List />`.

```tsx
function Page({ searchParams }) {
  return <List {...pass searchParams...} />;
}
```

Our second main component `<ListControlesButtons />` will hold our sort buttons. In this component we will use the `useSearchParams` hook to get access to the query string and also use `useRouter` to push new routes to the router.

```tsx
function Page({ searchParams }) {
  return (
    <>
      <ListControlesButtons />
      <List {...pass searchParams...} />
    </>
  );
}
```

## searchParams prop

What do we expect from `searchParams`? There are a couple of options:

| sortorder | route                        | searchParams            |
| --------- | ---------------------------- | ----------------------- |
| none      | `/sortList`                  | {}                      |
| valid     | `/sortList?sortOrder=asc`    | { sortOrder: 'asc' }    |
|           | `/sortList?sortOrder=desc`   | { sortOrder: 'desc' }   |
| invalid   | `/sortList?sortOrder=foobar` | { sortOrder: 'foobar' } |
|           | `/sortList?sortOrder`        | { sortOrder: '' }       |

This means we will have to validate `searchParams`. We create a type for represent `searchParams`:

```ts
// types/index.d.ts

export type SearchParams = {
  sortOrder?: string;
};
```

## page.js

Here is our full `Page` component:

```tsx
// app/sortList/page.tsx

import { SearchParams } from '@/types';
import getSortOrderFromSearchParams from '@/lib/getSortOrderFromSearchParams';
import ListControlesButtons from '@/components/ListControlesButtons';
import List from '@/components/List';

type Props = {
  searchParams: SearchParams;
};

export default function Page({ searchParams }: Props) {
  const sortOrder = getSortOrderFromSearchParams(searchParams);
  return (
    <>
      <ListControlesButtons />
      <List sortOrder={sortOrder} />
    </>
  );
}
```

## getSortOrderFromSearchParams.ts

`getSortOrderFromSearchParams` is the function that validates `searchParams`. It returns either `asc` or `desc`. It will return `asc` as the default value when:

- There is no `sortOrder` param.
- `sortOrder` value is empty.
- `sortOrder` value is invalid (not `asc` or `desc`).

When none of the above conditions were fulfilled, the value of sortOrder will be valid (`asc` or `desc`) and we can use it, else the default `asc` is passed. We also created a type for this:

```ts
// types/index.d.ts
...
export type SortOrder = 'asc' | 'desc';
```

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

## validateSortOrder.ts

The `validateSortOrder` is a type predicate. It checks if the value is either `asc` or `desc` and returns a boolean.

```tsx
// lib/validateSortOrder.ts

import { SortOrder } from '@/types';

export default function validateSortOrder(value: string): value is SortOrder {
  const validOptions: [SortOrder[0], SortOrder[1]] = ['asc', 'desc'];
  return validOptions.includes(value as SortOrder);
}
```

To recap: in `page.js` we validate `searchParams` and we then pass it to `<List sortOrder={sortOrder} />`. When `sortOrder` is passed, it is validated, meaning it will always be `asc` or `desc`.

## List.js

Our `<List />` component is simple. It just sorts a list of fruits along the `sortOrder` prop:

```tsx
// components/List.tsx

import { SortOrder } from '@/types';

type Props = {
  sortOrder: SortOrder;
};

export default function List({ sortOrder }: Props) {
  const list = ['Banana', 'Apple', 'Lemon', 'Cherry'];
  const sortedList = [...list].sort((a, b) => {
    if (sortOrder === 'asc') {
      return a > b ? 1 : -1;
    }
    return a < b ? 1 : -1;
  });
  return (
    <ul>
      {sortedList.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
```

## ListControlesButtons.tsx

This is our second main component. We factored away all the hooks inside a custom hook `useSort` that returns `sortOrder` (`asc` or `desc`) and an event handler `handleSort`.

```tsx
// components/ListControlesButtons.tsx

'use client';

import useSort from '@/hooks/useSort';

export default function ListControlesButtons() {
  const { sortOrder, handleSort } = useSort();
  return (
    <div>
      <div>sort order: {sortOrder === 'asc' ? 'ascending' : 'descending'}</div>
      <button onClick={() => handleSort('asc')}>sort ascending</button>
      <button onClick={() => handleSort('desc')}>sort descending</button>
    </div>
  );
}
```

## useSort.ts

`useSort` is a custom hook. It return 2 things:

- `sortOrder`: validated from `useSearchParams()` hook
- `handleSort`: an event handler that pushes routes to the router

```tsx
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

### sortOrder

In `useSort` we use the `useSearchParams` hook. As mentioned above, this returns a readonly `URLSearchParams` interface. Similar to what we did in `page.js`, we need to validate: check if there is a `sortOrder` parameter and that its value is valid.

But we can't reuse our `getSortOrderFromSearchParams` function because that only accepts objects and we now have a `URLSearchParams` interface. So, we wrote a new function `getSortOrderFromUseSearchParams`. It does the exact same checks but uses the `URLSearchParams` methods like `.has()` and `.get()`.

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

### handleSort()

Finally, our handleSort function is an event listener that gets called when clicking the sort buttons. What does this function need to do?

First, we have our query string that we got from `useSearchParams`. We want to append or overwrite to this string the following: `sortOrder=asc` or `sortOrder=desc`.

But, `useSearchParams` returns a readonly `URLSearchParams` interface. We can't change it. So we create a new `URLSearchParams` and pass into that the `URLSearchParams` we got from `useSearchParams`. Why do we pass in the old `URLSearchParams`? Because there may be other parameters and we don't want to discard them.

```ts
const newParams = new URLSearchParams(params.toString());
```

The `URLSearchParams` constructor accepts a string so we use the build-in `toString` method. If we were on route `/sortList?sortOrder=desc&foo=bar` then `params.toString()` would equal `sortOrder=desc&foo=bar`.

Our `newParams` variable now has access to these parameters:

- `newParams.get('sortOrder')` -> `desc`.
- `newParams.get('foo')` -> `bar`.

newParams is also **not** readonly. We can make changes. How? By using the `set()` method:

```ts
newParams.set('sortOrder', value);
```

`value` is the value that `handleSort` got called with inside our buttons: either 'asc' and 'desc'. We don't need to validate this because they are hardcoded inside our buttons.

The last step we need is to construct a route and push this route to router:

```
router.push(`${pathname}?${newParams.toString()}`);
```

We got `pathname` from the `usePathname` hook and it would be `localhost/sortList`. We then add the `?` and our updated query string (`newParams.toString()`) and push the route. And we are done. Our project is fully functioning.

## Recap

You may be thinking this was a lot of code for such a little project. But we were quite thorough:

- We used Typescript.
- We validated our query strings.
- We split our code into functions and custom hooks to facilitate testing. (see next part)
- We used both `searchParams` page prop and `useSearchParams` hook to access our query string.

In the end, the project is quite simple:

1. In our route root (page.js) we validate `searchParams` and pass `sortOrder` to `<List />`.
2. `<List />` sorts our fruits along this `sortOrder` parameter.
3. `<ListControlesButtons />` renders our buttons. It gets access to `sortOrder` and `handleSort` via a custom hook `useSort`.
4. The custom `useSort` hook:
   1. Gets the query string via `useSearchParams` hook. It validates this string using `getSortOrderFromUseSearchParams` and returns `sortOrder` (`asc` | `desc`).
   2. Creates an event handler for the buttons: `handleSort`. When called, this function creates a new `URLSearchParams` from the readonly one that `useSearchParams` returns. It adds (or overwrites) `sortOrder` with a new value. It then constructs a new route from `usePathname` and our new `URLSearchParams` and pushes that to the router.

In the [next parts](TODO) we are going to test all of these components and functions with `Jest` and `rtl`.
