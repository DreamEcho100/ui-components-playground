# Specs _(not up to date)_

I'm are working on a project using Next.js, TRPC, Prisma, and Zod to build an endpoint.

**It will supports:**

- Bi-directional querying.
- Pagination:
  - It will be used by `useInfiniteQuery` on the client-side.
  - The cursor/offset will be generated based on the sorting field.
  - Will be using cursors like `createdAt` or `updatedAt` fields to generate the cursor if it's in the sorting fields.
  - Else it will use the offset.
- Sorting capabilities:
  - Allowing sorting with multiple fields if needed and if not then the input validation will require the array field to be a **max** of one item.
- Filtering capabilities:
  - Allowing filtering with multiple fields if needed.
  - The filtering can interrupt the cursor custom logic and the cursor will be generated based on the filtered data.
- The endpoint should be able to handle a large amount of data.
- The endpoint should be able to handle a large amount of users.

The endpoint will be used for a table that will display a list of users, and the user can sort and filter the data.
