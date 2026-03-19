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

    if (!process.env.REPLICATE_API_TOKEN) {
      // Demo mode
      return NextResponse.json({
        images: [
          `https://api.dicebear.com/9.x/notionists-neutral/svg?seed=${Date.now()}&backgroundColor=ffdfbf`,
          `https://api.dicebear.com/9.x/notionists-neutral/svg?seed=${Date.now() + 1}&backgroundColor=ffd5dc`,
          `https://api.dicebear.com/9.x/notionists-neutral/svg?seed=${Date.now() + 2}&backgroundColor=d5e8ff`,
          `https://api.dicebear.com/9.x/notionists-neutral/svg?seed=${Date.now() + 3}&backgroundColor=e8d5ff`,
        ],
        demo: true,
      });
    }

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    const results: string[] = [];
    const expressions = [
      "smiling happily, bright eyes",
      "curious expression, looking at camera",
      "laughing joyfully, chubby cheeks",
      "peaceful sleeping face, serene",
    ];

    for (let i = 0; i < 4; i++) {
      try {
        // Use p-image-edit for face fusion
        const output = await replicate.run("prunaai/p-image-edit", {
          input: {
            prompt: `Generate a photorealistic adorable baby face that is a genetic blend of both parents shown in image 1 and image 2. The baby should have features from both parents blended naturally - eyes, nose shape, skin tone, and face structure. Cute ${expressions[i]}, soft studio lighting, professional baby portrait photography, ultra realistic, high quality. The baby appears to be about 6 months old.`,
            images: [p1Base64, p2Base64],
            aspect_ratio: "1:1",
            output_format: "webp",
            output_quality: 90,
          },
        });

        if (typeof output === "string") {
          results.push(output);
        } else if (Array.isArray(output) && output.length > 0) {
          results.push(output[0] as string);
        }
      } catch (genErr) {
        console.error(`Generation ${i} failed:`, genErr);
        // Continue trying other generations
      }
    }

    if (results.length === 0) {
      return NextResponse.json(
        { error: "Generation failed. Please try different, clearer photos with faces visible." },
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
