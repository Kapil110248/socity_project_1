#!/bin/bash

# Script to add RoleGuard to pages that don't have it

# Define pages and their allowed roles
declare -A pages=(
    ["src/app/dashboard/security/vehicles/page.tsx"]="admin,guard"
    ["src/app/dashboard/security/parcels/page.tsx"]="admin,guard"
    ["src/app/dashboard/financial/billing/page.tsx"]="admin"
    ["src/app/dashboard/financial/invoices/page.tsx"]="admin"
    ["src/app/dashboard/financial/payments/page.tsx"]="admin"
    ["src/app/dashboard/admin/vendors/page.tsx"]="admin"
    ["src/app/dashboard/admin/assets/page.tsx"]="admin"
    ["src/app/dashboard/residents/directory/page.tsx"]="admin"
    ["src/app/dashboard/residents/events/page.tsx"]="admin,resident"
    ["src/app/dashboard/residents/notices/page.tsx"]="admin,resident"
)

cd /root/society-management

for page in "${!pages[@]}"; do
    if [ -f "$page" ]; then
        roles="${pages[$page]}"
        echo "Processing $page (roles: $roles)"

        # Check if RoleGuard is already imported
        if grep -q "RoleGuard" "$page"; then
            echo "  - Already has RoleGuard, skipping"
            continue
        fi

        # Create backup
        cp "$page" "$page.bak"

        # Add imports after 'use client' and motion import
        sed -i "/^import { motion } from 'framer-motion'/a import { RoleGuard } from '@/components/auth/role-guard'" "$page"

        # Find the return statement and wrap content in RoleGuard
        # This is complex, so we'll just note it needs manual wrapping
        echo "  - Added import, needs manual wrapping of return content"
    fi
done

echo "Done! Review changes and manually wrap return content in RoleGuard"
