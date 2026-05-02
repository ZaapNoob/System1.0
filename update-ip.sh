#!/bin/bash

#############################################################################
# CENTRALIZED IP UPDATE CONTROLLER
# Updates all configuration files with the new server IP address
# Usage: sudo bash update-ip.sh <new-ip>
#############################################################################

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Print header
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  CENTRALIZED IP UPDATE CONTROLLER${NC}"
echo -e "${BLUE}========================================${NC}"

# Validate input
if [ -z "$1" ]; then
    echo -e "${YELLOW}⏳ Detecting current machine IP address...${NC}"
    
    # Try to get the local IP (not localhost)
    CURRENT_IP=$(hostname -I | awk '{print $1}')
    
    if [ -z "$CURRENT_IP" ]; then
        # Fallback: try to get from .env if it exists
        if [ -f "$SCRIPT_DIR/.env" ] && grep -q "VITE_SERVER_HOST=" "$SCRIPT_DIR/.env"; then
            CURRENT_IP=$(grep "VITE_SERVER_HOST=" "$SCRIPT_DIR/.env" | cut -d'=' -f2)
        fi
    fi
    
    if [ -z "$CURRENT_IP" ] || [ "$CURRENT_IP" = "localhost" ]; then
        echo -e "${RED}❌ Error: Could not auto-detect IP address${NC}"
        echo -e "${YELLOW}Usage: sudo bash update-ip.sh <new-ip>${NC}"
        echo ""
        echo -e "${YELLOW}Example:${NC}"
        echo "  sudo bash update-ip.sh 192.168.1.100"
        exit 1
    fi
    
    NEW_IP="$CURRENT_IP"
    echo -e "${GREEN}✓ Auto-detected IP: $NEW_IP${NC}"
else
    NEW_IP="$1"
fi

# Validate IP format
if ! [[ $NEW_IP =~ ^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$ ]]; then
    echo -e "${RED}❌ Error: Invalid IP address format${NC}"
    echo -e "${YELLOW}Please use format: xxx.xxx.xxx.xxx${NC}"
    exit 1
fi

echo -e "${YELLOW}New IP Address: ${GREEN}$NEW_IP${NC}"
echo ""

# ============================================================
# 1. DETECT OLD IP FROM APACHE CONFIG (if exists)
# ============================================================
APACHE_CONFIG="/opt/lampp/etc/extra/ip-based.conf"
OLD_IP="$NEW_IP" # Default: same as new (no change needed)

if [ -f "$APACHE_CONFIG" ]; then
    echo -e "${BLUE}🔍 Detecting old IP from Apache config...${NC}"
    # Extract first VirtualHost IP
    OLD_IP=$(grep -m 1 "VirtualHost" "$APACHE_CONFIG" | grep -oE "[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}" | head -1)
    if [ -n "$OLD_IP" ]; then
        echo -e "${YELLOW}   Old IP detected: $OLD_IP${NC}"
    fi
fi

# ============================================================
# 2. UPDATE .env FILE (Vite configuration)
# ============================================================
ENV_FILE="$SCRIPT_DIR/.env"

if [ -f "$ENV_FILE" ]; then
    echo -e "${BLUE}📝 Updating .env file...${NC}"
    
    # Create backup
    cp "$ENV_FILE" "$ENV_FILE.bak"
    echo -e "${GREEN}   ✓ Backup created: .env.bak${NC}"
    
    # Update or create VITE_SERVER_HOST
    if grep -q "VITE_SERVER_HOST=" "$ENV_FILE"; then
        sed -i "s/VITE_SERVER_HOST=.*/VITE_SERVER_HOST=$NEW_IP/" "$ENV_FILE"
        echo -e "${GREEN}   ✓ Updated VITE_SERVER_HOST = $NEW_IP${NC}"
    else
        echo "VITE_SERVER_HOST=$NEW_IP" >> "$ENV_FILE"
        echo -e "${GREEN}   ✓ Added VITE_SERVER_HOST = $NEW_IP${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  .env file not found, creating...${NC}"
    echo "VITE_SERVER_HOST=$NEW_IP" > "$ENV_FILE"
    echo -e "${GREEN}   ✓ Created .env with VITE_SERVER_HOST = $NEW_IP${NC}"
fi

