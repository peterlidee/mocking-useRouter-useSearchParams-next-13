import Link from 'next/link';

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {children}
      <footer>
        <ul>
          <li>
            <Link href='/sortList'>/sortList</Link>
          </li>
          <li>
            <Link href='/sortList?sortOrder=asc'>/sortList?sortOrder=asc</Link>
          </li>
          <li>
            <Link href='/sortList?sortOrder=desc'>
              /sortList?sortOrder=desc
            </Link>
          </li>
        </ul>
      </footer>
    </div>
  );
}
