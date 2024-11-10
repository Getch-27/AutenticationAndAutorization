# Full Stack Project with Backend and Frontend Development and Deployment on Vercel using github workflow

This project is a full-stack application hosted in a single GitHub repository, containing two main folders:
1. **Backend** - Built with Node.js, deployed at: [Backend URL](https://autentication-server.vercel.app/)
2. **Frontend** - Built with React.js (Vite), deployed at: [Frontend URL](https://autentication-and-autorization.vercel.app/)

## Branches
- **master**: The production branch deployed to Vercel.
- **development**: The branch used for ongoing development and testing.

## GitHub Actions Workflow

The GitHub Actions workflow is configured to automate testing and deployment under the following conditions:

### Workflow Conditions

1. **Testing**:
   - On both **push** and **pull requests** to `master` and `development` branches, tests are run to ensure quality.
   - The backend and frontend each have dedicated test files, `test_backend` and `test_frontend`, to handle respective tests.

2. **Conditional Deployment**:
   - Only the changed part of the application is deployed to Vercel:
     - If changes are detected in the **Backend**, only the Backend will be deployed.
     - If changes are detected in the **Frontend**, only the Frontend will be deployed.
   - Tests are only executed on files that were changed. For example, if `index.js` in the Backend is modified, only the Backend tests will run.








  
