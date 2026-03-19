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
    const p1Uri = `data:${parent1.type};base64,${p1Buffer.toString("base64")}`;
    const p2Uri = `data:${parent2.type};base64,${p2Buffer.toString("base64")}`;

    if (!process.env.REPLICATE_API_TOKEN) {
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
    const variations = [
      "smiling happily with bright sparkling eyes, chubby rosy cheeks",
      "looking curiously at camera with wide innocent eyes",
      "laughing joyfully showing a big gummy smile",
      "peaceful and content with a soft gentle expression",
    ];

    for (let i = 0; i < 4; i++) {
      try {
        // Use FLUX 2 Flex which supports multiple input images
        const output = await replicate.run("black-forest-labs/flux-2-flex", {
          input: {
            prompt: `Photorealistic studio portrait of an adorable 6-month-old baby, ${variations[i]}. The baby's features are a natural genetic blend combining traits from both reference parent photos provided. Realistic skin texture, soft diffused studio lighting, shallow depth of field, professional baby photography, ultra high quality, 8k detail.`,
            input_images: [p1Uri, p2Uri],
            aspect_ratio: "1:1",
            output_format: "webp",
            output_quality: 90,
            seed: Date.now() + i * 1000,
          },
        });

        if (typeof output === "string") {
          results.push(output);
        } else if (
          output &&
          typeof output === "object" &&
          "url" in (output as Record<string, unknown>)
        ) {
          results.push((output as Record<string, string>).url);
        }
      } catch (genErr) {
        console.error(`Generation ${i} failed:`, genErr);
      }
    }

    if (results.length === 0) {
      return NextResponse.json(
        {
          error:
            "Generation failed. This can happen due to API rate limits. Please wait a moment and try again, or try with different photos.",
        },
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
