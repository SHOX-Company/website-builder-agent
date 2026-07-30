import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";

// Client-direct uploads: the browser uploads straight to Blob storage using a
// short-lived token minted here, rather than streaming the file through this
// serverless function (which would hit Vercel's ~4.5MB request body limit and
// give no real progress events). This route only ever issues tokens — it
// never sees file bytes. It sits behind middleware, which already rejects
// unauthenticated requests to any /api/studio/* path before this handler runs.
export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: [
          "image/jpeg",
          "image/png",
          "image/webp",
          "image/gif",
          "video/mp4",
          "video/quicktime",
          "video/webm",
        ],
        addRandomSuffix: true,
        maximumSizeInBytes: 200 * 1024 * 1024,
      }),
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
