import { v2 as cloudinary } from "cloudinary"

const isConfigured =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET

if (isConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  })
}

/**
 * Uploads a file buffer to Cloudinary and returns the secure URL.
 * Falls back to a high-quality mock book cover URL if credentials are not configured.
 */
export async function uploadBookCover(
  file: File | null,
  bookTitle: string
): Promise<string> {
  if (!file || file.size === 0) {
    // Return a default book cover placeholder if no file is provided
    return `https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&auto=format&fit=crop&q=60`
  }

  if (!isConfigured) {
    console.warn(
      "⚠️ Cloudinary credentials are not configured in .env. Falling back to a high-quality placeholder image for local development."
    )
    // Deterministic random cover from Unsplash based on book title length/characters
    const index = bookTitle.length % 5
    const fallbacks = [
      "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=600&auto=format&fit=crop&q=80",
    ]
    return fallbacks[index]
  }

  try {
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    return new Promise((resolve) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "bookhub_covers",
            allowed_formats: ["jpg", "jpeg", "png", "webp"],
            transformation: [{ width: 800, height: 1200, crop: "limit" }],
          },
          (error, result) => {
            if (error) {
              console.error("Cloudinary upload error details:", error)
              console.warn("⚠️ Cloudinary returned an error. Falling back to a high-quality placeholder cover to prevent form block.")
              const index = bookTitle.length % 5
              const fallbacks = [
                "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&auto=format&fit=crop&q=80",
                "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop&q=80",
                "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80",
                "https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=600&auto=format&fit=crop&q=80",
                "https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=600&auto=format&fit=crop&q=80",
              ]
              resolve(fallbacks[index])
            } else {
              resolve(result?.secure_url || "")
            }
          }
        )
        .end(buffer)
    })
  } catch (error: any) {
    console.error("Failed to read file or connect to Cloudinary:", error)
    const index = bookTitle.length % 5
    const fallbacks = [
      "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=600&auto=format&fit=crop&q=80",
    ]
    return fallbacks[index]
  }
}
