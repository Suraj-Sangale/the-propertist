const fs = require('fs');

let content = fs.readFileSync('f:/nextjs/the-propertist/utilities/masterData.js', 'utf8');

const additionalData = `    description: 'Experience luxury living at its finest. This premium residential project offers meticulously designed homes with state-of-the-art amenities, ensuring a perfect balance of comfort, style, and convenience. Nestled in a prime location, it provides seamless connectivity to major business hubs, educational institutions, and entertainment centers.',
    amenities: ['Swimming Pool', 'Fully Equipped Gymnasium', 'Club House', 'Landscaped Gardens', 'Kids Play Area', '24/7 Security', 'Jogging Track', 'Indoor Games'],
    gallery: [
      '/images/projects/Untitled-design-18.webp',
      '/images/projects/Untitled-design-19.webp',
      '/images/projects/Untitled-design-20.webp',
      '/images/projects/Untitled-design-21.webp'
    ],
    address: 'Prime Location, Mumbai, Maharashtra',
    possessionDate: 'December 2026',
    reraId: 'P518000XXXXX',
    floorPlans: [
      { type: 'Standard', image: '/images/projects/Untitled-design-18.webp' }
    ],
    mapLocation: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241317.11609823277!2d72.74109995709657!3d19.08219783958221!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c6306644edc1%3A0x5da4ed8f8d648c69!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1689000000000!5m2!1sen!2sin'`;

content = content.replace(/features:\s*\[.*?\],\n\s*\}/g, (match) => {
    return match.replace(/\n\s*\}/, `,\n${additionalData}\n  }`);
});

fs.writeFileSync('f:/nextjs/the-propertist/utilities/masterData.js', content, 'utf8');
console.log('Updated masterData.js');
