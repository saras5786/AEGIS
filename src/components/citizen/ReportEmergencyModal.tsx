import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  AlertCircle,
  Camera,
  Upload,
  ArrowRight,
  ArrowLeft,
  X,
  CheckCircle2,
  Sparkles,
  Loader2,
  Users,
  RefreshCw
} from 'lucide-react';
import { useEmergency } from '../../context/EmergencyContext';
import { IncidentType, LocationCoord, Incident } from '../../types';
import { getBrowserCurrentPosition } from '../../services/locationService';

interface ReportEmergencyModalProps {
  onClose: () => void;
  onSuccess: (incident: Incident) => void;
}

export const ReportEmergencyModal: React.FC<ReportEmergencyModalProps> = ({
  onClose,
  onSuccess
}) => {
  const { userLocation, createIncidentReport } = useEmergency();

  const [step, setStep] = useState<number>(1);
  const [loadingLocation, setLoadingLocation] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string>('');

  // Step 1: Location Data
  const [reportLocation, setReportLocation] = useState<LocationCoord>(userLocation);

  // Step 2: Details
  const [selectedType, setSelectedType] = useState<IncidentType>('accident');
  const [customTitle] = useState('');
  const [description, setDescription] = useState('');
  const [peopleCount, setPeopleCount] = useState<number>(1);

  // Step 3: Photo / Camera
  const [photoDataUrl, setPhotoDataUrl] = useState<string>('');
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Step 4: AI verification progressive progress
  const [aiProgress, setAiProgress] = useState<number>(0);
  const [aiStepLabel, setAiStepLabel] = useState<string>('Receiving report...');
  const [createdIncident, setCreatedIncident] = useState<Incident | null>(null);

  // Clean incident options with NO paragraph descriptions
  const incidentOptions: { type: IncidentType; label: string; icon: string }[] = [
    { type: 'accident', label: 'Road Accident', icon: '🚗' },
    { type: 'fire', label: 'Fire', icon: '🔥' },
    { type: 'medical', label: 'Medical Emergency', icon: '🏥' },
    { type: 'police', label: 'Safety / Police', icon: '👮' },
    { type: 'hazard', label: 'Traffic Hazard', icon: '🚧' },
    { type: 'natural', label: 'Natural Hazard', icon: '🌊' },
    { type: 'other', label: 'Other Emergency', icon: '❓' }
  ];

  // Request browser geolocation
  const handleFetchRealGps = async () => {
    setLoadingLocation(true);
    setLocationError('');
    try {
      const pos = await getBrowserCurrentPosition();
      setReportLocation(pos);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Could not access browser GPS';
      setLocationError(msg);
    } finally {
      setLoadingLocation(false);
    }
  };

  // Camera handling
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: 640 }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);
    } catch {
      alert('Camera access not supported or permission denied. Please upload a file instead.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      setPhotoDataUrl(canvas.toDataURL('image/jpeg', 0.8));
    }
    stopCamera();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        alert('File is too large. Please select a photo under 8MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoDataUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Clean up camera on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Submit and start Step 4 AI Verification
  const handleSubmitReport = async () => {
    setStep(4);
    setAiProgress(10);
    setAiStepLabel('Sending location and details...');

    setTimeout(() => {
      setAiProgress(40);
      setAiStepLabel('Checking report description...');
    }, 500);

    setTimeout(() => {
      setAiProgress(70);
      setAiStepLabel('Scanning photo evidence for risks...');
    }, 1000);

    setTimeout(() => {
      setAiProgress(90);
      setAiStepLabel('Determining priority and response units...');
    }, 1500);

    try {
      const inc = await createIncidentReport({
        type: selectedType,
        title: customTitle || `${selectedType.toUpperCase()} at ${reportLocation.address?.slice(0, 30) || 'reported location'}`,
        description: description || 'Emergency reported by citizen.',
        peopleInvolved: peopleCount,
        location: reportLocation,
        photoUrl: photoDataUrl || undefined
      });

      setTimeout(() => {
        setAiProgress(100);
        setAiStepLabel('AI Analysis Complete');
        setCreatedIncident(inc);
      }, 2000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="w-full max-w-lg bg-[#101C2B] border border-[#1E344F] rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden relative"
      >
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-[#1E344F] bg-[#0A1420] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-red-950/80 border border-red-500/40 text-red-400">
              <AlertCircle className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Report Emergency</h3>
              <p className="text-[11px] text-slate-400">Step {step} of 4</p>
            </div>
          </div>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[#07111F] h-1.5">
          <div
            className="h-full bg-gradient-to-r from-red-500 to-cyan-400 transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {/* Content Area */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {/* STEP 1: REAL LOCATION */}
          {step === 1 && (
            <div className="space-y-4">
              <h4 className="text-base font-bold text-white">Emergency Location</h4>

              {/* Location Card */}
              <div className="p-4 rounded-xl bg-[#09121D] border border-[#1E344F] space-y-3">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-cyan-300">DETECTED GPS</span>
                      <span className="text-[11px] font-mono text-slate-400">
                        ±{reportLocation.accuracy || 15}m
                      </span>
                    </div>
                    <p className="text-sm font-medium text-slate-200 mt-1">
                      {reportLocation.address || 'Locating...'}
                    </p>
                    <div className="text-[11px] font-mono text-slate-500 mt-1">
                      {reportLocation.lat.toFixed(5)}° N, {reportLocation.lng.toFixed(5)}° E
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#1E344F]/60">
                  <button
                    type="button"
                    onClick={handleFetchRealGps}
                    disabled={loadingLocation}
                    className="w-full py-2 px-3 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 text-xs font-medium flex items-center justify-center gap-1.5 transition-all"
                  >
                    {loadingLocation ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <RefreshCw className="w-3.5 h-3.5" />
                    )}
                    Use Current GPS Location
                  </button>
                </div>
              </div>

              {locationError && (
                <div className="p-2.5 rounded-lg bg-amber-950/30 border border-amber-800/40 text-xs text-amber-300">
                  {locationError}
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Landmark (Optional)
                </label>
                <input
                  type="text"
                  value={reportLocation.address || ''}
                  onChange={(e) => setReportLocation(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Near intersection, shop, or building"
                  className="w-full bg-[#0A1420] border border-[#1E344F] rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          )}

          {/* STEP 2: INCIDENT INFORMATION (WITHOUT DESCRIPTION CLUTTER) */}
          {step === 2 && (
            <div className="space-y-4">
              <h4 className="text-base font-bold text-white">Select Emergency Type</h4>

              {/* Clean Option Grid without paragraph descriptions */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {incidentOptions.map(opt => (
                  <button
                    key={opt.type}
                    type="button"
                    onClick={() => setSelectedType(opt.type)}
                    className={`p-3 rounded-xl border transition-all flex flex-col items-center justify-center text-center gap-1.5 ${
                      selectedType === opt.type
                        ? 'bg-red-950/60 border-red-500 text-white shadow-[0_0_15px_rgba(255,51,75,0.25)]'
                        : 'bg-[#09121D] border-[#1E344F] text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <span className="text-2xl">{opt.icon}</span>
                    <span className="text-xs font-bold leading-tight">{opt.label}</span>
                  </button>
                ))}
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Describe what happened
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the situation briefly..."
                  className="w-full bg-[#0A1420] border border-[#1E344F] rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors leading-relaxed"
                  required
                />
              </div>

              {/* Number of People Involved */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#09121D] border border-[#1E344F]">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-medium text-white">People involved / injured</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPeopleCount(Math.max(0, peopleCount - 1))}
                    className="w-7 h-7 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 flex items-center justify-center font-bold text-sm"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-mono font-bold text-sm text-cyan-300">
                    {peopleCount}
                  </span>
                  <button
                    type="button"
                    onClick={() => setPeopleCount(peopleCount + 1)}
                    className="w-7 h-7 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 flex items-center justify-center font-bold text-sm"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: PHOTO / EVIDENCE */}
          {step === 3 && (
            <div className="space-y-4">
              <h4 className="text-base font-bold text-white">Photo Evidence (Optional)</h4>

              {/* Live Camera Viewfinder */}
              {cameraActive ? (
                <div className="relative rounded-xl overflow-hidden border border-cyan-500/50 bg-black aspect-video flex items-center justify-center">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                  <div className="absolute bottom-3 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={capturePhoto}
                      className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg"
                    >
                      <Camera className="w-4 h-4" />
                      Take Photo
                    </button>
                    <button
                      type="button"
                      onClick={stopCamera}
                      className="px-3 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs hover:bg-slate-700"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : photoDataUrl ? (
                /* Preview Photo */
                <div className="relative rounded-xl overflow-hidden border border-[#1E344F] bg-slate-950 aspect-video flex items-center justify-center">
                  <img src={photoDataUrl} alt="Evidence" className="w-full h-full object-contain" />
                  <button
                    type="button"
                    onClick={() => setPhotoDataUrl('')}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/70 text-slate-300 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                /* Camera / Upload buttons */
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={startCamera}
                    className="p-5 rounded-xl border border-dashed border-[#1E344F] hover:border-cyan-500 bg-[#09121D] hover:bg-cyan-950/20 text-slate-300 hover:text-cyan-300 transition-all flex flex-col items-center justify-center gap-2"
                  >
                    <Camera className="w-7 h-7 text-cyan-400" />
                    <span className="text-xs font-semibold">Use Camera</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-5 rounded-xl border border-dashed border-[#1E344F] hover:border-cyan-500 bg-[#09121D] hover:bg-cyan-950/20 text-slate-300 hover:text-cyan-300 transition-all flex flex-col items-center justify-center gap-2"
                  >
                    <Upload className="w-7 h-7 text-blue-400" />
                    <span className="text-xs font-semibold">Upload Image</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              )}
            </div>
          )}

          {/* STEP 4: AI VERIFICATION */}
          {step === 4 && (
            <div className="space-y-4 py-2">
              <div className="text-center">
                <div className="relative inline-flex mb-3">
                  <div className="p-3.5 rounded-2xl bg-cyan-950/70 border border-cyan-500/40 text-cyan-400">
                    <Sparkles className="w-7 h-7 animate-spin" style={{ animationDuration: '4s' }} />
                  </div>
                </div>
                <h4 className="text-base font-bold text-white">AI Analysis</h4>
                <p className="text-xs text-slate-400 mt-0.5">{aiStepLabel}</p>
              </div>

              {/* Progress checks */}
              <div className="space-y-2 bg-[#09121D] p-3.5 rounded-xl border border-[#1E344F] text-xs">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-slate-300">
                    <CheckCircle2 className={`w-4 h-4 ${aiProgress >= 20 ? 'text-emerald-400' : 'text-slate-600'}`} />
                    Location Verified
                  </span>
                  <span className="font-mono text-slate-500 text-[10px]">{aiProgress >= 20 ? 'Done' : '...'}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-slate-300">
                    <CheckCircle2 className={`w-4 h-4 ${aiProgress >= 40 ? 'text-emerald-400' : 'text-slate-600'}`} />
                    Incident Type Scanned
                  </span>
                  <span className="font-mono text-slate-500 text-[10px]">{aiProgress >= 40 ? 'Done' : '...'}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-slate-300">
                    <CheckCircle2 className={`w-4 h-4 ${aiProgress >= 70 ? 'text-emerald-400' : 'text-slate-600'}`} />
                    Priority Calculated
                  </span>
                  <span className="font-mono text-slate-500 text-[10px]">{aiProgress >= 70 ? 'Done' : '...'}</span>
                </div>
              </div>

              {/* Final Result Card */}
              {createdIncident && createdIncident.aiAnalysis && (
                <div className="p-4 rounded-xl bg-gradient-to-br from-[#122336] to-[#0A1420] border border-cyan-500/40 space-y-2.5">
                  <div className="flex items-center justify-between border-b border-[#1E344F] pb-2">
                    <span className="font-bold text-white text-sm">
                      INCIDENT #{createdIncident.displayNumber}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-950 text-red-300 border border-red-500/40">
                      {createdIncident.aiAnalysis.priority} PRIORITY
                    </span>
                  </div>

                  <p className="text-xs text-slate-200">
                    {createdIncident.aiAnalysis.summary}
                  </p>

                  <div className="text-xs text-cyan-300 flex items-center gap-1 font-medium">
                    <span>Response Team:</span>
                    <span className="text-white font-bold">
                      {createdIncident.aiAnalysis.recommendedUnits.join(', ') || 'Paramedic Unit'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-[#1E344F] bg-[#0A1420] flex items-center justify-between gap-3">
          {step > 1 && step < 4 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={() => {
                if (step === 2 && !description.trim()) {
                  alert('Please enter a short description.');
                  return;
                }
                setStep(step + 1);
              }}
              className="px-6 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition-all"
            >
              Next
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : step === 3 ? (
            <button
              type="button"
              onClick={handleSubmitReport}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition-all"
            >
              Submit Report
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              disabled={!createdIncident}
              onClick={() => {
                if (createdIncident) {
                  onSuccess(createdIncident);
                }
              }}
              className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-50"
            >
              View on Dashboard
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};
