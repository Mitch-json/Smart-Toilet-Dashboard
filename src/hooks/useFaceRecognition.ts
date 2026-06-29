import { useCallback, useEffect, useRef, useState } from 'react';
import * as faceapi from '@vladmandic/face-api';
import {
  FACE_MATCH_THRESHOLD,
  FACE_PROFILES,
  FaceProfile,
} from '../config/faceProfiles';

const MODEL_PATH = '/models';

export type FaceRecognitionStatus =
  | 'loading-models'
  | 'loading-faces'
  | 'starting-camera'
  | 'enrollment'
  | 'ready'
  | 'error';

export interface FaceMatchResult {
  name: string | null;
  confidence: number;
  distance: number;
  box: {
    x: number;
    y: number;
    width: number;
    height: number;
  } | null;
}

interface UseFaceRecognitionOptions {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  // Fired once per identity transition (not every frame) above the confidence
  // threshold. Used to notify the Pico of a recognized user.
  onIdentify?: (name: string, confidence: number) => void;
}

// Minimum confidence (%) required before emitting an identity event.
const IDENTIFY_MIN_CONFIDENCE = 50;
// Consecutive frames a new identity must persist before emitting (debounce).
const IDENTIFY_STABLE_FRAMES = 3;

interface LoadReferenceResult {
  descriptors: faceapi.LabeledFaceDescriptors[];
  pendingProfiles: FaceProfile[];
}

async function loadReferenceDescriptors(
  detectorOptions: faceapi.TinyFaceDetectorOptions,
): Promise<LoadReferenceResult> {
  const descriptors: faceapi.LabeledFaceDescriptors[] = [];
  const pendingProfiles: FaceProfile[] = [];

  for (const profile of FACE_PROFILES) {
    let image: HTMLImageElement;

    try {
      image = await faceapi.fetchImage(profile.imagePath);
    } catch {
      pendingProfiles.push(profile);
      continue;
    }

    const detection = await faceapi
      .detectSingleFace(image, detectorOptions)
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) {
      pendingProfiles.push(profile);
      continue;
    }

    descriptors.push(
      new faceapi.LabeledFaceDescriptors(profile.name, [detection.descriptor]),
    );
  }

  return { descriptors, pendingProfiles };
}

function toMatchResult(
  bestMatch: faceapi.FaceMatch,
  box: faceapi.Box | null,
): FaceMatchResult {
  const isKnown = bestMatch.label !== 'unknown';
  const confidence = isKnown
    ? Math.max(0, Math.min(100, Math.round((1 - bestMatch.distance) * 100)))
    : 0;

  return {
    name: isKnown ? bestMatch.label : null,
    confidence,
    distance: bestMatch.distance,
    box: box
      ? {
          x: box.x,
          y: box.y,
          width: box.width,
          height: box.height,
        }
      : null,
  };
}

function drawOverlay(
  canvas: HTMLCanvasElement,
  video: HTMLVideoElement,
  match: FaceMatchResult | null,
  label?: string,
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!match?.box) return;

  const { x, y, width, height } = match.box;
  const isKnown = match.name !== null;
  const displayLabel =
    label ??
    (isKnown ? `${match.name} · ${match.confidence}%` : 'Unknown face');

  ctx.lineWidth = 3;
  ctx.strokeStyle = label ? '#3b82f6' : isKnown ? '#22c55e' : '#9ca3af';
  ctx.strokeRect(x, y, width, height);

  ctx.font = '600 16px system-ui, sans-serif';
  const textWidth = ctx.measureText(displayLabel).width;
  const labelY = Math.max(y - 10, 20);

  ctx.fillStyle = label ? '#3b82f6' : isKnown ? '#22c55e' : '#6b7280';
  ctx.fillRect(x, labelY - 22, textWidth + 16, 24);
  ctx.fillStyle = '#ffffff';
  ctx.fillText(displayLabel, x + 8, labelY - 5);
}

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) {
    if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
      return 'Camera permission denied. Allow camera access and reload.';
    }
    return err.message;
  }
  return 'Face recognition failed to start.';
}

