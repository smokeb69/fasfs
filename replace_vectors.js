import fs from 'fs';

// Read the generated vectors
const vectorsContent = fs.readFileSync('attack_vectors_data.js', 'utf8');
const vectorsData = vectorsContent.replace('const ATTACK_VECTORS: AttackVector[] = ', '').replace(';', '');

// Read the AttackVectors.tsx file
let attackVectorsFile = fs.readFileSync('src/pages/AttackVectors.tsx', 'utf8');

// Find and replace the ATTACK_VECTORS array
const arrayStart = attackVectorsFile.indexOf('const ATTACK_VECTORS: AttackVector[] = [');
const arrayEnd = attackVectorsFile.indexOf('];', arrayStart) + 2;

if (arrayStart !== -1 && arrayEnd !== -1) {
  const beforeArray = attackVectorsFile.substring(0, arrayStart);
  const afterArray = attackVectorsFile.substring(arrayEnd);
  const newContent = beforeArray + 'const ATTACK_VECTORS: AttackVector[] = ' + vectorsData + ';' + afterArray;

  fs.writeFileSync('src/pages/AttackVectors.tsx', newContent);
  console.log('Successfully replaced ATTACK_VECTORS array with 584 vectors');
} else {
  console.log('Could not find ATTACK_VECTORS array in file');
}
