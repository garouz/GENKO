# GENKO Backend

## Development

### Installation

```bash
cd backend
npm install
```

### Environment Variables

Create `.env` file from `.env.example`:

```bash
cp .env.example .env
```

### Run Development Server

```bash
npm run dev
```

Server will run on `http://localhost:3000`

### Build

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

## API Endpoints

### Health Check

- `GET /health` - Server health check

### Manuscripts

- `GET /api/manuscripts` - Get all manuscripts
- `GET /api/manuscripts/:id` - Get manuscript by ID
- `POST /api/manuscripts` - Create new manuscript
- `PUT /api/manuscripts/:id` - Update manuscript
- `DELETE /api/manuscripts/:id` - Delete manuscript

### Dictionaries

- `GET /api/dictionaries` - Get all dictionaries
- `GET /api/dictionaries/:id` - Get dictionary by ID
- `POST /api/dictionaries` - Create new dictionary
- `GET /api/dictionaries/:id/search` - Search dictionary entries
- `DELETE /api/dictionaries/:id` - Delete dictionary

### Check (AI Proofreading)

- `POST /api/check/manuscript` - Run check on manuscript
- `GET /api/check/results/:manuscriptId` - Get check results
- `PUT /api/check/result/:resultId` - Update check result decision

### Files

- `POST /api/files/upload-manuscript` - Upload manuscript file
- `POST /api/files/export` - Export corrected manuscript

## Project Structure

```
backend/
├── src/
│   ├── index.ts              # Entry point
│   ├── middleware/
│   │   ├── errorHandler.ts   # Error handling middleware
│   │   ├── requestLogger.ts  # Request logging middleware
│   │   └── fileUpload.ts     # File upload configuration
│   ├── routes/
│   │   ├── manuscripts.ts    # Manuscript API routes
│   │   ├── dictionaries.ts   # Dictionary API routes
│   │   ├── check.ts          # Check/proofreading routes
│   │   └── files.ts          # File export routes
│   ├── services/
│   │   ├── ManuscriptService.ts  # Manuscript business logic
│   │   ├── DictionaryService.ts  # Dictionary business logic
│   │   ├── CheckService.ts       # Check result management
│   │   └── CorrectionEngine.ts   # Rule-based correction logic
│   └── types/
│       └── index.ts          # TypeScript type definitions
├── dist/                     # Compiled output
├── package.json
├── tsconfig.json
└── .env.example
```
