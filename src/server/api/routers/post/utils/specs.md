# Specs

I'm are working on a project using Next.js, TRPC, Prisma, and Zod to build an endpoint.

**It will supports:**

- Bi-directional querying.
- Pagination:
  - It will be used by `useInfiniteQuery` on the client-side.
  - Infinite scrolling by using cursors.
  - There will be no offset-based pagination because it's not efficient for large datasets.
- Sorting capabilities:
  - Allowing sorting with multiple fields if needed and if not then the input validation will require the array field to be a **max** of one item.
- Filtering capabilities:
  - Allowing filtering with multiple fields if needed.
  - The filtering can interrupt the cursor custom logic and the cursor will be generated based on the filtered data.
- The endpoint should be able to handle a large amount of data.
- The endpoint should be able to handle a large amount of users.

The endpoint will be used for a table that will display a list of users, and the user can sort and filter the data.