# ============================================================
# 3. UPDATE APACHE VIRTUALHOST CONFIGURATION
# ============================================================
if [ -f "$APACHE_CONFIG" ] && [ "$OLD_IP" != "$NEW_IP" ]; then
    echo ""
    echo -e "${BLUE}📝 Updating Apache configuration...${NC}"
    
    # Create backup
    cp "$APACHE_CONFIG" "$APACHE_CONFIG.bak"
    echo -e "${GREEN}   ✓ Backup created: ip-based.conf.bak${NC}"
    
    # Replace all occurrences of old IP with new IP in Apache config
    sed -i "s/$OLD_IP/$NEW_IP/g" "$APACHE_CONFIG"
    echo -e "${GREEN}   ✓ Updated VirtualHost IP: $OLD_IP → $NEW_IP${NC}"
    
    # Check if Apache can reload
    if command -v apachectl &> /dev/null; then
        echo -e "${BLUE}   Testing Apache configuration...${NC}"
        if apachectl configtest &> /dev/null; then
            echo -e "${GREEN}   ✓ Apache config syntax OK${NC}"
            echo -e "${YELLOW}   ⚠️  To apply changes, run: sudo apachectl restart${NC}"
        else
            echo -e "${RED}   ❌ Apache config has syntax errors!${NC}"
            echo -e "${RED}   Reverting to backup...${NC}"
            cp "$APACHE_CONFIG.bak" "$APACHE_CONFIG"
            exit 1
        fi
    fi
elif [ ! -f "$APACHE_CONFIG" ]; then
    echo ""
    echo -e "${YELLOW}⚠️  Apache config not found: $APACHE_CONFIG${NC}"
fi

# ============================================================
# 2. UPDATE PHP CONFIGURATION FILES (if any custom configs exist)
# ============================================================
echo ""
echo -e "${BLUE}📝 Checking PHP configuration files...${NC}"

# Check if there's a config file that needs updating
CONFIG_FILES=(
    "$SCRIPT_DIR/config/app-config.php"
    "$SCRIPT_DIR/config/settings.php"
)

for config_file in "${CONFIG_FILES[@]}"; do
    if [ -f "$config_file" ]; then
        echo -e "${GREEN}   ✓ Found: $config_file${NC}"
        # You can add custom update logic here if needed
    fi
done

# ============================================================
# 3. UPDATE VITE CONFIG (if needed)
# ============================================================
echo ""
echo -e "${BLUE}🔧 Vite Configuration:${NC}"
echo -e "${YELLOW}   Note: vite.config.js reads from .env automatically${NC}"
echo -e "${GREEN}   ✓ No changes needed in vite.config.js${NC}"

# ============================================================
# 4. INSTRUCTIONS FOR NEXT STEPS
# ============================================================
echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  ✅ IP UPDATE COMPLETED${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "${YELLOW}📋 Next steps:${NC}"
echo ""
echo "1️⃣  ${BLUE}Restart Apache to apply configuration changes:${NC}"
echo "   ${GREEN}sudo apachectl restart${NC}"
echo ""
echo "2️⃣  ${BLUE}Restart the Vite development server:${NC}"
echo "   ${GREEN}npm run dev${NC}"
echo ""
echo "3️⃣  ${BLUE}Or restart the entire application if in production${NC}"
echo ""
echo -e "${YELLOW}📝 Files updated:${NC}"
echo "   • .env (VITE_SERVER_HOST=$NEW_IP)"
if [ -f "$APACHE_CONFIG" ]; then
    echo "   • ip-based.conf (VirtualHost $NEW_IP)"
fi
echo ""
echo -e "${YELLOW}🔗 Your application will now use:${NC}"
echo "   • Server Host: ${GREEN}$NEW_IP${NC}"
echo "   • API Endpoint: ${GREEN}http://$NEW_IP/api${NC}"
echo "   • WebSocket: ${GREEN}ws://$NEW_IP:8080${NC}"
echo ""

# ============================================================
# 5. VERIFY CHANGES
# ============================================================
echo -e "${BLUE}🔍 Verification:${NC}"
echo -n "   .env - VITE_SERVER_HOST = "
grep "VITE_SERVER_HOST=" "$ENV_FILE" | cut -d'=' -f2 || echo "NOT SET"

if [ -f "$APACHE_CONFIG" ]; then
    echo -n "   Apache - VirtualHost IP = "
    grep -m 1 "VirtualHost" "$APACHE_CONFIG" | grep -oE "[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}" | head -1 || echo "NOT SET"
fi
echo ""

exit 0
