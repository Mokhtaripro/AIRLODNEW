#!/bin/bash
set -e

# ============================================
# AIRLOD Digital Card - VPS Deployment Script
# Domain: new.airlodnetwork.com
# Folder: /opt/airlod-card (separate from airlodavis)
# ============================================

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

DOMAIN="new.airlodnetwork.com"
EMAIL="contact@airlod.com"
APP_DIR="/opt/airlod-card"
APP_PORT="3001"

echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}  AIRLOD Digital Card - Deployment${NC}"
echo -e "${BLUE}  Domain: ${DOMAIN}${NC}"
echo -e "${BLUE}  Dir:    ${APP_DIR}${NC}"
echo -e "${BLUE}============================================${NC}"

# Step 1: Install Docker if needed
echo -e "\n${YELLOW}[1/6] Checking Docker...${NC}"
if ! command -v docker &> /dev/null; then
    echo "Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
    systemctl enable docker
    systemctl start docker
    echo -e "${GREEN}Docker installed${NC}"
else
    echo -e "${GREEN}Docker already installed: $(docker --version)${NC}"
fi

if ! docker compose version &> /dev/null; then
    apt-get install -y docker-compose-plugin 2>/dev/null || true
fi

# Step 2: Install Git if needed
echo -e "\n${YELLOW}[2/6] Checking Git...${NC}"
if ! command -v git &> /dev/null; then
    apt-get install -y git
fi
echo -e "${GREEN}Git OK${NC}"

# Step 3: Clone or update the repo
echo -e "\n${YELLOW}[3/6] Getting application code...${NC}"
if [ -d "$APP_DIR" ]; then
    echo "Updating existing installation..."
    cd $APP_DIR
    git pull origin claude/recreate-airlod-app-XeqVd || true
else
    echo "Cloning repository..."
    git clone -b claude/recreate-airlod-app-XeqVd https://github.com/Mokhtaripro/AIRLODNEW.git $APP_DIR
    cd $APP_DIR
fi
echo -e "${GREEN}Code ready${NC}"

# Step 4: Create .env.local
echo -e "\n${YELLOW}[4/6] Configuring environment...${NC}"
if [ ! -f .env.local ]; then
    cat > .env.local << ENVEOF
# App Configuration
NEXT_PUBLIC_APP_URL=https://${DOMAIN}
NEXT_PUBLIC_SITE_URL=https://airlod.com
NODE_ENV=production
ENVEOF
    echo -e "${GREEN}.env.local created${NC}"
else
    echo -e "${GREEN}.env.local already exists${NC}"
fi

# Update docker-compose to use port 3001 (avoid conflict with other apps)
cat > docker-compose.yml << DCEOF
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: airlod-card
    restart: always
    ports:
      - "127.0.0.1:${APP_PORT}:3000"
    env_file:
      - .env.local
    networks:
      - airlod-card-network

networks:
  airlod-card-network:
    driver: bridge
DCEOF

# Step 5: Build and start
echo -e "\n${YELLOW}[5/6] Building and starting AIRLOD...${NC}"
docker compose down 2>/dev/null || true
docker compose up -d --build

echo -e "${GREEN}AIRLOD running on 127.0.0.1:${APP_PORT}${NC}"

# Step 6: Configure reverse proxy
echo -e "\n${YELLOW}[6/6] Configuring reverse proxy...${NC}"

# Check for Nginx
if command -v nginx &> /dev/null; then
    echo -e "${GREEN}Nginx detected${NC}"

    # Check if sites-available exists (standard setup)
    if [ -d /etc/nginx/sites-available ]; then
        NGINX_CONF="/etc/nginx/sites-available/airlod-card"
        NGINX_LINK="/etc/nginx/sites-enabled/airlod-card"
    elif [ -d /etc/nginx/conf.d ]; then
        NGINX_CONF="/etc/nginx/conf.d/airlod-card.conf"
        NGINX_LINK=""
    else
        mkdir -p /etc/nginx/conf.d
        NGINX_CONF="/etc/nginx/conf.d/airlod-card.conf"
        NGINX_LINK=""
    fi

    cat > "$NGINX_CONF" << NGINXEOF
