"use client";

import { useState, useRef, useCallback } from "react";
import {
  Baby, Upload, Sparkles, Heart, Camera, Star, Shield, Zap,
  ArrowRight, Check, Loader2, X, ImagePlus,
} from "lucide-react";

export default function Home() {
  const [parent1, setParent1] = useState<string | null>(null);
  const [parent2, setParent2] = useState<string | null>(null);
  const [parent1File, setParent1File] = useState<File | null>(null);
  const [parent2File, setParent2File] = useState<File | null>(null);
  const [generating, setGenerating] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [selectedResult, setSelectedResult] = useState<string | null>(null);

  const ref1 = useRef<HTMLInputElement>(null);
  const ref2 = useRef<HTMLInputElement>(null);

  const handleImageUpload = useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement>,
      setPreview: (v: string | null) => void,
      setFile: (v: File | null) => void
    ) => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (file.size > 10 * 1024 * 1024) {
        setError("Image must be under 10MB");
        return;
      }
      setFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => setPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
      setError("");
    },
    []
  );

  const handleGenerate = async () => {
    if (!parent1File || !parent2File) {
      setError("Please upload photos of both parents");
      return;
    }

    setGenerating(true);
    setError("");
    setResults([]);

    try {
      const formData = new FormData();
      formData.append("parent1", parent1File);
      formData.append("parent2", parent2File);

      const res = await fetch("/api/generate", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else {
        setResults(data.images);
      }
    } catch {
      setError("Generation failed. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const PhotoUpload = ({
    label,
    preview,
    inputRef,
    onUpload,
    onClear,
  }: {
    label: string;
    preview: string | null;
    inputRef: React.RefObject<HTMLInputElement | null>;
    onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onClear: () => void;
  }) => (
    <div className="flex flex-col items-center gap-3">
      <p className="text-sm font-semibold text-slate-700">{label}</p>
      <div
        onClick={() => inputRef.current?.click()}
        className="relative w-44 h-44 md:w-52 md:h-52 rounded-2xl border-2 border-dashed border-pink-300 bg-pink-50/50 flex items-center justify-center cursor-pointer hover:border-pink-400 hover:bg-pink-50 transition overflow-hidden group"
      >
        {preview ? (
          <>
            <img
              src={preview}
              alt={label}
              className="w-full h-full object-cover"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClear();
              }}
              className="absolute top-2 right-2 w-7 h-7 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition"
            >
              <X className="h-4 w-4" />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 text-pink-400">
            <ImagePlus className="h-10 w-10" />
            <span className="text-xs font-medium">Upload Photo</span>
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={onUpload}
        className="hidden"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-purple-50">
      {/* Nav */}
      <nav className="border-b border-pink-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Baby className="h-7 w-7 text-pink-500" />
            <span className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              BabyFaceGen
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#pricing" className="text-slate-600 hover:text-slate-900 text-sm font-medium hidden sm:block">
              Pricing
            </a>
            <a href="#how-it-works" className="text-slate-600 hover:text-slate-900 text-sm font-medium hidden sm:block">
              How it works
            </a>
            <a
              href="#generator"
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:shadow-lg hover:shadow-pink-200 transition"
            >
              Try Free
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-16 pb-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-pink-100 text-pink-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            #1 AI Baby Face Predictor
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 leading-tight mb-6">
            See what your
            <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              {" "}future baby{" "}
            </span>
            will look like
          </h1>
          <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Upload photos of both parents and our AI creates realistic predictions
            of your baby&apos;s face. Fun, instant, and surprisingly accurate.
          </p>

          {/* Social proof */}
          <div className="flex flex-wrap items-center justify-center gap-6 mb-12 text-sm text-slate-500">
            <div className="flex items-center gap-1">
              <div className="flex -space-x-2">
                {["😊", "🥰", "😍", "🤩"].map((e, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-lg border-2 border-white">
                    {e}
                  </div>
                ))}
              </div>
              <span className="ml-2 font-medium">10,000+ babies generated</span>
            </div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
              ))}
              <span className="ml-1 font-medium">4.9/5 rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* Generator */}
      <section className="pb-20 px-4" id="generator">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl shadow-pink-100/50 border border-pink-100 p-6 md:p-10">
            <h2 className="text-2xl font-bold text-slate-900 text-center mb-2">
              Upload Parent Photos
            </h2>
            <p className="text-slate-500 text-center mb-8 text-sm">
              Clear, front-facing photos work best. One photo per parent.
            </p>

            {/* Upload Area */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 mb-8">
              <PhotoUpload
                label="Parent 1"
                preview={parent1}
                inputRef={ref1}
                onUpload={(e) => handleImageUpload(e, setParent1, setParent1File)}
                onClear={() => { setParent1(null); setParent1File(null); }}
              />

              <div className="flex items-center justify-center">
                <Heart className="h-8 w-8 text-pink-400 animate-pulse" />
              </div>

              <PhotoUpload
                label="Parent 2"
                preview={parent2}
                inputRef={ref2}
                onUpload={(e) => handleImageUpload(e, setParent2, setParent2File)}
                onClear={() => { setParent2(null); setParent2File(null); }}
              />
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm text-center mb-6">
                {error}
              </div>
            )}

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={generating || !parent1File || !parent2File}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-4 rounded-2xl font-bold text-lg hover:shadow-xl hover:shadow-pink-200 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {generating ? (
                <>
                  <Loader2 className="h-6 w-6 animate-spin" />
                  Generating your baby... (30-60 seconds)
                </>
              ) : (
                <>
                  <Sparkles className="h-6 w-6" />
                  Generate Baby Face — Free Preview
                </>
              )}
            </button>

            <p className="text-center text-slate-400 text-xs mt-3">
              Your photos are processed securely and deleted after generation
            </p>
          </div>

          {/* Results */}
          {results.length > 0 && (
            <div className="mt-10 bg-white rounded-3xl shadow-xl shadow-purple-100/50 border border-purple-100 p-6 md:p-10">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-1">
                  Meet Your Future Baby! 👶
                </h2>
                <p className="text-slate-500 text-sm">
                  Here&apos;s what AI thinks your baby could look like
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                {results.map((img, i) => (
                  <div
                    key={i}
                    onClick={() => setSelectedResult(img)}
                    className="relative rounded-2xl overflow-hidden cursor-pointer hover:ring-4 hover:ring-pink-300 transition group"
                  >
                    <img
                      src={img}
                      alt={`Baby prediction ${i + 1}`}
                      className="w-full aspect-square object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition flex items-end justify-center pb-4">
                      <span className="text-white text-sm font-medium">
                        Click to enlarge
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleGenerate}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition flex items-center justify-center gap-2"
                >
                  <Sparkles className="h-5 w-5" />
                  Generate More Variations
                </button>
                <a
                  href={results[0]}
                  download="baby-prediction.png"
                  className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-xl font-semibold hover:bg-slate-200 transition flex items-center justify-center gap-2"
                >
                  <Camera className="h-5 w-5" />
                  Download HD Photos
                </a>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {selectedResult && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedResult(null)}
        >
          <div className="relative max-w-lg w-full">
            <img
              src={selectedResult}
              alt="Baby prediction"
              className="w-full rounded-2xl"
            />
            <button
              onClick={() => setSelectedResult(null)}
              className="absolute top-3 right-3 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* How it works */}
      <section className="py-20 px-4 bg-white" id="how-it-works">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-12">
            How it works
          </h2>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                icon: <Upload className="h-8 w-8" />,
                title: "Upload Photos",
                desc: "Upload one clear, front-facing photo of each parent",
                color: "bg-pink-100 text-pink-600",
              },
              {
                icon: <Sparkles className="h-8 w-8" />,
                title: "AI Generates",
                desc: "Our AI analyzes both faces and predicts baby features",
                color: "bg-purple-100 text-purple-600",
              },
              {
                icon: <Heart className="h-8 w-8" />,
                title: "See Your Baby",
                desc: "Get multiple realistic baby face predictions instantly",
                color: "bg-rose-100 text-rose-600",
              },
            ].map((step) => (
              <div key={step.title} className="flex flex-col items-center">
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${step.color}`}
                >
                  {step.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-slate-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
            Why people love BabyFaceGen
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: <Zap className="h-5 w-5" />,
                title: "Instant Results",
                desc: "Get baby predictions in under 60 seconds. No waiting.",
              },
              {
                icon: <Shield className="h-5 w-5" />,
                title: "Privacy First",
                desc: "Photos are processed and immediately deleted. We never store your images.",
              },
              {
                icon: <Camera className="h-5 w-5" />,
                title: "HD Quality",
                desc: "High-resolution baby images you can save, print, or share.",
              },
              {
                icon: <Star className="h-5 w-5" />,
                title: "Multiple Variations",
                desc: "Get 4 different predictions showing various possible features.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="bg-white rounded-xl border border-slate-200 p-6 flex gap-4"
              >
                <div className="w-10 h-10 bg-pink-100 text-pink-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 text-sm">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4 bg-white" id="pricing">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Simple pricing
          </h2>
          <p className="text-slate-600 text-lg mb-12">
            Try free. Pay only for HD downloads.
          </p>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* Free */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-8 text-left">
              <h3 className="text-lg font-bold text-slate-900 mb-1">Free</h3>
              <div className="text-3xl font-bold text-slate-900 mb-6">
                $0
              </div>
              <ul className="space-y-3 mb-8">
                {["1 baby prediction", "Watermarked preview", "Standard quality"].map(
                  (item) => (
                    <li key={item} className="flex items-center gap-2 text-slate-700 text-sm">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      {item}
                    </li>
                  )
                )}
              </ul>
              <a
                href="#generator"
                className="block text-center bg-slate-200 text-slate-700 px-6 py-3 rounded-xl font-semibold hover:bg-slate-300 transition"
              >
                Try Free
              </a>
            </div>

            {/* Popular */}
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl border-2 border-pink-300 p-8 text-left relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                BEST VALUE
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                Baby Pack
              </h3>
              <div className="text-3xl font-bold text-slate-900 mb-1">
                $9.99
              </div>
              <p className="text-slate-500 text-sm mb-6">one-time payment</p>
              <ul className="space-y-3 mb-8">
                {[
                  "20 baby predictions",
                  "HD quality downloads",
                  "No watermarks",
                  "Multiple variations",
                  "Different ages (baby → toddler)",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-slate-700 text-sm">
                    <Check className="h-4 w-4 text-pink-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <button className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-pink-200 transition flex items-center justify-center gap-2">
                Get Baby Pack
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {/* Premium */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-8 text-left">
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                Premium
              </h3>
              <div className="text-3xl font-bold text-slate-900 mb-1">
                $19.99
              </div>
              <p className="text-slate-500 text-sm mb-6">one-time payment</p>
              <ul className="space-y-3 mb-8">
                {[
                  "50 baby predictions",
                  "Ultra HD downloads",
                  "All Baby Pack features",
                  "Baby with different ethnicities",
                  "Aging simulation (1-5 years)",
                  "Priority generation",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-slate-700 text-sm">
                    <Check className="h-4 w-4 text-purple-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <button className="w-full bg-slate-800 text-white px-6 py-3 rounded-xl font-semibold hover:bg-slate-900 transition">
                Get Premium
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "How accurate are the predictions?",
                a: "Our AI analyzes facial features from both parents to create realistic predictions. While no AI can predict a real baby's exact appearance, our results capture likely combinations of features like eyes, nose, skin tone, and face shape.",
              },
              {
                q: "Are my photos safe?",
                a: "Absolutely. Photos are encrypted during upload, used only for generation, and permanently deleted immediately after. We never store, share, or sell your images.",
              },
              {
                q: "How long does generation take?",
                a: "Usually 30-60 seconds per generation. You'll see results appear on screen as soon as they're ready.",
              },
              {
                q: "Can I use photos of friends or celebrities?",
                a: "Yes! Many people use it for fun with friends. Please only use photos with the person's consent.",
              },
              {
                q: "Do you offer refunds?",
                a: "Yes, we offer a full refund within 24 hours of purchase if you're not satisfied with the results.",
              },
            ].map((item) => (
              <div key={item.q} className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="font-bold text-slate-900 mb-2">{item.q}</h3>
                <p className="text-slate-600 text-sm">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-pink-500 to-purple-500">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to meet your future baby?
          </h2>
          <p className="text-pink-100 text-lg mb-8">
            Upload two photos and see the magic in under 60 seconds.
          </p>
          <a
            href="#generator"
            className="inline-flex items-center gap-2 bg-white text-pink-600 px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl transition"
          >
            Try It Free
            <ArrowRight className="h-5 w-5" />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Baby className="h-5 w-5 text-pink-400" />
            <span className="text-white font-bold">BabyFaceGen</span>
          </div>
          <p className="text-sm">
            © {new Date().getFullYear()} BabyFaceGen. For entertainment purposes.
          </p>
          <div className="flex gap-4 text-sm">
            <a href="#" className="hover:text-white transition">Privacy</a>
            <a href="#" className="hover:text-white transition">Terms</a>
            <a href="#" className="hover:text-white transition">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
