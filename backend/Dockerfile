FROM php:8.2-apache

# ✅ Fix MPM conflict (AH00534)
RUN a2dismod mpm_event 2>/dev/null || true \
    && a2enmod mpm_prefork

# Install PDO MySQL + SSL support
RUN apt-get update && apt-get install -y libssl-dev \
    && docker-php-ext-install pdo pdo_mysql

# Enable rewrite
RUN a2enmod rewrite

# Allow Railway dynamic PORT
RUN sed -i 's/80/${PORT}/g' /etc/apache2/sites-available/000-default.conf /etc/apache2/ports.conf
RUN echo "export PORT=${PORT:-8080}" >> /etc/apache2/envvars

# Copy code
COPY . /var/www/html/

# Permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html

# ✅ No CMD needed, use default apache2-foreground