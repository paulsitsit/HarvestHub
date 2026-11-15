# HarvestHub frontend

## Run locally

Start the backend first. From the project root, configure its environment and
start it:

```powershell
cd .\harvesthub-backend
npm ci
Copy-Item .env.example .env
# Set MONGO_URI and JWT_SECRET in .env before starting.
npm run dev
```

In another terminal, install the frontend dependencies and start Vite:

```powershell
cd .\harvesthub-frontend
npm ci
# Optional for testing against your local backend:
Copy-Item .env.example .env
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser. Without a
local `.env`, the frontend uses the deployed API for previewing the site. Copy
`.env.example` to `.env` to send requests to `http://localhost:5000/api` and
test the local backend. Backend features, including saving products and
inquiries, require a working MongoDB connection.

Products appear in the marketplace after both the product and its farmer have
been approved by an administrator. Listing payments are optional and do not
control marketplace visibility.

## Check the frontend

Run ESLint from `harvesthub-frontend` to see each issue's file and line in the
terminal:

```powershell
npm run lint
```

Create a production build with:

```powershell
npm run build
```
