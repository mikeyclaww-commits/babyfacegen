import { NextResponse } from "next/server";
import Replicate from "replicate";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const parent1 = formData.get("parent1") as File | null;
    const parent2 = formData.get("parent2") as File | null;

    if (!parent1 || !parent2) {
      return NextResponse.json(
        { error: "Please upload photos of both parents" },
        { status: 400 }
      );
    }

    // Convert files to base64 data URIs
    const p1Buffer = Buffer.from(await parent1.arrayBuffer());
    const p2Buffer = Buffer.from(await parent2.arrayBuffer());
    const p1Base64 = `data:${parent1.type};base64,${p1Buffer.toString("base64")}`;
    const p2Base64 = `data:${parent2.type};base64,${p2Buffer.toString("base64")}`;

    // Check if Replicate is configured
    if (!process.env.REPLICATE_API_TOKEN) {
      // Return demo/placeholder images for testing
      return NextResponse.json({
        images: [
          `https://api.dicebear.com/9.x/baby/svg?seed=${Date.now()}&backgroundColor=ffdfbf`,
          `https://api.dicebear.com/9.x/baby/svg?seed=${Date.now() + 1}&backgroundColor=ffd5dc`,
          `https://api.dicebear.com/9.x/baby/svg?seed=${Date.now() + 2}&backgroundColor=d5e8ff`,
          `https://api.dicebear.com/9.x/baby/svg?seed=${Date.now() + 3}&backgroundColor=e8d5ff`,
        ],
        demo: true,
        message: "These are placeholder images. Connect Replicate API for real AI generation.",
      });
    }

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    // Use a face-blending / baby generation model
    // We'll use SDXL with IP-Adapter for face merging
    const results: string[] = [];

    for (let i = 0; i < 4; i++) {
      const output = await replicate.run(
        "lucataco/ip-adapter-faceid-sdxl:07be7e14c008d9aebd7e20e33e39e34e0e4e2ee24a60daa3f8a61a6bc94b tried",
        {
          input: {
            prompt: `adorable baby face, cute infant, chubby cheeks, bright eyes, soft lighting, studio portrait, ${i === 0 ? "smiling" : i === 1 ? "curious expression" : i === 2 ? "sleeping peacefully" : "laughing"}, photorealistic, high quality`,
            negative_prompt: "ugly, deformed, blurry, low quality, adult",
            face_image: p1Base64,
            face_image_2: p2Base64,
            num_inference_steps: 30,
            guidance_scale: 7,
            seed: Date.now() + i,
          },
        }
      );

      if (Array.isArray(output) && output.length > 0) {
        results.push(output[0] as string);
      }
    }

    if (results.length === 0) {
      return NextResponse.json(
        { error: "Generation failed. Please try different photos." },
        { status: 500 }
      );
    }

    return NextResponse.json({ images: results });
  } catch (error: unknown) {
    console.error("Generation error:", error);
    const message =
      error instanceof Error ? error.message : "Generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
