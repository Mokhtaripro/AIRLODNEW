#!/bin/bash
set -e

# ============================================
# AIRLOD VPS Deployment Script (Hostinger)
# Compatible with existing apps on the VPS
# ============================================

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

DOMAIN="app.airlod.com"
EMAIL="contact@airlod.com"
APP_DIR="/opt/airlod"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  AIRLOD Deployment Script (Hostinger)${NC}"
echo -e "${BLUE}========================================${NC}"

# Step 1: Install Docker if needed
echo -e "\n${YELLOW}[1/5] Checking Docker...${NC}"
if ! command -v docker &> /dev/null; then
    echo "Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
    systemctl enable docker
    systemctl start docker
    echo -e "${GREEN}Docker installed successfully${NC}"
else
    echo -e "${GREEN}Docker already installed${NC}"
fi

if ! docker compose version &> /dev/null; then
    apt-get install -y docker-compose-plugin 2>/dev/null || true
fi

# Step 2: Setup application
echo -e "\n${YELLOW}[2/5] Setting up application...${NC}"
mkdir -p $APP_DIR
cd $APP_DIR

# Step 3: Create .env.local if needed
if [ ! -f .env.local ]; then
    echo -e "\n${YELLOW}[3/5] Creating .env.local...${NC}"
    cat > .env.local << 'ENVEOF'
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# App Configuration
NEXT_PUBLIC_APP_URL=https://app.airlod.com
NEXT_PUBLIC_SITE_URL=https://airlod.com
ENVEOF
    echo -e "${RED}IMPORTANT: Edit .env.local with your Supabase credentials${NC}"
    echo -e "${RED}Run: nano $APP_DIR/.env.local${NC}"
else
    echo -e "${GREEN}.env.local already exists${NC}"
fi

# Step 4: Build and start the app container (port 3000 on localhost only)
echo -e "\n${YELLOW}[4/5] Building and starting AIRLOD...${NC}"
docker compose up -d --build

echo -e "${GREEN}AIRLOD app running on 127.0.0.1:3000${NC}"

# Step 5: Configure reverse proxy
echo -e "\n${YELLOW}[5/5] Reverse proxy configuration...${NC}"

# Detect existing web server
if command -v nginx &> /dev/null && systemctl is-active --quiet nginx; then
    echo -e "${GREEN}Nginx detected on the system${NC}"

    # Create Nginx vhost for app.airlod.com
    cat > /etc/nginx/sites-available/airlod << 'NGINXEOF'
server {
    listen 80;
    server_name app.airlod.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }
}
NGINXEOF

    ln -sf /etc/nginx/sites-available/airlod /etc/nginx/sites-enabled/airlod
    nginx -t && systemctl reload nginx
    echo -e "${GREEN}Nginx vhost created and loaded${NC}"

    # SSL with certbot
    echo -e "\n${YELLOW}Setting up SSL...${NC}"
    if command -v certbot &> /dev/null; then
        certbot --nginx -d $DOMAIN --email $EMAIL --agree-tos --non-interactive --redirect 2>/dev/null || {
            echo -e "${YELLOW}Certbot failed - make sure DNS for $DOMAIN points to this server${NC}"
            echo -e "Run manually: certbot --nginx -d $DOMAIN"
        }
    else
        apt-get install -y certbot python3-certbot-nginx 2>/dev/null || true
        certbot --nginx -d $DOMAIN --email $EMAIL --agree-tos --non-interactive --redirect 2>/dev/null || {
            echo -e "${YELLOW}Certbot failed - make sure DNS for $DOMAIN points to this server${NC}"
            echo -e "Run manually: certbot --nginx -d $DOMAIN"
        }
    fi

elif command -v apache2 &> /dev/null && systemctl is-active --quiet apache2; then
    echo -e "${GREEN}Apache detected on the system${NC}"

    # Enable required modules
    a2enmod proxy proxy_http proxy_wstunnel rewrite ssl headers 2>/dev/null

    # Create Apache vhost for app.airlod.com
    cat > /etc/apache2/sites-available/airlod.conf << 'APACHEEOF'
<VirtualHost *:80>
    ServerName app.airlod.com

    ProxyPreserveHost On
    ProxyPass / http://127.0.0.1:3000/
    ProxyPassReverse / http://127.0.0.1:3000/

    # WebSocket support
    RewriteEngine On
    RewriteCond %{HTTP:Upgrade} =websocket [NC]
    RewriteRule /(.*) ws://127.0.0.1:3000/$1 [P,L]

    ErrorLog ${APACHE_LOG_DIR}/airlod-error.log
    CustomLog ${APACHE_LOG_DIR}/airlod-access.log combined
</VirtualHost>
APACHEEOF

    a2ensite airlod.conf
    systemctl reload apache2
    echo -e "${GREEN}Apache vhost created and loaded${NC}"

    # SSL with certbot
    echo -e "\n${YELLOW}Setting up SSL...${NC}"
    if ! command -v certbot &> /dev/null; then
        apt-get install -y certbot python3-certbot-apache 2>/dev/null || true
    fi
    certbot --apache -d $DOMAIN --email $EMAIL --agree-tos --non-interactive --redirect 2>/dev/null || {
        echo -e "${YELLOW}Certbot failed - make sure DNS for $DOMAIN points to this server${NC}"
        echo -e "Run manually: certbot --apache -d $DOMAIN"
    }

else
    echo -e "${YELLOW}No Nginx or Apache detected.${NC}"
    echo -e "The app is running on port 3000."
    echo -e "You need to set up a reverse proxy manually."
    echo -e "\nTo install Nginx and configure:"
    echo -e "  apt install nginx certbot python3-certbot-nginx"
    echo -e "  Then re-run this script"
fi

echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}  AIRLOD deployed successfully!${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "App URL: https://${DOMAIN}"
echo -e "App Dir: ${APP_DIR}"
echo -e "\nUseful commands:"
echo -e "  cd $APP_DIR && docker compose logs -f app    # View logs"
echo -e "  cd $APP_DIR && docker compose restart app    # Restart"
echo -e "  cd $APP_DIR && docker compose down           # Stop"
echo -e "  cd $APP_DIR && docker compose up -d --build  # Rebuild"
