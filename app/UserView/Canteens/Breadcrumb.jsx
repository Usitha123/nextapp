"use client";

import { usePathname } from 'next/navigation';
import Link from 'next/link';

const Breadcrumb = () => {
  const fullPath = usePathname();
  const pathArray = fullPath.split('/').filter(Boolean); // Split path and remove empty parts

  // Get the last two segments (previous and current)
  const secondLastSegment = pathArray[pathArray.length - 2] || 'Home'; // Default to 'Home' if undefined
  const lastSegment = pathArray[pathArray.length - 1];

  return (
    <nav aria-label="breadcrumb" className="px-5 py-2 bg-gray-200 rounded">
      <ol className="flex space-x-2 text-sm">
        {/* Previous Segment */}
        {secondLastSegment && (
          <li className="flex items-center">
            <Link
              href={`/${pathArray.slice(0, pathArray.length - 1).join('/')}`}
              className="text-blue-500 hover:underline"
            >
              {decodeURIComponent(secondLastSegment.replace(/-/g, ' '))}
            </Link>
            <span className="mx-2 text-gray-500">/</span>
          </li>
        )}
        {/* Current Segment */}
        {lastSegment && (
          <li className="flex items-center">
            <span className="text-gray-600">
              {decodeURIComponent(lastSegment.replace(/-/g, ' '))}
            </span>
          </li>
        )}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
