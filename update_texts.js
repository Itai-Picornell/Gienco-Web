const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace Gienco Band with Gienco where appropriate
  content = content.replace(/Gienco Band/g, 'Gienco');
  content = content.replace(/privacidad@gienco\.com/g, 'giencoband@gmail.com');
  
  // Specific for Privacy Policy array of cookies:
  if (filePath.includes('PrivacyPolicy.vue')) {
    // Remove Bandsintown from the text
    content = content.replace(/y Bandsintown\./g, '.');
    // Remove the Bandsintown li item
    content = content.replace(/\s*<li><strong class="text-gray-300">Bandsintown:<\/strong>.*?<\/li>/g, '');
  }
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${filePath}`);
}

['src/views/TermsOfService.vue', 'src/views/PrivacyPolicy.vue', 'src/components/Footer.vue', 'src/views/Home.vue'].forEach(processFile);
