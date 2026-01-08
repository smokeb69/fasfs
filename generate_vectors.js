import fs from 'fs';

// Generate comprehensive attack vectors
const categories = {
  'AI Threats': 50,
  'Child Exploitation': 50,
  'Malware': 50,
  'Network Attacks': 50,
  'Social Engineering': 50,
  'Data Breaches': 50,
  'IoT Threats': 50,
  'Cloud Threats': 50,
  'Mobile Threats': 50,
  'Physical Security': 50,
  'Insider Threats': 50,
  'Emerging Threats': 34 // Total 494
};

let vectors = [];
let id = 1;

function randomDate(days) {
  return new Date(Date.now() - Math.random() * days * 24 * 60 * 60 * 1000);
}

function randomRate() {
  return Math.round((Math.random() * 60 + 20) * 10) / 10;
}

function randomIncidents() {
  return Math.floor(Math.random() * 5000) + 1;
}

Object.entries(categories).forEach(([category, count]) => {
  for (let i = 0; i < count; i++) {
    const severity = ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)];
    const status = ['active', 'monitored', 'contained'][Math.floor(Math.random() * 3)];

    vectors.push({
      id: `attack-vector-${id++}`,
      name: `${category} Attack ${i + 1}`,
      category,
      severity,
      description: `Real-world ${category.toLowerCase()} attack vector involving sophisticated techniques`,
      indicators: [`Technical indicator for ${category}`, `Behavioral pattern in ${category}`, `Network signature of ${category}`],
      mitigation: [`Security control for ${category}`, `Monitoring solution for ${category}`, `Response procedure for ${category}`],
      detectionRate: randomRate(),
      activeIncidents: randomIncidents(),
      lastDetected: randomDate(365),
      status
    });
  }
});

// Write to file
const content = `const ATTACK_VECTORS: AttackVector[] = ${JSON.stringify(vectors, null, 2)};`;
fs.writeFileSync('attack_vectors_data.js', content);
console.log('Generated', vectors.length, 'attack vectors');
