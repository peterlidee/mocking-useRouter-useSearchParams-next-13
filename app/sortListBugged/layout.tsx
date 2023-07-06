import Link from 'next/link';

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {children}
      <footer>
        <p>
          Because of Next and React bugs this component does not work properly.
          The radio input loses initial selected state. (
          <a href='https://github.com/vercel/next.js/issues/49499'>bug</a>). The
          onchange event on the radio inputs only gets called once. (
          <a href='https://github.com/facebook/react/issues/26876'>bug</a>).
        </p>
        <ul>
          <li>
            <Link href='/sortListBugged'>/sortListBugged</Link>
          </li>
          <li>
            <Link href='/sortListBugged?sortOrder=asc'>
              /sortListBugged?sortOrder=asc
            </Link>
          </li>
          <li>
            <Link href='/sortListBugged?sortOrder=desc'>
              /sortListBugged?sortOrder=desc
            </Link>
          </li>
        </ul>
      </footer>
    </div>
  );
}
