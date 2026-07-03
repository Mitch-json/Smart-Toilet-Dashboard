export interface FaceProfile {
  id: string;
  name: string;
  imagePath: string;
}

// Set `name` to the real person - this is the name greeted on the Pico OLED
// ("Welcome <name>!") and shown on the dashboard.
export const FACE_PROFILES: FaceProfile[] = [
  { id: 'person1', name: 'Mitch Macharia', imagePath: '/faces/person6-1.jpg' },
  { id: 'person1', name: 'Mitch Macharia', imagePath: '/faces/person6-1.jpg' },
  { id: 'person3', name: 'CS Mutahi Kagwe', imagePath: '/faces/person8.jpg' },

];

export const FACE_MATCH_THRESHOLD = 0.6;
