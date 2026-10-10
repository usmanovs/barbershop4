import React, { useState, useRef } from "react";
import { 
  Sparkles, Camera, Layers, RotateCcw, Check, ShoppingBag, 
  Download, HelpCircle, AlertCircle, RefreshCw, ChevronRight, Play,
  Upload, X, User
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface HaircutVisualizerProps {
  selectedServiceIds: string[];
  onToggleService: (id: string) => void;
}

interface BaseModel {
  id: string;
  name: string;
  avatar: string;
  ethnicity: string;
}

interface HaircutStyle {
  id: string;
  name: string;
  serviceId: string;
  price: number;
  duration: number;
  description: string;
}

const BASE_MODELS: BaseModel[] = [
  { id: "lucas", name: "Lucas", ethnicity: "Classic / Fine Hair", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80" },
  { id: "marcus", name: "Marcus", ethnicity: "Coiled / Textured Curls", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&h=150&q=80" },
  { id: "elena", name: "Elena", ethnicity: "Modern / Pixie short cut", avatar: "https://images.unsplash.com/photo-1594744803329-e58b31de215f?auto=format&fit=crop&w=150&h=150&q=80" },
  { id: "julian", name: "Julian", ethnicity: "Thick Waves / Styled Beard", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&h=150&q=80" },
];

const HAIRCUT_STYLES: HaircutStyle[] = [
  { 
    id: "fade", 
    name: "Precision High Skin Fade", 
    serviceId: "h3", 
    price: 50, 
    duration: 45,
    description: "Crisp, transparent blend down to skin-level with sharp razor-line borders." 
  },
  { 
    id: "part", 
    name: "Classic Refined Part / Taper", 
    serviceId: "h1", 
    price: 45, 
    duration: 30,
    description: "Traditional corporate dapper gentleman parting with subtle scissors taper and weight removal." 
  },
  { 
    id: "crop", 
    name: "Modern Textured Fringe Crop", 
    serviceId: "h2", 
    price: 65, 
    duration: 45,
    description: "Volumized texture crop on top, tight athletic clippers fade on side, texturizing styling boost." 
  },
  { 
    id: "buzz", 
    name: "Minimalist Neat Buzz Cut", 
    serviceId: "h4", 
    price: 30, 
    duration: 20,
    description: "Symmetrical single-guard uniform precision buzz with a warm luxury lather neck shave finish." 
  },
];

const COLOR_OPTIONS = [
  { id: "natural", name: "Natural Tone", value: "natural brown/black/coppertone", previewClass: "bg-slate-800 border-slate-700" },
  { id: "platinum", name: "Platinum Silver", value: "nordic platinum white silver", previewClass: "bg-[#e2e8f0] border-slate-400" },
  { id: "blonde", name: "Honey Blonde", value: "golden amber honey blonde", previewClass: "bg-[#e9d5ff] border-[#c084fc]" },
  { id: "teal", name: "Emerald Mint Highlight", value: "subtle deep emerald mint green highlights", previewClass: "bg-emerald-600 border-emerald-500" },
  { id: "copper", name: "Rustic Copper Glow", value: "burnished copper bronze sunset streaks", previewClass: "bg-amber-700 border-amber-600" },
];

const ADDON_OPTIONS = [
  { id: "none", name: "Pure Hair Contour", promptText: "clean razor-refined natural margins" },
  { id: "slash", name: "Single Surgical Slash", promptText: "one bold sharp straight-razor cutline slash on left temple" },
  { id: "dual", name: "Dual Symmetrical Accents", promptText: "two sleek parallel speed lines etched on side fade" },
  { id: "beard", name: "Sculpted Facial Outline", promptText: "crisp connected straight-razor beard-align line and mustache sculpt" },
];

// Offline stock image lookup dictionary to guarantee stunning views instantly
const FALLBACK_STOCK_IMAGES: Record<string, Record<string, string>> = {
  lucas: {
    fade: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=600&q=80",
    part: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80",
    crop: "https://images.unsplash.com/photo-1605497746444-052d5b6bc34c?auto=format&fit=crop&w=600&q=80",
    buzz: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=600&q=80",
  },
  marcus: {
    fade: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80",
    part: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
    crop: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80",
    buzz: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80",
  },
  elena: {
    fade: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=600&q=80",
    part: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80",
    crop: "https://images.unsplash.com/photo-1594744803329-e58b31de215f?auto=format&fit=crop&w=600&q=80",
    buzz: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=600&q=80",
  },
  julian: {
    fade: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80",
    part: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=600&q=80",
    crop: "https://images.unsplash.com/photo-1618015358954-115ef1ed6515?auto=format&fit=crop&w=600&q=80",
    buzz: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80",
  },
};

export default function HaircutVisualizer({ selectedServiceIds, onToggleService }: HaircutVisualizerProps) {
  const [selectedModel, setSelectedModel] = useState<string>("lucas");
  const [selectedStyle, setSelectedStyle] = useState<string>("fade");
  const [selectedColor, setSelectedColor] = useState<string>("natural");
  const [selectedAddon, setSelectedAddon] = useState<string>("none");
  const [customPrompt, setCustomPrompt] = useState<string>("");
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);

  // Client Upload states
  const [photoSource, setPhotoSource] = useState<"preset" | "upload">("preset");
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generation status state
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [statusLog, setStatusLog] = useState<string>("Ready to map features");
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isGeneratedMock, setIsGeneratedMock] = useState<boolean>(false);
  const [generationInfo, setGenerationInfo] = useState<string | null>(null);

  const activeModelObj = BASE_MODELS.find(m => m.id === selectedModel) || BASE_MODELS[0];
  const activeStyleObj = HAIRCUT_STYLES.find(s => s.id === selectedStyle) || HAIRCUT_STYLES[0];
  const activeColorObj = COLOR_OPTIONS.find(c => c.id === selectedColor) || COLOR_OPTIONS[0];
  const activeAddonObj = ADDON_OPTIONS.find(a => a.id === selectedAddon) || ADDON_OPTIONS[0];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setUploadedPhoto(event.target.result as string);
        setPhotoSource("upload");
        if (generatedImageUrl) setGeneratedImageUrl(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleRunSimulation = async () => {
    setIsGenerating(true);
    setGeneratedImageUrl(null);

    // Timed simulated narrative steps matching the high-fashion classy feel
    const logs = [
      "Securing face coordinate parameters...",
      "Mapping hair lock density & growth direction...",
      "Connecting with Astell's neural imagery network...",
      "Applying soft volumetric highlight filters...",
      "Polishing texture contours..."
    ];

    let count = 0;
    const interval = setInterval(() => {
      if (count < logs.length) {
        setStatusLog(logs[count]);
        count++;
      } else {
        clearInterval(interval);
      }
    }, 900);

    try {
      const response = await fetch("/api/visualize-haircut", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          faceTemplate: photoSource === "preset" ? activeModelObj.name : "Custom Client Photo",
          styleName: isCustomMode ? "custom style" : activeStyleObj.name,
          color: activeColorObj.name,
          addon: activeAddonObj.name,
          customPrompt: isCustomMode ? customPrompt : "",
          clientPhoto: photoSource === "upload" ? uploadedPhoto : null
        }),
      });

      const data = await response.json();
      clearInterval(interval);

      if (data.isMock) {
        if (photoSource === "upload" && uploadedPhoto) {
          // Display the uploaded client image with futuristic live styling metadata HUD overlay
          setGeneratedImageUrl(uploadedPhoto);
          setIsGeneratedMock(true);
          setGenerationInfo("Mock visualization Mode: Styling coordinates projected directly over client's loaded portrait.");
        } else {
          // Retrieve the perfect mock image according to selections
          const baseLookup = FALLBACK_STOCK_IMAGES[selectedModel] || FALLBACK_STOCK_IMAGES.lucas;
          const styleLookupKey = isCustomMode ? "crop" : selectedStyle;
          const mockImgUrl = baseLookup[styleLookupKey] || baseLookup.fade;

          setGeneratedImageUrl(mockImgUrl);
          setIsGeneratedMock(true);
          setGenerationInfo(data.message || "Synthesizing customized pre-rendered high-fidelity styling projection.");
        }
      } else {
        setGeneratedImageUrl(data.imageUrl);
        setIsGeneratedMock(false);
        setGenerationInfo(`Generated live in standard luxury definition by ${data.usedModel || "Gemini AI"}.`);
      }
    } catch (err) {
      console.error(err);
      clearInterval(interval);
      // Failover safely
      if (photoSource === "upload" && uploadedPhoto) {
        setGeneratedImageUrl(uploadedPhoto);
        setIsGeneratedMock(true);
        setGenerationInfo("Simulation fallback: Displaying styling annotations on uploaded portrait.");
      } else {
        const baseLookup = FALLBACK_STOCK_IMAGES[selectedModel] || FALLBACK_STOCK_IMAGES.lucas;
        const mockImgUrl = baseLookup[isCustomMode ? "crop" : selectedStyle] || baseLookup.fade;
        setGeneratedImageUrl(mockImgUrl);
        setIsGeneratedMock(true);
        setGenerationInfo("Network simulation fallback. Showing high-fidelity styled model.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setGeneratedImageUrl(null);
    setIsGeneratedMock(false);
    setGenerationInfo(null);
    setCustomPrompt("");
    setSelectedStyle("fade");
    setSelectedColor("natural");
    setSelectedAddon("none");
    setIsCustomMode(false);
    setUploadedPhoto(null);
    setPhotoSource("preset");
    setDragActive(false);
  };

  const isServiceAdded = selectedServiceIds.includes(activeStyleObj.serviceId);

  return (
    <div id="ai-haircut-visualizer-container" className="bg-[#121316]/60 border border-slate-800/80 rounded-3xl p-6 sm:p-8 space-y-8 relative overflow-hidden backdrop-blur-md">
      
      {/* Decorative luxury gold accents */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/5 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-8 -left-8 w-44 h-44 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Title & Introduction */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] bg-gold-400/10 text-gold-400 border border-gold-500/20 px-2.5 py-1 rounded-full font-bold uppercase tracking-widest inline-flex items-center gap-1.5 mb-2 leading-none">
            <Sparkles className="w-3 h-3 text-gold-400" /> Astell AI Studio
          </span>
          <h3 className="font-serif font-semibold text-2xl md:text-3xl text-slate-100">
            Haircut AI Lens
          </h3>
          <p className="text-slate-400 text-xs mt-1 max-w-xl">
            Simulate our luxury haircuts on different model shapes or input custom details. Experience your future refinement before sitting in our leather lounge chair.
          </p>
        </div>
        <button
          id="btn-haircut-reset"
          onClick={handleReset}
          className="text-slate-500 hover:text-gold-400 text-[10px] font-bold uppercase tracking-wider bg-slate-950/40 p-2 border border-slate-800/60 rounded-xl transition-all cursor-pointer flex items-center gap-1 w-fit"
        >
          <RotateCcw className="w-3 h-3" /> Reset Options
        </button>
      </div>

      {/* Main Visualizer interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left column: Parameters control (Grid span 7) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Step 1: Base Face Selection */}
          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-widest text-[#a1a1aa] flex items-center justify-between gap-1.5">
              <span className="flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-gold-400" /> 1. Select Portrait source
              </span>
              <span className="text-[9px] text-slate-500 lowercase">Presets or client uploads</span>
            </label>

            {/* Toggle between model templates and client photo uploads */}
            <div className="flex gap-1.5 bg-slate-950/50 border border-slate-900 rounded-xl p-1">
              <button 
                id="btn-face-mode-presets"
                type="button"
                onClick={() => {
                  setPhotoSource("preset");
                  if (generatedImageUrl) setGeneratedImageUrl(null);
                }}
                className={`flex-1 py-2 px-3 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  photoSource === "preset"
                    ? "bg-[#1d1f24] text-gold-400 border border-slate-800 shadow-sm"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                <User className="w-3.5 h-3.5" /> Preset Models
              </button>
              <button 
                id="btn-face-mode-upload"
                type="button"
                onClick={() => {
                  setPhotoSource("upload");
                  if (generatedImageUrl) setGeneratedImageUrl(null);
                }}
                className={`flex-1 py-2 px-3 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  photoSource === "upload"
                    ? "bg-[#1d1f24] text-gold-400 border border-slate-800 shadow-sm"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                <Upload className="w-3.5 h-3.5" /> Upload Client Photo
              </button>
            </div>

            <AnimatePresence mode="wait">
              {photoSource === "preset" ? (
                <motion.div
                  key="preset-models-pane"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1"
                >
                  {BASE_MODELS.map((model) => {
                    const isActive = selectedModel === model.id;
                    return (
                      <button
                        id={`btn-model-${model.id}`}
                        key={model.id}
                        onClick={() => {
                          setSelectedModel(model.id);
                          if (generatedImageUrl) setGeneratedImageUrl(null);
                        }}
                        className={`p-2.5 rounded-2xl border text-left transition-all relative flex flex-col justify-between items-center text-center cursor-pointer ${
                          isActive 
                            ? "border-gold-500 bg-gold-500/[0.04] text-gold-300 shadow-md"
                            : "border-slate-800 bg-slate-950/30 text-slate-400 hover:border-slate-700 hover:text-slate-300"
                        }`}
                      >
                        <div className="relative w-12 h-12 rounded-full overflow-hidden border border-slate-800 mb-2">
                          <img 
                            src={model.avatar} 
                            alt={model.name} 
                            className="w-full h-full object-cover" 
                            referrerPolicy="no-referrer"
                          />
                          {isActive && (
                            <div className="absolute inset-0 bg-gold-500/20 flex items-center justify-center">
                              <Check className="w-4 h-4 text-gold-400" />
                            </div>
                          )}
                        </div>
                        <div>
                          <h5 className="font-display font-semibold text-xs leading-none">{model.name}</h5>
                          <span className="text-[9px] text-slate-500 block mt-1 leading-tight font-light">{model.ethnicity}</span>
                        </div>
                      </button>
                    );
                  })}
                </motion.div>
              ) : (
                <motion.div
                  key="client-upload-pane"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-3 pt-1"
                >
                  <input 
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  {!uploadedPhoto ? (
                    <div
                      onDragEnter={handleDrag}
                      onDragOver={handleDrag}
                      onDragLeave={handleDrag}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all ${
                        dragActive 
                          ? "border-gold-500 bg-gold-500/[0.04]" 
                          : "border-slate-800 bg-slate-950/20 hover:border-slate-700 hover:bg-slate-900/10"
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mb-3">
                        <Upload className={`w-5 h-5 ${dragActive ? "text-gold-400 animate-pulse" : "text-slate-500"}`} />
                      </div>
                      <p className="text-xs font-medium text-slate-300 text-center">
                        Drag & drop client portrait, or <span className="text-gold-400 hover:underline">browse files</span>
                      </p>
                      <p className="text-[10px] text-slate-500 mt-1 text-center">
                        Supports High-Definition JPEG, PNG or WEBP (under 10MB)
                      </p>
                    </div>
                  ) : (
                    <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-slate-800/80 shadow-md">
                          <img 
                            src={uploadedPhoto} 
                            alt="Client upload thumbnail" 
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div>
                          <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono tracking-wider uppercase inline-block mb-1">
                            Linked Active Face
                          </span>
                          <p className="text-xs text-slate-300 font-medium truncate max-w-[140px] sm:max-w-[200px]">
                            Loaded_Client_Image.jpg
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setUploadedPhoto(null);
                          if (generatedImageUrl) setGeneratedImageUrl(null);
                        }}
                        className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-rose-400 border border-slate-800 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider"
                      >
                        <X className="w-3.5 h-3.5" /> Remove
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Selector Tabs: Preset vs Custom Prompt */}
          <div className="flex gap-2 border-b border-slate-900 pb-2">
            <button
              id="tab-visual-presets"
              onClick={() => setIsCustomMode(false)}
              className={`pb-1 px-2 text-[10px] font-bold uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
                !isCustomMode 
                  ? "border-gold-500 text-gold-400" 
                  : "border-transparent text-slate-500 hover:text-slate-300"
              }`}
            >
              Signature Presets
            </button>
            <button
              id="tab-visual-custom"
              onClick={() => setIsCustomMode(true)}
              className={`pb-1 px-2 text-[10px] font-bold uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
                isCustomMode 
                  ? "border-gold-500 text-gold-400" 
                  : "border-transparent text-slate-500 hover:text-slate-300"
              }`}
            >
              Custom AI Prompt Mode
            </button>
          </div>

          <AnimatePresence mode="wait">
            {!isCustomMode ? (
              <motion.div
                key="presets-pane"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {/* Step 2: Haircut Style select */}
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#a1a1aa] flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-gold-400" /> 2. Choose Haircut Style
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {HAIRCUT_STYLES.map((style) => {
                      const isActive = selectedStyle === style.id;
                      return (
                        <button
                          id={`btn-style-${style.id}`}
                          key={style.id}
                          onClick={() => {
                            setSelectedStyle(style.id);
                            if (generatedImageUrl) setGeneratedImageUrl(null);
                          }}
                          className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                            isActive 
                              ? "border-gold-500 bg-gold-400/[0.03] text-slate-100"
                              : "border-slate-800 bg-slate-950/20 text-slate-400 hover:border-slate-700 hover:text-slate-300"
                          }`}
                        >
                          <div className="flex justify-between items-start w-full">
                            <h5 className="font-display font-medium text-xs text-slate-200">{style.name}</h5>
                            <span className="text-[10px] font-mono font-bold text-gold-400">${style.price}</span>
                          </div>
                          <p className="text-[10px] text-slate-500 mt-2 font-light leading-relaxed">{style.description}</p>
                          <span className="text-[9px] text-[#71717a] mt-2 block font-mono">🕒 {style.duration} mins of precision</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="custom-pane"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-3"
              >
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#a1a1aa] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-gold-400" /> 2. Input Custom Stylist Prompts
                </label>
                <div className="space-y-2">
                  <textarea
                    id="haircut-custom-prompt-input"
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="Describe your absolute dream hair, e.g. 'A sharp skin fade pompadour with vintage parting and subtle blue highlights at the fringe peaks, dapper retro vibe.'"
                    rows={3}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-gold-500 text-xs text-slate-200 p-3.5 rounded-2xl outline-none resize-none placeholder-slate-700 transition-all font-light leading-relaxed"
                  />
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-light bg-slate-950/50 p-2 border border-slate-900 rounded-xl">
                    <AlertCircle className="w-3.5 h-3.5 text-slate-500" />
                    <span>Be descriptively detailed. Custom prompts call Astell's full AI mesh engine dynamically.</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Step 3: Color Highlight selections */}
          <div className="space-y-3 pt-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-[#a1a1aa]">
              3. Select Dye Highlights
            </label>
            <div className="flex flex-wrap gap-2">
              {COLOR_OPTIONS.map((color) => {
                const isActive = selectedColor === color.id;
                return (
                  <button
                    id={`btn-color-${color.id}`}
                    key={color.id}
                    onClick={() => {
                      setSelectedColor(color.id);
                      if (generatedImageUrl) setGeneratedImageUrl(null);
                    }}
                    className={`px-3 py-1.5 rounded-full border text-[10px] font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                      isActive 
                        ? "border-gold-400 bg-gold-400/10 text-gold-300" 
                        : "border-slate-800/80 bg-slate-950/30 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                    }`}
                  >
                    <span className={`w-2.5 h-2.5 rounded-full ${color.previewClass} border mb-0.5`} />
                    <span>{color.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 4: Add-on surgical lines/razors */}
          <div className="space-y-3 pt-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-[#a1a1aa]">
              4. Straight-Razor Shave Accents
            </label>
            <div className="grid grid-cols-2 gap-2">
              {ADDON_OPTIONS.map((addon) => {
                const isActive = selectedAddon === addon.id;
                return (
                  <button
                    id={`btn-addon-${addon.id}`}
                    key={addon.id}
                    onClick={() => {
                      setSelectedAddon(addon.id);
                      if (generatedImageUrl) setGeneratedImageUrl(null);
                    }}
                    className={`py-2 px-3 border rounded-xl text-[10px] text-left transition-all truncate cursor-pointer ${
                      isActive 
                        ? "border-amber-500/60 bg-amber-500/[0.04] text-amber-300" 
                        : "border-slate-850 bg-slate-950/20 text-slate-500 hover:text-slate-300 hover:border-slate-700"
                    }`}
                  >
                    {isActive ? "★ " : "• "} {addon.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Trigger Button */}
          <button
            id="btn-haircut-simulate"
            onClick={handleRunSimulation}
            disabled={
              isGenerating || 
              (isCustomMode && !customPrompt.trim()) || 
              (photoSource === "upload" && !uploadedPhoto)
            }
            className="w-full py-4 text-center rounded-2xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-display font-bold uppercase tracking-wider text-xs shadow-xl shadow-amber-900/10 hover:shadow-amber-500/10 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed group"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>{statusLog}</span>
              </>
            ) : photoSource === "upload" && !uploadedPhoto ? (
              <>
                <Upload className="w-4 h-4 text-slate-950" />
                <span>Please Upload Client Photo First</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 group-hover:scale-125 transition-transform" />
                <span>Render AI Haircut Analysis</span>
              </>
            )}
          </button>

        </div>

        {/* Right column: Sandbox Screen & Results View (Grid span 5) */}
        <div className="lg:col-span-5 h-full flex flex-col justify-between">
          <div className="bg-slate-950/60 border border-slate-900 rounded-3xl p-5 w-full flex-grow flex flex-col justify-between min-h-[400px] relative overflow-hidden">
            
            {/* Visual Glass Header of simulation display */}
            <div className="flex items-center justify-between border-b border-slate-900/80 pb-3 mb-4 text-[#a1a1aa] text-[9px] font-mono tracking-widest uppercase">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                Astell Lens Output
              </span>
              <span>HD SIMULATION</span>
            </div>

            {/* Absolute interactive loading projection screen */}
            <div className="flex-grow w-full relative min-h-[280px] bg-slate-950 rounded-2xl border border-slate-900 overflow-hidden flex flex-col items-center justify-center">
              
              <AnimatePresence mode="wait">
                {isGenerating ? (
                  <motion.div
                    key="scanning-state"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-slate-950 text-center space-y-4"
                  >
                    {/* Pulsing scanning face frame avatar */}
                    <div className="relative w-36 h-36 rounded-full overflow-hidden border-2 border-dashed border-gold-500/40 p-1">
                      <img 
                        src={photoSource === "upload" && uploadedPhoto ? uploadedPhoto : activeModelObj.avatar} 
                        alt="Scanning Base" 
                        className="w-full h-full object-cover rounded-full grayscale opacity-40 blur-[0.5px]"
                        referrerPolicy="no-referrer"
                      />
                      {/* Scanning visual horizontal bar */}
                      <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-transparent via-gold-400 to-transparent shadow-lg shadow-gold-500/50 animate-scanner z-30" />
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-display font-medium text-xs text-amber-400 animate-pulse uppercase tracking-widest">
                        Neural Meshing
                      </h4>
                      <p className="text-[10px] text-slate-500 font-mono font-light mt-1">
                        {statusLog}
                      </p>
                    </div>

                    {/* Faking progress stats */}
                    <div className="flex items-center gap-3 text-[9px] font-mono text-[#52525b]">
                      <span>GRID_X: 42</span>
                      <span>•</span>
                      <span>MESH_DENSITY: 88%</span>
                      <span>•</span>
                      <span>LENS_ACTV</span>
                    </div>

                  </motion.div>
                ) : generatedImageUrl ? (
                  <motion.div
                    key="result-state"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 w-full h-full flex flex-col justify-end"
                  >
                    {/* Rendered haircut image display */}
                    <div className="absolute inset-0 w-full h-full relative group">
                      <img 
                        src={generatedImageUrl} 
                        alt="Generated AI Haircut projection" 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      
                      {/* Interactive CSS Color Filter Overlay blending only when custom dyed color selected */}
                      {selectedColor !== "natural" && (
                        <div 
                          className="absolute inset-0 pointer-events-none mix-blend-color opacity-30 z-20"
                          style={{
                            background: selectedColor === "platinum" 
                              ? "radial-gradient(circle at 50% 30%, #f8fafc, transparent 65%)"
                              : selectedColor === "blonde"
                              ? "radial-gradient(circle at 50% 30%, #fbbf24, transparent 65%)"
                              : selectedColor === "teal"
                              ? "radial-gradient(circle at 50% 30%, #0d9488, transparent 65%)"
                              : "radial-gradient(circle at 50% 30%, #b45309, transparent 65%)"
                          }}
                        />
                      )}
                      
                      {/* Straight-razor slash dynamic mock watermark highlights for offline/mock visualization */}
                      {isGeneratedMock && selectedAddon !== "none" && (
                        <div className="absolute top-1/4 right-1/4 p-1 pointer-events-none z-30">
                          <span className="text-[8px] tracking-wider uppercase font-mono font-bold bg-gold-400 text-slate-950 py-0.5 px-2 rounded-full border border-gold-500 shadow-xl">
                            {activeAddonObj.name} Fitted
                          </span>
                        </div>
                      )}

                      {/* Gentle fade shading at bottom */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/25 z-10" />
                    </div>

                    {/* Metadata text overlayed on image */}
                    <div className="relative z-20 p-4 bg-slate-950/90 border-t border-slate-900 backdrop-blur-md">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-display font-medium text-xs text-slate-100 uppercase tracking-wide">
                            {isCustomMode ? "Custom Styled Trim" : activeStyleObj.name}
                          </h4>
                          <span className="text-[10px] text-slate-400">
                            Model face Base: <span className="text-slate-300 font-medium">{photoSource === "upload" ? "Client Portrait" : activeModelObj.name}</span>
                          </span>
                        </div>
                        {!isCustomMode && (
                          <div className="text-right">
                            <span className="text-xs font-mono font-bold text-gold-300 block">${activeStyleObj.price}</span>
                            <span className="text-[8px] text-slate-500 uppercase">Est. Cost</span>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-slate-900">
                        <span className="text-[8px] tracking-wider bg-slate-900 border border-slate-800 text-slate-300 py-0.5 px-2 rounded-full font-mono uppercase">
                          🎨 {activeColorObj.name}
                        </span>
                        <span className="text-[8px] tracking-wider bg-slate-900 border border-slate-800 text-slate-300 py-0.5 px-2 rounded-full font-mono uppercase">
                          ★ {activeAddonObj.name}
                        </span>
                      </div>
                    </div>

                  </motion.div>
                ) : (
                  <motion.div
                    key="placeholder-state"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center p-6 text-center space-y-4 text-slate-600"
                  >
                    <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800/80 flex items-center justify-center text-slate-500 relative">
                      <Camera className="w-6 h-6 text-gold-400/40" />
                    </div>
                    <div className="max-w-[200px]">
                      <h4 className="font-display font-medium text-xs text-slate-400">
                        {photoSource === "upload" ? "Awaiting Client Photo" : "No Image Rendered"}
                      </h4>
                      <p className="text-[10px] text-slate-500 mt-1 font-light leading-normal">
                        {photoSource === "upload"
                          ? "Please upload a client portrait image on the left, adjust style parameters, and click simulation button to initiate styling analysis."
                          : "Select a face template model, desired styled cut, shade highlights, and click render button to synthesize illustration."}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>

            {/* Bottom tools action controls on Result image */}
            <div className="mt-4 flex flex-col gap-2.5">
              
              {/* Generation notice */}
              {generationInfo && (
                <div className="flex items-start gap-1 p-2 bg-slate-950 border border-slate-900/80 rounded-xl">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1 flex-shrink-0 animate-ping"></div>
                  <p className="text-[9px] text-[#8e9196] leading-snug font-sans break-words w-full">
                    {generationInfo}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              {generatedImageUrl && (
                <div className="flex gap-2">
                  {!isCustomMode && (
                    <button
                      id="btn-haircut-addToBooking"
                      onClick={() => onToggleService(activeStyleObj.serviceId)}
                      className={`flex-1 py-2.5 px-3 rounded-xl text-[10px] uppercase font-bold tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
                        isServiceAdded
                          ? "bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20"
                          : "bg-gold-600 border-gold-500 hover:bg-gold-500 text-slate-900 hover:shadow-lg"
                      }`}
                    >
                      {isServiceAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Selected in Booking</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Reserve This Style</span>
                        </>
                      )}
                    </button>
                  )}
                  <a
                    id="btn-haircut-download"
                    href={generatedImageUrl}
                    download={`ApexBlade-AI-Haircut-${selectedModel}-${selectedStyle}.jpg`}
                    className="py-2.5 px-3.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-xl text-[10px] uppercase font-bold tracking-wider text-slate-300 hover:text-slate-100 transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Save Lens</span>
                  </a>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
