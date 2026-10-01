const fs = require('fs');

const fileContent = fs.readFileSync('f:/nextjs/the-propertist/utilities/masterData.js', 'utf8');
const jsonString = fileContent.replace('export const ALL_PROPERTIES = ', '').replace(/;?\s*$/, '');
const array = new Function('return ' + jsonString)();

array.forEach(item => {
    if (item.config_label) {
        item.slug = item.config_label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    item.description = "Experience luxury living at its finest. This premium residential project offers meticulously designed homes with state-of-the-art amenities, ensuring a perfect balance of comfort, style, and convenience. Nestled in a prime location, it provides seamless connectivity to major business hubs, educational institutions, and entertainment centers.";
    item.amenities = ["Swimming Pool", "Fully Equipped Gymnasium", "Club House", "Landscaped Gardens", "Kids Play Area", "24/7 Security", "Jogging Track", "Indoor Games"];
    item.gallery = [
      "/images/projects/Untitled-design-18.webp",
      "/images/projects/Untitled-design-19.webp",
      "/images/projects/Untitled-design-20.webp",
      "/images/projects/Untitled-design-21.webp"
    ];
    item.address = "Prime Location, Mumbai, Maharashtra";
    item.possessionDate = "December 2026";
    item.reraId = "P518000XXXXX";
    item.floorPlans = [
      { type: "Standard", image: "/images/projects/Untitled-design-18.webp" }
    ];
    item.mapLocation = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241317.11609823277!2d72.74109995709657!3d19.08219783958221!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c6306644edc1%3A0x5da4ed8f8d648c69!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1689000000000!5m2!1sen!2sin";
});

const newFileContent = 'export const ALL_PROPERTIES = ' + JSON.stringify(array, null, 2) + ';\n';
fs.writeFileSync('f:/nextjs/the-propertist/utilities/masterData.js', newFileContent, 'utf8');
console.log('Updated masterData.js successfully');
