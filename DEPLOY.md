# Deploying NoPrazo App to Vercel

This project is ready to be deployed to Vercel.

## Deployment Steps

1.  **Push to GitHub**: Ensure your code is pushed to a GitHub repository.
2.  **Import to Vercel**:
    *   Go to [Vercel Dashboard](https://vercel.com/dashboard).
    *   Click "Add New..." -> "Project".
    *   Import your GitHub repository.
3.  **Configure Project**:
    *   **Framework Preset**: Select "Vite".
    *   **Root Directory**: `./` (default).
    *   **Build Command**: `npm run build` (default).
    *   **Output Directory**: `dist` (default).
4.  **Environment Variables**:
    *   You MUST add the following environment variables in the Vercel project settings:
        *   `VITE_SUPABASE_URL`: Your Supabase URL.
        *   `VITE_SUPABASE_ANON_KEY`: Your Supabase Anon Key.
        *   `GEMINI_API_KEY`: Your Google Gemini API Key.
5.  **Deploy**: Click "Deploy".

## Edge Functions
If you are using Supabase Edge Functions (like for email notifications), ensure you have deployed them to Supabase using:
`supabase functions deploy send-notification`
And ensure you have set the `RESEND_API_KEY` secret in Supabase.
