export interface FaceProfile {
  id: string;
  name: string;
  imagePaths: string[];
}

// Set `name` to the real person - this is the name greeted on the Pico OLED
// ("Welcome <name>!") and shown on the dashboard.
//
// Each person now has 3 reference images.
// Put the images inside: public/faces/
export const FACE_PROFILES: FaceProfile[] = [
  {
    id: 'person1',
    name: 'H.E Susan Kihika',
    imagePaths: [
      '/faces/person1-1.jpeg',
      '/faces/person1-2.jpg',
      '/faces/person1-3.jpg',
    ],
  },
  {
    id: 'person2',
    name: 'H.E Dr William Ruto',
    imagePaths: [
      '/faces/person2-1.jpg',
      '/faces/person2-2.jpg',
      '/faces/person2-3.jpg',
    ],
  },
  {
    id: 'person3',
    name: 'Mr Paul Ngugi',
    imagePaths: [
      '/faces/person3-1.jpg',
      '/faces/person3-2.jpg',
      '/faces/person3-3.jpg',
    ],
  },
  {
    id: 'person4',
    name: 'Prof Isaac Kibwage',
    imagePaths: [
      '/faces/person4-1.jpg',
      '/faces/person4-2.jpg',
      '/faces/person4-3.jpg',
    ],
  },
  {
    id: 'person5',
    name: 'Dr. Abdi Hassan',
    imagePaths: [
      '/faces/person5-1.jpg',
      '/faces/person5-2.jpg',
      '/faces/person5-3.jpg',
    ],
  },
  {
    id: 'person6',
    name: 'Mitch Macharia',
    imagePaths: [
      '/faces/person6-1.jpg',
      '/faces/person6-2.jpg',
      '/faces/person6-3.jpg',
    ],
  },
];

export const FACE_MATCH_THRESHOLD = 0.6;