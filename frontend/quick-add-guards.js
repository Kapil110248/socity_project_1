const fs = require('fs');
const path = require('path');

// Pages to protect and their allowed roles
const pageProtections = {
  'src/app/dashboard/security/vehicles/page.tsx': ['admin', 'guard'],
  'src/app/dashboard/security/parcels/page.tsx': ['admin', 'guard'],
  'src/app/dashboard/financial/billing/page.tsx': ['admin'],
  'src/app/dashboard/financial/invoices/page.tsx': ['admin'],
  'src/app/dashboard/financial/payments/page.tsx': ['admin'],
  'src/app/dashboard/admin/vendors/page.tsx': ['admin'],
  'src/app/dashboard/admin/assets/page.tsx': ['admin'],
  'src/app/dashboard/residents/directory/page.tsx': ['admin'],
  'src/app/dashboard/residents/events/page.tsx': ['admin', 'resident'],
  'src/app/dashboard/residents/notices/page.tsx': ['admin', 'resident'],
};

const baseDir = '/root/society-management';

Object.entries(pageProtections).forEach(([filePath, roles]) => {
  const fullPath = path.join(baseDir, filePath);

  if (!fs.existsSync(fullPath)) {
    console.log(`❌ File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(fullPath, 'utf8');

  // Skip if already has RoleGuard
  if (content.includes('RoleGuard')) {
    console.log(`⏭️  Already protected: ${filePath}`);
    return;
  }

  // Add import after framer-motion import
  const motionImportLine = "import { motion } from 'framer-motion'";
  const newImports = `import { motion } from 'framer-motion'
import { RoleGuard } from '@/components/auth/role-guard'`;

  content = content.replace(motionImportLine, newImports);

  // Find the export default function and wrap its return
  const exportMatch = content.match(/export default function \w+\([^)]*\) \{/);

  if (!exportMatch) {
    console.log(`⚠️  Could not find export function in: ${filePath}`);
    return;
  }

  // Find the return statement
  const returnMatch = content.match(/(export default function \w+\([^)]*\) \{[\s\S]*?)(return \([\s\S]*?\n  \)[\s\S]*?\n\})/);

  if (!returnMatch) {
    console.log(`⚠️  Could not find return statement in: ${filePath}`);
    return;
  }

  const beforeReturn = returnMatch[1];
  const returnContent = returnMatch[2];

  // Check if return already wrapped
  if (returnContent.includes('<RoleGuard')) {
    console.log(`⏭️  Already wrapped: ${filePath}`);
    return;
  }

  // Extract the JSX content from return
  const jsxMatch = returnContent.match(/return \(([\s\S]*)\n  \)/);

  if (!jsxMatch) {
    console.log(`⚠️  Could not extract JSX from: ${filePath}`);
    return;
  }

  const jsxContent = jsxMatch[1];
  const rolesStr = roles.map(r => `'${r}'`).join(', ');

  const newReturn = `return (
    <RoleGuard allowedRoles={[${rolesStr}]}>
${jsxContent}
    </RoleGuard>
  )`;

  content = content.replace(returnMatch[0], beforeReturn + newReturn + '\n}');

  // Write back
  fs.writeFileSync(fullPath, content);
  console.log(`✅ Protected: ${filePath} (roles: ${roles.join(', ')})`);
});

console.log('\n✨ Done! All pages have been protected with RoleGuard.');