server {
    listen 80;
    server_name ${DOMAIN};

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;

    # Proxy to AIRLOD card app
    location / {
        proxy_pass http://127.0.0.1:${APP_PORT};
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 86400;
    }

    # Cache static assets
    location /_next/static {
        proxy_pass http://127.0.0.1:${APP_PORT};
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
}
NGINXEOF

    if [ -n "$NGINX_LINK" ]; then
        ln -sf "$NGINX_CONF" "$NGINX_LINK"
    fi

    # Test and reload nginx
    nginx -t && systemctl reload nginx
    echo -e "${GREEN}Nginx vhost configured for ${DOMAIN}${NC}"

    # SSL with Certbot
    echo -e "\n${YELLOW}Setting up SSL certificate...${NC}"
    if ! command -v certbot &> /dev/null; then
        apt-get update -y
        apt-get install -y certbot python3-certbot-nginx
    fi

    echo -e "${YELLOW}Make sure DNS A record for ${DOMAIN} points to this server IP!${NC}"
    certbot --nginx -d $DOMAIN --email $EMAIL --agree-tos --non-interactive --redirect 2>&1 || {
        echo -e "${RED}SSL setup failed. Make sure:${NC}"
        echo -e "  1. DNS A record for ${DOMAIN} -> $(curl -s ifconfig.me)"
        echo -e "  2. Port 80 and 443 are open"
        echo -e "  3. Run manually: certbot --nginx -d ${DOMAIN}"
    }

elif command -v apache2 &> /dev/null; then
    echo -e "${GREEN}Apache detected${NC}"

    a2enmod proxy proxy_http proxy_wstunnel rewrite headers 2>/dev/null || true

    cat > /etc/apache2/sites-available/airlod-card.conf << APACHEEOF
<VirtualHost *:80>
    ServerName ${DOMAIN}

    ProxyPreserveHost On
    ProxyPass / http://127.0.0.1:${APP_PORT}/
    ProxyPassReverse / http://127.0.0.1:${APP_PORT}/

    RewriteEngine On
    RewriteCond %{HTTP:Upgrade} =websocket [NC]
    RewriteRule /(.*) ws://127.0.0.1:${APP_PORT}/\$1 [P,L]

    ErrorLog \${APACHE_LOG_DIR}/airlod-card-error.log
    CustomLog \${APACHE_LOG_DIR}/airlod-card-access.log combined
</VirtualHost>
APACHEEOF

    a2ensite airlod-card.conf
    systemctl reload apache2
    echo -e "${GREEN}Apache vhost configured for ${DOMAIN}${NC}"

    if ! command -v certbot &> /dev/null; then
        apt-get install -y certbot python3-certbot-apache
    fi
    certbot --apache -d $DOMAIN --email $EMAIL --agree-tos --non-interactive --redirect 2>&1 || {
        echo -e "${RED}SSL failed. Run manually: certbot --apache -d ${DOMAIN}${NC}"
    }
else
    echo -e "${YELLOW}No web server detected. Installing Nginx...${NC}"
    apt-get update -y
    apt-get install -y nginx certbot python3-certbot-nginx
    systemctl enable nginx
    systemctl start nginx
    # Re-run this script after nginx is installed
    echo -e "${GREEN}Nginx installed. Re-running proxy setup...${NC}"
    exec "$0"
fi

# Show status
echo ""
echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}  AIRLOD Digital Card - DEPLOYED!${NC}"
echo -e "${GREEN}============================================${NC}"
echo ""
echo -e "  URL:        https://${DOMAIN}"
echo -e "  App Dir:    ${APP_DIR}"
echo -e "  Container:  airlod-card"
echo -e "  Port:       127.0.0.1:${APP_PORT}"
echo -e "  Server IP:  $(curl -s ifconfig.me 2>/dev/null || echo 'N/A')"
echo ""
echo -e "  ${YELLOW}IMPORTANT: Set DNS A record:${NC}"
echo -e "  ${DOMAIN} -> $(curl -s ifconfig.me 2>/dev/null || echo 'YOUR_SERVER_IP')"
echo ""
echo -e "  Useful commands:"
echo -e "    cd ${APP_DIR} && docker compose logs -f     # View logs"
echo -e "    cd ${APP_DIR} && docker compose restart     # Restart"
echo -e "    cd ${APP_DIR} && docker compose down        # Stop"
echo -e "    cd ${APP_DIR} && docker compose up -d --build  # Rebuild"
echo ""