export function useFaceRecognition({
  videoRef,
  canvasRef,
  onIdentify,
}: UseFaceRecognitionOptions) {
  const [status, setStatus] = useState<FaceRecognitionStatus>('loading-models');
  const [statusMessage, setStatusMessage] = useState('Loading models…');
  const [match, setMatch] = useState<FaceMatchResult | null>(null);
  const [registeredNames, setRegisteredNames] = useState<string[]>([]);
  const [pendingProfiles, setPendingProfiles] = useState<FaceProfile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [enrollmentMessage, setEnrollmentMessage] = useState<string | null>(
    null,
  );

  const faceMatcherRef = useRef<faceapi.FaceMatcher | null>(null);
  const labeledDescriptorsRef = useRef<faceapi.LabeledFaceDescriptors[]>([]);
  const detectorOptionsRef = useRef<faceapi.TinyFaceDetectorOptions | null>(
    null,
  );
  const animationFrameRef = useRef<number>(0);
  const streamRef = useRef<MediaStream | null>(null);
  const detectingRef = useRef(false);

  // Identity-event throttling: keep latest callback in a ref, track the last
  // emitted name and how many consecutive frames a candidate name has held.
  const onIdentifyRef = useRef(onIdentify);
  onIdentifyRef.current = onIdentify;
  const lastEmittedNameRef = useRef<string | null>(null);
  const candidateNameRef = useRef<string | null>(null);
  const candidateFramesRef = useRef(0);

  const handleIdentity = useCallback((result: FaceMatchResult) => {
    const name =
      result.name && result.confidence >= IDENTIFY_MIN_CONFIDENCE
        ? result.name
        : null;

    // Reset when nobody recognized so the same person re-triggers after leaving.
    if (!name) {
      candidateNameRef.current = null;
      candidateFramesRef.current = 0;
      lastEmittedNameRef.current = null;
      return;
    }

    // Already emitted for this person; wait until they change/leave.
    if (name === lastEmittedNameRef.current) return;

    if (name === candidateNameRef.current) {
      candidateFramesRef.current += 1;
    } else {
      candidateNameRef.current = name;
      candidateFramesRef.current = 1;
    }

    if (candidateFramesRef.current >= IDENTIFY_STABLE_FRAMES) {
      lastEmittedNameRef.current = name;
      candidateNameRef.current = null;
      candidateFramesRef.current = 0;
      onIdentifyRef.current?.(name, result.confidence);
    }
  }, []);

  const stopDetectionLoop = useCallback(() => {
    cancelAnimationFrame(animationFrameRef.current);
    detectingRef.current = false;
  }, []);

  const startDetectionLoop = useCallback(() => {
    stopDetectionLoop();
    detectingRef.current = true;

    const detectFrame = async () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const faceMatcher = faceMatcherRef.current;
      const detectorOptions = detectorOptionsRef.current;

      if (
        !detectingRef.current ||
        !video ||
        !canvas ||
        !faceMatcher ||
        !detectorOptions ||
        video.paused ||
        video.readyState < 2
      ) {
        if (detectingRef.current) {
          animationFrameRef.current = requestAnimationFrame(detectFrame);
        }
        return;
      }

      try {
        const detection = await faceapi
          .detectSingleFace(video, detectorOptions)
          .withFaceLandmarks()
          .withFaceDescriptor();

        if (!detectingRef.current) return;

        if (detection) {
          const bestMatch = faceMatcher.findBestMatch(detection.descriptor);
          const result = toMatchResult(bestMatch, detection.detection.box);
          setMatch(result);
          handleIdentity(result);
          drawOverlay(canvas, video, result);
        } else {
          setMatch(null);
          handleIdentity({ name: null, confidence: 0, distance: 1, box: null });
          drawOverlay(canvas, video, null);
        }
      } catch {
        if (detectingRef.current) {
          setMatch(null);
        }
      }

      if (detectingRef.current) {
        animationFrameRef.current = requestAnimationFrame(detectFrame);
      }
    };

    animationFrameRef.current = requestAnimationFrame(detectFrame);
  }, [canvasRef, handleIdentity, stopDetectionLoop, videoRef]);

  const activateMatcher = useCallback(
    (descriptors: faceapi.LabeledFaceDescriptors[]) => {
      labeledDescriptorsRef.current = descriptors;
      faceMatcherRef.current = new faceapi.FaceMatcher(
        descriptors,
        FACE_MATCH_THRESHOLD,
      );
      setRegisteredNames(descriptors.map((entry) => entry.label));
    },
    [],
  );

  const startRecognition = useCallback(() => {
    setStatus('ready');
    setStatusMessage('Recognition active');
    setEnrollmentMessage(null);
    startDetectionLoop();
  }, [startDetectionLoop]);

  const enrollProfile = useCallback(
    async (profile: FaceProfile) => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const detectorOptions = detectorOptionsRef.current;

      if (!video || !detectorOptions) {
        setEnrollmentMessage('Camera is not ready yet.');
        return false;
      }

      if (video.readyState < 2 || video.paused) {
        setEnrollmentMessage('Wait for the camera preview to appear.');
        return false;
      }

      setEnrollmentMessage(`Capturing ${profile.name}…`);

      const detection = await faceapi
        .detectSingleFace(video, detectorOptions)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection) {
        setEnrollmentMessage(
          `No face detected for ${profile.name}. Face the camera and try again.`,
        );
        return false;
      }

      const updatedDescriptors = [
        ...labeledDescriptorsRef.current.filter(
          (entry) => entry.label !== profile.name,
        ),
        new faceapi.LabeledFaceDescriptors(profile.name, [
          detection.descriptor,
        ]),
      ];

      activateMatcher(updatedDescriptors);

      const remaining = pendingProfiles.filter(
        (pending) => pending.id !== profile.id,
      );
      setPendingProfiles(remaining);

      if (canvas) {
        drawOverlay(
          canvas,
          video,
          {
            name: profile.name,
            confidence: 100,
            distance: 0,
            box: {
              x: detection.detection.box.x,
              y: detection.detection.box.y,
              width: detection.detection.box.width,
              height: detection.detection.box.height,
            },
          },
          `${profile.name} registered`,
        );
      }

      if (remaining.length === 0) {
        startRecognition();
        return true;
      }

      setEnrollmentMessage(
        `${profile.name} registered. Capture ${remaining[0].name} next.`,
      );
      return true;
    },
    [activateMatcher, canvasRef, pendingProfiles, startRecognition, videoRef],
  );

  useEffect(() => {
    let cancelled = false;

    const startCamera = async () => {
      setStatus('starting-camera');
      setStatusMessage('Starting camera…');

      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('Camera access is not supported in this browser.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
      });

      if (cancelled) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      streamRef.current = stream;
      const video = videoRef.current;
      if (!video) {
        throw new Error('Video element is not available.');
      }

      video.srcObject = stream;

      await new Promise<void>((resolve, reject) => {
        video.onloadedmetadata = () => resolve();
        video.onerror = () => reject(new Error('Failed to load camera stream.'));
      });

      await video.play();
    };

    const initialize = async () => {
      try {
        setStatus('loading-models');
        setStatusMessage('Loading models…');

        await faceapi.tf.setBackend('webgl');
        await faceapi.tf.ready();

        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_PATH),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_PATH),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_PATH),
        ]);

        if (cancelled) return;

        detectorOptionsRef.current = new faceapi.TinyFaceDetectorOptions({
          inputSize: 416,
          scoreThreshold: 0.5,
        });

        setStatus('loading-faces');
        setStatusMessage('Loading reference faces…');

        const { descriptors, pendingProfiles: pending } =
          await loadReferenceDescriptors(detectorOptionsRef.current);

        if (cancelled) return;

        activateMatcher(descriptors);
        setPendingProfiles(pending);

        await startCamera();
        if (cancelled) return;

        if (pending.length > 0) {
          setStatus('enrollment');
          setStatusMessage('Register faces from webcam');
          setEnrollmentMessage(
            descriptors.length > 0
              ? `Some reference photos were missing. Capture ${pending[0].name} from the webcam.`
              : `Reference photos not found. Capture ${pending[0].name} from the webcam.`,
          );
          return;
        }

        if (descriptors.length === 0) {
          throw new Error(
            'No reference faces loaded. Add photos to public/faces/ or register from webcam.',
          );
        }

        startRecognition();
      } catch (err) {
        if (cancelled) return;

        const message = getErrorMessage(err);
        setError(message);
        setStatus('error');
        setStatusMessage(message);
      }
    };

    initialize();

    return () => {
      cancelled = true;
      stopDetectionLoop();
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      faceMatcherRef.current = null;
    };
  }, [
    activateMatcher,
    startRecognition,
    stopDetectionLoop,
    videoRef,
  ]);

  return {
    status,
    statusMessage,
    match,
    registeredNames,
    pendingProfiles,
    enrollmentMessage,
    error,
    enrollProfile,
  };
}
