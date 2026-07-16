# GoNest Documentation Site

This repository contains the source code for the official [GoNest](https://github.com/gonest-dev/gonest) website and documentation, built with [Next.js](https://nextjs.org/) and [Fumadocs](https://github.com/fuma-nama/fumadocs).

## Running Locally

To run the development server locally, follow these steps:

1. Clone the repository
2. Install the dependencies:
   ```bash
   pnpm install
   ```
3. Start the development server:
   ```bash
   pnpm dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `content/docs/`: Contains all the documentation content in `.mdx` format.
- `src/app/(home)/`: The landing page and non-documentation routes.
- `src/app/docs/`: The documentation layout and pages powered by Fumadocs.
- `src/components/`: Reusable React components.
- `src/lib/`: Shared utilities, configurations, and Fumadocs source adapters.

## Writing Documentation

The documentation is written using MDX. You can find the source configuration in `source.config.ts`.
For details on the frontmatter schema and other configurations, refer to the [Fumadocs MDX documentation](https://fumadocs.dev/docs/mdx).

## Contributing

We welcome contributions! Whether it's fixing typos, adding new guides, ou improving the landing page, feel free to open a pull request.

## License

This project is licensed under the MIT License.
