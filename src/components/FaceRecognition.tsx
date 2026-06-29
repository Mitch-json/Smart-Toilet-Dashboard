import React, { useRef, useState } from 'react';
import { CameraIcon, ScanFaceIcon, SendIcon, UserIcon } from 'lucide-react';
import { FACE_PROFILES } from '../config/faceProfiles';
import { useFaceRecognition } from '../hooks/useFaceRecognition';
import { sendRecognition } from '../config/pico';

export function FaceRecognition() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [lastSent, setLastSent] = useState<{ name: string; ts: number } | null>(
    null,
  );

  const handleIdentify = (name: string, confidence: number) => {
    sendRecognition(name, confidence);
    setLastSent({ name, ts: Date.now() });
  };

  const {
    status,
    statusMessage,
    match,
    pendingProfiles,
    referenceLoadStatus,
    enrollmentMessage,
    error,
    enrollProfile,
  } = useFaceRecognition({ videoRef, canvasRef, onIdentify: handleIdentify });

  const isLoading =
    status !== 'ready' &&
    status !== 'error' &&
    status !== 'enrollment';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white rounded-lg shadow">
        <div className="p-4 border-b flex items-center">
          <ScanFaceIcon className="w-5 h-5 mr-2 text-blue-600" />
          <h2 className="text-lg font-semibold">Live Face Recognition</h2>
        </div>

        <div className="p-6">
          <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video max-w-3xl mx-auto">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              playsInline
              muted
              style={{ transform: 'scaleX(-1)' }}
            />

            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ transform: 'scaleX(-1)' }}
            />

            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80">
                <p className="text-white text-sm font-medium">{statusMessage}</p>
              </div>
            )}

            {status === 'error' && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900/90 p-6">
                <p className="text-red-300 text-sm text-center">{error}</p>
              </div>
            )}
          </div>

          {status === 'enrollment' && (
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800 font-medium mb-2">
                Register missing reference images from webcam
              </p>

              <p className="text-sm text-blue-700 mb-4">
                {enrollmentMessage ??
                  'Some reference images were not found or no face was detected. Capture the missing reference images while facing the camera.'}
              </p>

              <div className="flex flex-wrap gap-3">
                {pendingProfiles.map((profile) => {
                  const loadInfo = referenceLoadStatus[profile.id];
                  const loadedCount = loadInfo?.loaded ?? 0;
                  const totalCount = loadInfo?.total ?? profile.imagePaths.length;

                  return (
                    <button
                      key={profile.id}
                      type="button"
                      onClick={() => enrollProfile(profile)}
                      className="inline-flex items-center px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium"
                    >
                      <CameraIcon className="w-4 h-4 mr-2" />
                      Capture {profile.name} ({loadedCount}/{totalCount})
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <p className="mt-4 text-sm text-gray-500 text-center">
            Add photos to `public/faces/` for automatic setup, or capture
            missing reference images from the webcam.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b flex items-center">
            <UserIcon className="w-5 h-5 mr-2 text-green-600" />
            <h2 className="text-lg font-semibold">Detection Result</h2>
          </div>

          <div className="p-6">
            {status === 'ready' && match?.name && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <p className="text-sm text-green-700 mb-1">Recognized</p>
                <p className="text-2xl font-bold text-green-900">{match.name}</p>
                <p className="text-sm text-green-700 mt-2">
                  {match.confidence}% match
                </p>
              </div>
            )}

            {lastSent && (
              <div className="mt-3 flex items-center justify-center text-xs text-blue-600">
                <SendIcon className="w-3 h-3 mr-1" />
                Sent {lastSent.name} to Pico
              </div>
            )}

            {status === 'ready' && match && !match.name && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600 mb-1">Status</p>
                <p className="text-xl font-semibold text-gray-800">
                  Unknown face
                </p>
              </div>
            )}

            {status === 'ready' && !match && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600">No face detected</p>
              </div>
            )}

            {status === 'enrollment' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                <p className="text-sm text-blue-700">
                  Waiting for enrollment to finish
                </p>
              </div>
            )}

            {isLoading && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                <p className="text-sm text-blue-700">{statusMessage}</p>
              </div>
            )}

            {status === 'error' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
          </div>
        </div>

        {/* <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Registered Profiles</h2>
          </div>

          <div className="p-6 space-y-3">
            {FACE_PROFILES.map((profile) => {
              const loadInfo = referenceLoadStatus[profile.id];

              const loadedCount = loadInfo?.loaded ?? 0;
              const totalCount = loadInfo?.total ?? profile.imagePaths.length;

              const isRegistered = loadedCount === totalCount && totalCount > 0;
              const isPending = loadedCount < totalCount;

              return (
                <div
                  key={profile.id}
                  className="flex items-center justify-between border rounded-lg p-3"
                >
                  <div>
                    <p className="font-medium text-gray-800">{profile.name}</p>
                    <p className="text-xs text-gray-500">
                      {loadedCount} / {totalCount} reference images loaded
                    </p>
                  </div>

                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      isRegistered
                        ? 'bg-green-100 text-green-700'
                        : isPending
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {isRegistered
                      ? 'Loaded'
                      : isPending
                        ? 'Needs capture'
                        : 'Pending'}
                  </span>
                </div>
              );
            })}
          </div>
        </div> */}
      </div>
    </div>
  );
} 