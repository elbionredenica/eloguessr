# EloGuessr - Development Branch

This is the `dev` branch of the EloGuessr project. It's used for active development, testing new features, and making changes before merging them into the `main` (production) branch.

## Development Guidelines

*   **Branching:** Create new branches off `dev` for each feature or bug fix. Use the naming conventions outlined in the main README.
*   **Testing:** Thoroughly test your code before creating a pull request.
*   **Pull Requests:** Submit pull requests to merge changes from your feature branches into `dev`.
*   **Code Review:** All pull requests should be reviewed by at least one other developer before merging.
*   **Deployment to Staging (Optional):** You can set up a separate staging environment (e.g., a separate DigitalOcean droplet) to test deployments from the `dev` branch before deploying to production.

## Running the Application Locally

Refer to the "Local Development" section in the main `README.md` for instructions on setting up and running the application locally.

## Merging to Main

Once changes in the `dev` branch have been thoroughly tested and reviewed, they can be merged into the `main` branch for deployment to production.

**Note:** This README is specific to the `dev` branch. The main `README.md` in the `main` branch should contain the official documentation for the project, including production deployment instructions.