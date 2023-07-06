import Link from 'next/link';

export default function Home() {
  return (
    <>
      <ul>
        <li>
          <Link href='/sortList'>sortList with buttons</Link>
        </li>
        <li>
          <Link href='/sortListBugged'>bugged sortList with radio inputs</Link>
        </li>
      </ul>
    </>
  );
}
